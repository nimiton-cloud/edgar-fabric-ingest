export type HttpClientOptions = {
    userAgent: string;
    delayMs?: number;
    retries?: number;
    backoffMs?: number;
    verbose?: boolean;
};
export type FetchJsonOptions = {
    headers?: Record<string, string>;
};
export declare const fetchJson: <T>(url: string, clientOptions: HttpClientOptions, options?: FetchJsonOptions) => Promise<T>;
export declare const postJson: (url: string, body: unknown, clientOptions: HttpClientOptions) => Promise<void>;
