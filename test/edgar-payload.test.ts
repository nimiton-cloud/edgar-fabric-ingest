import { describe, expect, it } from "vitest";
import { buildEdgarFilingPayload } from "../src/fabric/edgar";
import { Filing } from "../src/sec/filings";

describe("buildEdgarFilingPayload", () => {
  it("builds AddData lineage fields for filings", () => {
    const filings: Filing[] = [
      {
        accessionNumber: "0000320193-24-000069",
        filingDate: "2024-10-31",
        form: "10-K",
        primaryDocument: "aapl-20240928.htm"
      }
    ];

    const payload = buildEdgarFilingPayload(filings, {
      issuerName: "Apple Inc",
      cik: "0000320193"
    });

    expect(payload).toHaveLength(1);
    expect(payload[0]).toMatchObject({
      Id: "0000320193-24-000069",
      ChannelDetail: "10-K/0000320193-24-000069",
      SourceDetail:
        "https://www.sec.gov/Archives/edgar/data/320193/000032019324000069/aapl-20240928.htm"
    });
  });
});
