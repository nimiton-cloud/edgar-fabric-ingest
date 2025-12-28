import { Filing } from "../sec/filings";
import { buildDocumentUrl, cikNoLeadingZeros, normalizeAccession } from "../util/normalize";
import { PayloadItem } from "./commands";

type EdgarFilingPayloadOptions = {
  issuerName?: string;
  cik: string;
};

export const buildEdgarFilingPayload = (
  filings: Filing[],
  options: EdgarFilingPayloadOptions
): PayloadItem[] => {
  const displayCik = cikNoLeadingZeros(options.cik);

  return filings.map((filing) => {
    const accessionNumber = normalizeAccession(filing.accessionNumber);
    const filingYear = filing.filingDate.slice(0, 4);
    const name = options.issuerName
      ? `${options.issuerName} ${filing.form} ${filingYear}`
      : `${displayCik} ${filing.form} ${filing.filingDate}`;

    return {
      Id: accessionNumber,
      Name: name,
      Source: "sec",
      SourceDetail: buildDocumentUrl(
        options.cik,
        accessionNumber,
        filing.primaryDocument
      ),
      Channel: "edgar",
      ChannelDetail: `${filing.form}/${accessionNumber}`,
      Metrics: [
        {
          key: "FormType",
          value: filing.form,
          asOf: filing.filingDate
        },
        {
          key: "CIK",
          value: displayCik,
          asOf: filing.filingDate
        },
        {
          key: "FilingDate",
          value: filing.filingDate,
          asOf: filing.filingDate
        },
        {
          key: "AccessionNumber",
          value: accessionNumber,
          asOf: filing.filingDate
        },
        {
          key: "DocumentUrl",
          value: buildDocumentUrl(
            options.cik,
            accessionNumber,
            filing.primaryDocument
          ),
          asOf: filing.filingDate
        }
      ]
    };
  });
};
