import { fetchJson, HttpClientOptions } from "../util/http";

export type SubmissionsResponse = {
  cik: string;
  name?: string;
  filings?: {
    recent?: {
      accessionNumber?: string[];
      filingDate?: string[];
      form?: string[];
      primaryDocument?: string[];
    };
  };
};

export const fetchSubmissions = async (
  cik: string,
  clientOptions: HttpClientOptions
): Promise<SubmissionsResponse> => {
  const url = `https://data.sec.gov/submissions/CIK${cik}.json`;
  return fetchJson<SubmissionsResponse>(url, clientOptions);
};
