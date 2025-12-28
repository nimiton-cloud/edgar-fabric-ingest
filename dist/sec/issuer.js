"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveIssuer = exports.isCik = void 0;
const http_1 = require("../util/http");
const normalize_1 = require("../util/normalize");
const TICKER_URL = "https://www.sec.gov/files/company_tickers.json";
const isCik = (issuer) => {
    return /^[0-9]+$/.test(issuer.trim());
};
exports.isCik = isCik;
const resolveIssuer = async (issuer, clientOptions) => {
    if ((0, exports.isCik)(issuer)) {
        return { cik: (0, normalize_1.normalizeCik)(issuer) };
    }
    const mapping = await (0, http_1.fetchJson)(TICKER_URL, clientOptions);
    const normalizedTicker = issuer.trim().toUpperCase();
    const entry = Object.values(mapping).find((value) => value.ticker.toUpperCase() === normalizedTicker);
    if (!entry) {
        throw new Error(`Unable to resolve ticker: ${issuer}`);
    }
    return {
        cik: (0, normalize_1.normalizeCik)(entry.cik_str.toString()),
        ticker: entry.ticker,
        name: entry.title
    };
};
exports.resolveIssuer = resolveIssuer;
