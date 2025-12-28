import { fetchJson, HttpClientOptions } from "../util/http";
import { normalizeCik } from "../util/normalize";

export type IssuerResolution = {
  cik: string;
  ticker?: string;
  name?: string;
};

type TickerMappingEntry = {
  cik_str: number;
  ticker: string;
  title: string;
};

type CompanyTickerResponse = Record<string, TickerMappingEntry>;

const TICKER_URL = "https://www.sec.gov/files/company_tickers.json";

export const isCik = (issuer: string): boolean => {
  return /^[0-9]+$/.test(issuer.trim());
};

export const resolveIssuer = async (
  issuer: string,
  clientOptions: HttpClientOptions
): Promise<IssuerResolution> => {
  if (isCik(issuer)) {
    return { cik: normalizeCik(issuer) };
  }

  const mapping = await fetchJson<CompanyTickerResponse>(
    TICKER_URL,
    clientOptions
  );

  const normalizedTicker = issuer.trim().toUpperCase();
  const entry = Object.values(mapping).find(
    (value) => value.ticker.toUpperCase() === normalizedTicker
  );

  if (!entry) {
    throw new Error(`Unable to resolve ticker: ${issuer}`);
  }

  return {
    cik: normalizeCik(entry.cik_str.toString()),
    ticker: entry.ticker,
    name: entry.title
  };
};
