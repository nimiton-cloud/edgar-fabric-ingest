"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterBondMetrics = exports.buildFilingCommand = exports.buildCompanyCommand = exports.filterMetrics = void 0;
const allowlist_1 = require("./allowlist");
const filterMetrics = (metrics, allowlist, verbose) => {
    return metrics.filter((metric) => {
        if (allowlist.has(metric.key)) {
            return true;
        }
        if (verbose) {
            console.error(`Dropping metric outside allowlist: ${metric.key}`);
        }
        return false;
    });
};
exports.filterMetrics = filterMetrics;
const buildCompanyCommand = (payload, verbose) => {
    const metrics = payload.Metrics ?? [];
    return {
        Command: "AddCompany",
        Payload: [
            {
                ...payload,
                Metrics: (0, exports.filterMetrics)(metrics, allowlist_1.CompanyMetricAllowlist, verbose)
            }
        ]
    };
};
exports.buildCompanyCommand = buildCompanyCommand;
const buildFilingCommand = (payload, verbose) => {
    return {
        Command: "AddFiling",
        Payload: payload.map((item) => ({
            ...item,
            Metrics: (0, exports.filterMetrics)(item.Metrics ?? [], allowlist_1.FilingMetricAllowlist, verbose)
        }))
    };
};
exports.buildFilingCommand = buildFilingCommand;
const filterBondMetrics = (metrics, verbose) => {
    return (0, exports.filterMetrics)(metrics, allowlist_1.BondMetricAllowlist, verbose);
};
exports.filterBondMetrics = filterBondMetrics;
