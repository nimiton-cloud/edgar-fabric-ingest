import { describe, expect, it } from "vitest";
import { extractFilings } from "../src/sec/filings";
import { SubmissionsResponse } from "../src/sec/client";

describe("extractFilings", () => {
  it("orders filings deterministically", () => {
    const submissions: SubmissionsResponse = {
      cik: "0000000001",
      filings: {
        recent: {
          accessionNumber: [
            "0000000001-23-000002",
            "0000000001-23-000001",
            "0000000001-23-000003"
          ],
          filingDate: ["2023-02-01", "2023-01-15", "2023-02-01"],
          form: ["10-Q", "10-K", "10-Q"],
          primaryDocument: ["doc2.htm", "doc1.htm", "doc3.htm"]
        }
      }
    };

    const results = extractFilings(
      submissions,
      ["10-K", "10-Q"],
      "2023-01-01",
      "2023-12-31"
    );

    expect(results).toMatchInlineSnapshot(`
      [
        {
          "accessionNumber": "0000000001-23-000001",
          "filingDate": "2023-01-15",
          "form": "10-K",
          "primaryDocument": "doc1.htm",
        },
        {
          "accessionNumber": "0000000001-23-000002",
          "filingDate": "2023-02-01",
          "form": "10-Q",
          "primaryDocument": "doc2.htm",
        },
        {
          "accessionNumber": "0000000001-23-000003",
          "filingDate": "2023-02-01",
          "form": "10-Q",
          "primaryDocument": "doc3.htm",
        },
      ]
    `);
  });
});
