export const normalizeCik = (cik: string): string => {
  const digits = cik.replace(/\D/g, "");
  if (!digits) {
    throw new Error("CIK must contain digits");
  }
  return digits.padStart(10, "0");
};

export const cikNoLeadingZeros = (cik: string): string => {
  return normalizeCik(cik).replace(/^0+/, "") || "0";
};

export const normalizeAccession = (accession: string): string => {
  return accession.trim();
};

export const buildDocumentUrl = (
  cik: string,
  accessionNumber: string,
  primaryDocument: string
): string => {
  const cikNoZeros = cikNoLeadingZeros(cik);
  const accessionNoDashes = accessionNumber.replace(/-/g, "");
  return `https://www.sec.gov/Archives/edgar/data/${cikNoZeros}/${accessionNoDashes}/${primaryDocument}`;
};

export const parseDate = (value: string): Date => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Invalid date: ${value}`);
  }
  return parsed;
};

export const isDateInRange = (
  value: string,
  after: string,
  before: string
): boolean => {
  const date = parseDate(value).getTime();
  return (
    date >= parseDate(after).getTime() && date <= parseDate(before).getTime()
  );
};
