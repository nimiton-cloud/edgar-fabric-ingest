# edgar-fabric-ingest

A V0 CLI to fetch SEC EDGAR filings and emit CMD+RVL Fabric command JSON.

## Usage

```bash
npx edgar-fabric-ingest \
  --issuer MSFT \
  --after 2023-01-01 \
  --before 2023-12-31 \
  --forms 10-K,10-Q \
  --out json
```

Post commands to an endpoint:

```bash
npx edgar-fabric-ingest \
  --issuer 0000789019 \
  --after 2023-01-01 \
  --before 2023-12-31 \
  --forms 10-K,10-Q \
  --post https://example.com/ingest \
  --dry-run
```

## Output

### JSON (default)

```json
[
  {
    "Command": "AddCompany",
    "Payload": [
      {
        "Id": "0000789019",
        "Name": "Microsoft Corp",
        "Source": "sec",
        "Channel": "edgar",
        "Metrics": [
          { "key": "CIK", "value": "0000789019", "asOf": "2023-01-01" },
          { "key": "Ticker", "value": "MSFT", "asOf": "2023-01-01" }
        ]
      }
    ]
  },
  {
    "Command": "AddFiling",
    "Payload": [
      {
        "Id": "0000789019-23-000123",
        "Name": "10-K 2023-08-03",
        "Source": "sec",
        "Channel": "edgar",
        "Metrics": [
          { "key": "FormType", "value": "10-K", "asOf": "2023-08-03" },
          {
            "key": "AccessionNumber",
            "value": "0000789019-23-000123",
            "asOf": "2023-08-03"
          },
          { "key": "FilingDate", "value": "2023-08-03", "asOf": "2023-08-03" },
          {
            "key": "DocumentUrl",
            "value": "https://www.sec.gov/Archives/edgar/data/789019/000078901923000123/doc.htm",
            "asOf": "2023-08-03"
          }
        ]
      }
    ]
  }
]
```

### NDJSON

```bash
npx edgar-fabric-ingest --issuer MSFT --after 2023-01-01 --before 2023-12-31 --forms 10-K --out ndjson
```

## Options

- `--issuer <ticker|cik>`
- `--after <YYYY-MM-DD>`
- `--before <YYYY-MM-DD>`
- `--forms <comma-separated>`
- `--out <json|ndjson>`
- `--post <url>`
- `--dry-run`
- `--verbose`
- `--delay <ms>` (default: 200)
