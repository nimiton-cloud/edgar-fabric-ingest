import { SubmissionsResponse } from "./client";
export type Filing = {
    form: string;
    accessionNumber: string;
    filingDate: string;
    primaryDocument: string;
};
export declare const extractFilings: (submissions: SubmissionsResponse, forms: string[], after: string, before: string) => Filing[];
