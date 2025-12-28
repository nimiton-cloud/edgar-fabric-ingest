import {
  BondMetricAllowlist,
  CompanyMetricAllowlist,
  FilingMetricAllowlist
} from "./allowlist";

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

export const filterMetrics = (
  metrics: Metric[],
  allowlist: Set<string>,
  verbose?: boolean
): Metric[] => {
  return metrics.filter((metric) => {
    if (allowlist.has(metric.key)) {
      return true;
    }
    if (verbose) {
      console.error(`Dropping metric outside allowlist: ${metric.key}`);
    }
    return false;
  });
};

export const buildCompanyCommand = (
  payload: PayloadItem,
  verbose?: boolean
): Command => {
  const metrics = payload.Metrics ?? [];
  return {
    Command: "AddCompany",
    Payload: [
      {
        ...payload,
        Metrics: filterMetrics(metrics, CompanyMetricAllowlist, verbose)
      }
    ]
  };
};

export const buildFilingCommand = (
  payload: PayloadItem[],
  verbose?: boolean
): Command => {
  return {
    Command: "AddFiling",
    Payload: payload.map((item) => ({
      ...item,
      Metrics: filterMetrics(item.Metrics ?? [], FilingMetricAllowlist, verbose)
    }))
  };
};

export const filterBondMetrics = (
  metrics: Metric[],
  verbose?: boolean
): Metric[] => {
  return filterMetrics(metrics, BondMetricAllowlist, verbose);
};
