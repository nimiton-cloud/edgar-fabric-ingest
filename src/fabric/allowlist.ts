export const CompanyMetricAllowlist = new Set(["CIK", "Ticker", "LEI"]);
export const FilingMetricAllowlist = new Set([
  "FormType",
  "CIK",
  "FilingDate",
  "AccessionNumber",
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
