#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commands_1 = require("./fabric/commands");
const client_1 = require("./sec/client");
const filings_1 = require("./sec/filings");
const issuer_1 = require("./sec/issuer");
const http_1 = require("./util/http");
const normalize_1 = require("./util/normalize");
const DEFAULT_USER_AGENT = "cmdrvl-edgar-fabric-ingest (contact: contact@example.com)";
const parseArgs = (argv) => {
    const args = [...argv];
    const options = {
        out: "json",
        dryRun: false,
        verbose: false,
        delayMs: 200
    };
    while (args.length > 0) {
        const arg = args.shift();
        if (!arg) {
            continue;
        }
        switch (arg) {
            case "--issuer":
                options.issuer = args.shift();
                break;
            case "--after":
                options.after = args.shift();
                break;
            case "--before":
                options.before = args.shift();
                break;
            case "--forms":
                options.forms = (args.shift() ?? "")
                    .split(",")
                    .map((value) => value.trim())
                    .filter(Boolean);
                break;
            case "--out":
                options.out = args.shift() === "ndjson" ? "ndjson" : "json";
                break;
            case "--post":
                options.post = args.shift();
                break;
            case "--dry-run":
                options.dryRun = true;
                break;
            case "--verbose":
                options.verbose = true;
                break;
            case "--delay":
                options.delayMs = Number(args.shift() ?? 200);
                break;
            default:
                throw new Error(`Unknown argument: ${arg}`);
        }
    }
    if (!options.issuer || !options.after || !options.before || !options.forms) {
        throw new Error("Missing required args: --issuer, --after, --before, --forms");
    }
    return options;
};
const buildCommands = async (options) => {
    const clientOptions = {
        userAgent: DEFAULT_USER_AGENT,
        delayMs: options.delayMs,
        verbose: options.verbose
    };
    const issuer = await (0, issuer_1.resolveIssuer)(options.issuer, clientOptions);
    const normalizedCik = (0, normalize_1.normalizeCik)(issuer.cik);
    const submissions = await (0, client_1.fetchSubmissions)(normalizedCik, clientOptions);
    const issuerName = issuer.name ?? submissions.name;
    const filings = (0, filings_1.extractFilings)(submissions, options.forms, options.after, options.before);
    const asOfCompany = options.after;
    const companyMetrics = [
        {
            key: "CIK",
            value: normalizedCik,
            asOf: asOfCompany
        },
        ...(issuer.ticker
            ? [
                {
                    key: "Ticker",
                    value: issuer.ticker,
                    asOf: asOfCompany
                }
            ]
            : [])
    ];
    const companyCommand = (0, commands_1.buildCompanyCommand)({
        Id: normalizedCik,
        Name: issuerName,
        Source: "sec",
        Channel: "edgar",
        Metrics: companyMetrics
    }, options.verbose);
    const filingPayload = filings.map((filing) => {
        const accessionNumber = (0, normalize_1.normalizeAccession)(filing.accessionNumber);
        return {
            Id: accessionNumber,
            Name: `${filing.form} ${filing.filingDate}`,
            Source: "sec",
            Channel: "edgar",
            Metrics: [
                {
                    key: "FormType",
                    value: filing.form,
                    asOf: filing.filingDate
                },
                {
                    key: "AccessionNumber",
                    value: accessionNumber,
                    asOf: filing.filingDate
                },
                {
                    key: "FilingDate",
                    value: filing.filingDate,
                    asOf: filing.filingDate
                },
                {
                    key: "DocumentUrl",
                    value: (0, normalize_1.buildDocumentUrl)(normalizedCik, accessionNumber, filing.primaryDocument),
                    asOf: filing.filingDate
                }
            ]
        };
    });
    const filingCommand = (0, commands_1.buildFilingCommand)(filingPayload, options.verbose);
    return [companyCommand, filingCommand];
};
const outputCommands = async (commands, options) => {
    if (options.post && !options.dryRun) {
        for (const command of commands) {
            await (0, http_1.postJson)(options.post, command, {
                userAgent: DEFAULT_USER_AGENT
            });
        }
    }
    if (options.out === "ndjson") {
        for (const command of commands) {
            process.stdout.write(`${JSON.stringify(command)}\n`);
        }
        return;
    }
    process.stdout.write(`${JSON.stringify(commands, null, 2)}\n`);
};
const main = async () => {
    try {
        const options = parseArgs(process.argv.slice(2));
        const commands = await buildCommands(options);
        await outputCommands(commands, options);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error(message);
        process.exitCode = 1;
    }
};
void main();
