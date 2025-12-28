"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractFilings = void 0;
const normalize_1 = require("../util/normalize");
const extractFilings = (submissions, forms, after, before) => {
    const recent = submissions.filings?.recent;
    if (!recent) {
        return [];
    }
    const accessionNumbers = recent.accessionNumber ?? [];
    const filingDates = recent.filingDate ?? [];
    const formTypes = recent.form ?? [];
    const primaryDocuments = recent.primaryDocument ?? [];
    const normalizedForms = forms.map((form) => form.trim().toUpperCase());
    const results = [];
    const count = Math.min(accessionNumbers.length, filingDates.length, formTypes.length, primaryDocuments.length);
    for (let index = 0; index < count; index += 1) {
        const form = formTypes[index]?.toUpperCase();
        const filingDate = filingDates[index];
        if (!form || !filingDate) {
            continue;
        }
        if (!normalizedForms.includes(form)) {
            continue;
        }
        if (!(0, normalize_1.isDateInRange)(filingDate, after, before)) {
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
exports.extractFilings = extractFilings;
