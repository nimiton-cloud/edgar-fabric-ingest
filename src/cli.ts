#!/usr/bin/env node
import { buildCompanyCommand, buildFilingCommand, Command } from "./fabric/commands";
import { fetchSubmissions } from "./sec/client";
import { extractFilings } from "./sec/filings";
import { resolveIssuer } from "./sec/issuer";
import { postJson } from "./util/http";
import { buildDocumentUrl, normalizeCik, normalizeAccession } from "./util/normalize";

const DEFAULT_USER_AGENT =
  "cmdrvl-edgar-fabric-ingest (contact: contact@example.com)";

type CliOptions = {
  issuer: string;
  after: string;
  before: string;
  forms: string[];
  out: "json" | "ndjson";
  post?: string;
  dryRun: boolean;
  verbose: boolean;
  delayMs: number;
};

const parseArgs = (argv: string[]): CliOptions => {
  const args = [...argv];
  const options: Partial<CliOptions> = {
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
    throw new Error(
      "Missing required args: --issuer, --after, --before, --forms"
    );
  }

  return options as CliOptions;
};

const buildCommands = async (options: CliOptions): Promise<Command[]> => {
  const clientOptions = {
    userAgent: DEFAULT_USER_AGENT,
    delayMs: options.delayMs,
    verbose: options.verbose
  };

  const issuer = await resolveIssuer(options.issuer, clientOptions);
  const normalizedCik = normalizeCik(issuer.cik);

  const submissions = await fetchSubmissions(normalizedCik, clientOptions);
  const issuerName = issuer.name ?? submissions.name;

  const filings = extractFilings(
    submissions,
    options.forms,
    options.after,
    options.before
  );

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

  const companyCommand = buildCompanyCommand(
    {
      Id: normalizedCik,
      Name: issuerName,
      Source: "sec",
      Channel: "edgar",
      Metrics: companyMetrics
    },
    options.verbose
  );

  const filingPayload = filings.map((filing) => {
    const accessionNumber = normalizeAccession(filing.accessionNumber);
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
          value: buildDocumentUrl(
            normalizedCik,
            accessionNumber,
            filing.primaryDocument
          ),
          asOf: filing.filingDate
        }
      ]
    };
  });

  const filingCommand = buildFilingCommand(filingPayload, options.verbose);
  return [companyCommand, filingCommand];
};

const outputCommands = async (
  commands: Command[],
  options: CliOptions
): Promise<void> => {
  if (options.post && !options.dryRun) {
    for (const command of commands) {
      await postJson(options.post, command, {
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
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(message);
    process.exitCode = 1;
  }
};

void main();
