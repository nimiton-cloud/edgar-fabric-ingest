import { HttpClientOptions } from "../util/http";
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
export declare const fetchSubmissions: (cik: string, clientOptions: HttpClientOptions) => Promise<SubmissionsResponse>;
