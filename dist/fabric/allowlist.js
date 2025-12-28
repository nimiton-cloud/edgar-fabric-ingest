"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BondMetricAllowlist = exports.FilingMetricAllowlist = exports.CompanyMetricAllowlist = void 0;
exports.CompanyMetricAllowlist = new Set(["CIK", "Ticker", "LEI"]);
exports.FilingMetricAllowlist = new Set([
    "FormType",
    "AccessionNumber",
    "FilingDate",
    "DocumentUrl"
]);
exports.BondMetricAllowlist = new Set([
    "CUSIP",
    "ISIN",
    "IssueDate",
    "MaturityDate",
    "Amount",
    "Currency",
    "Coupon",
    "Issuer"
]);
