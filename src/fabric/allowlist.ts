export const CompanyMetricAllowlist = new Set(["CIK", "Ticker", "LEI"]);
export const FilingMetricAllowlist = new Set([
  "FormType",
  "AccessionNumber",
  "FilingDate",
  "DocumentUrl"
]);
export const BondMetricAllowlist = new Set([
  "CUSIP",
  "ISIN",
  "IssueDate",
  "MaturityDate",
  "Amount",
  "Currency",
  "Coupon",
  "Issuer"
]);
