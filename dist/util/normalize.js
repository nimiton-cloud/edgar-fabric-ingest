"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDateInRange = exports.parseDate = exports.buildDocumentUrl = exports.normalizeAccession = exports.cikNoLeadingZeros = exports.normalizeCik = void 0;
const normalizeCik = (cik) => {
    const digits = cik.replace(/\D/g, "");
    if (!digits) {
        throw new Error("CIK must contain digits");
    }
    return digits.padStart(10, "0");
};
exports.normalizeCik = normalizeCik;
const cikNoLeadingZeros = (cik) => {
    return (0, exports.normalizeCik)(cik).replace(/^0+/, "") || "0";
};
exports.cikNoLeadingZeros = cikNoLeadingZeros;
const normalizeAccession = (accession) => {
    return accession.trim();
};
exports.normalizeAccession = normalizeAccession;
const buildDocumentUrl = (cik, accessionNumber, primaryDocument) => {
    const cikNoZeros = (0, exports.cikNoLeadingZeros)(cik);
    const accessionNoDashes = accessionNumber.replace(/-/g, "");
    return `https://www.sec.gov/Archives/edgar/data/${cikNoZeros}/${accessionNoDashes}/${primaryDocument}`;
};
exports.buildDocumentUrl = buildDocumentUrl;
const parseDate = (value) => {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
        throw new Error(`Invalid date: ${value}`);
    }
    return parsed;
};
exports.parseDate = parseDate;
const isDateInRange = (value, after, before) => {
    const date = (0, exports.parseDate)(value).getTime();
    return (date >= (0, exports.parseDate)(after).getTime() && date <= (0, exports.parseDate)(before).getTime());
};
exports.isDateInRange = isDateInRange;
