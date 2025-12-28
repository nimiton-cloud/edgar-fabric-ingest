import { describe, expect, it } from "vitest";
import { buildDocumentUrl, normalizeCik } from "../src/util/normalize";

describe("normalizeCik", () => {
  it("pads CIK to 10 digits", () => {
    expect(normalizeCik("789019")).toBe("0000789019");
  });
});

describe("buildDocumentUrl", () => {
  it("builds document URL with no leading zeros and no accession dashes", () => {
    const url = buildDocumentUrl(
      "0000789019",
      "0000789019-23-000123",
      "doc.htm"
    );
    expect(url).toBe(
      "https://www.sec.gov/Archives/edgar/data/789019/000078901923000123/doc.htm"
    );
  });
});
