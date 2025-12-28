export type Metric = {
    key: string;
    value: string;
    asOf: string;
};
export type PayloadItem = {
    Id: string;
    Name?: string;
    Source: string;
    SourceDetail?: string;
    Channel: string;
    ChannelDetail?: string;
    Metrics?: Metric[];
    MergeMatch?: string[];
    MergeKey?: string;
};
export type Command = {
    Command: string;
    Payload: PayloadItem[];
};
export declare const filterMetrics: (metrics: Metric[], allowlist: Set<string>, verbose?: boolean) => Metric[];
export declare const buildCompanyCommand: (payload: PayloadItem, verbose?: boolean) => Command;
export declare const buildFilingCommand: (payload: PayloadItem[], verbose?: boolean) => Command;
export declare const filterBondMetrics: (metrics: Metric[], verbose?: boolean) => Metric[];
