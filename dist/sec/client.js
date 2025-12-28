"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchSubmissions = void 0;
const http_1 = require("../util/http");
const fetchSubmissions = async (cik, clientOptions) => {
    const url = `https://data.sec.gov/submissions/CIK${cik}.json`;
    return (0, http_1.fetchJson)(url, clientOptions);
};
exports.fetchSubmissions = fetchSubmissions;
