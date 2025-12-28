import { isDateInRange } from "../util/normalize";
import { SubmissionsResponse } from "./client";

export type Filing = {
  form: string;
  accessionNumber: string;
  filingDate: string;
  primaryDocument: string;
};

export const extractFilings = (
  submissions: SubmissionsResponse,
  forms: string[],
  after: string,
  before: string
): Filing[] => {
  const recent = submissions.filings?.recent;
  if (!recent) {
    return [];
  }

  const accessionNumbers = recent.accessionNumber ?? [];
  const filingDates = recent.filingDate ?? [];
  const formTypes = recent.form ?? [];
  const primaryDocuments = recent.primaryDocument ?? [];

  const normalizedForms = forms.map((form) => form.trim().toUpperCase());

  const results: Filing[] = [];
  const count = Math.min(
    accessionNumbers.length,
    filingDates.length,
    formTypes.length,
    primaryDocuments.length
  );

  for (let index = 0; index < count; index += 1) {
    const form = formTypes[index]?.toUpperCase();
    const filingDate = filingDates[index];
    if (!form || !filingDate) {
      continue;
    }
    if (!normalizedForms.includes(form)) {
      continue;
    }
    if (!isDateInRange(filingDate, after, before)) {
      continue;
    }
    results.push({
      form,
      accessionNumber: accessionNumbers[index],
      filingDate,
      primaryDocument: primaryDocuments[index]
    });
  }

  return results.sort((a, b) => {
    if (a.filingDate === b.filingDate) {
      return a.accessionNumber.localeCompare(b.accessionNumber);
    }
    return a.filingDate.localeCompare(b.filingDate);
  });
};
