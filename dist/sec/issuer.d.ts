import { HttpClientOptions } from "../util/http";
export type IssuerResolution = {
    cik: string;
    ticker?: string;
    name?: string;
};
export declare const isCik: (issuer: string) => boolean;
export declare const resolveIssuer: (issuer: string, clientOptions: HttpClientOptions) => Promise<IssuerResolution>;
