# edgar-fabric-ingest

A CLI to fetch SEC EDGAR filings and emit CMD+RVL Fabric command JSON.

## What this is

A reference implementation that converts SEC EDGAR filings into provenance-first, CQRS-style fabric events. The output is facts/events, not interpretations.

## What this is not

- Forecasting or prediction
- Sentiment analysis
- A graph builder
- Trading or investment advice

## Relationship to CMD+RVL

Maintained by the CMD+RVL team. This tool reflects CMD+RVL data fabric principles: append-only ingest, provenance, strict ingest schema, and replayable projections. This repo is standalone; the CMD+RVL ingestion endpoint is optional. The CMD+RVL fabric ingest endpoint is available by request while in limited beta/stealth (no public URL).

## Requirements

- **Node.js 18** or later

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Build the project

```bash
npm run build
```

### 3. Run the CLI

```bash
node dist/cli.js \
  --issuer MSFT \
  --after 2023-01-01 \
  --before 2023-12-31 \
  --forms 10-K,10-Q
```

Or use development mode (no build required):

```bash
npm run dev -- --issuer MSFT --after 2023-01-01 --before 2023-12-31 --forms 10-K,10-Q
```

### 4. Run tests

```bash
npm test
```

---

## Usage

Fetch filings for a company by ticker or CIK:

```bash
node dist/cli.js \
  --issuer MSFT \
  --after 2023-01-01 \
  --before 2023-12-31 \
  --forms 10-K,10-Q \
  --out json
```

Run without installing globally using npx:

```bash
npx edgar-fabric-ingest \
  --issuer MSFT \
  --after 2023-01-01 \
  --before 2023-12-31 \
  --forms 10-K,10-Q \
  --out json \
  --post https://example.com/ingest \
  --dry-run \
  --verbose
```

Post commands to an endpoint:

```bash
node dist/cli.js \
  --issuer 0000789019 \
  --after 2023-01-01 \
  --before 2023-12-31 \
  --forms 10-K,10-Q \
  --post https://example.com/ingest \
  --dry-run
```

## Options

| Option | Description |
|--------|-------------|
| `--issuer <ticker\|cik>` | Company ticker (e.g. `MSFT`) or CIK (e.g. `0000789019`) |
| `--after <YYYY-MM-DD>` | Start date for filings (inclusive) |
| `--before <YYYY-MM-DD>` | End date for filings (inclusive) |
| `--forms <types>` | Comma-separated form types (e.g. `10-K,10-Q,8-K`) |
| `--out <format>` | Output format: `json` (default) or `ndjson` |
| `--post <url>` | POST each command to this URL |
| `--dry-run` | Preview without posting |
| `--verbose` | Enable verbose logging |
| `--delay <ms>` | Delay between API calls (default: `200`) |

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
          { "key": "AccessionNumber", "value": "0000789019-23-000123", "asOf": "2023-08-03" },
          { "key": "FilingDate", "value": "2023-08-03", "asOf": "2023-08-03" },
          { "key": "DocumentUrl", "value": "https://www.sec.gov/Archives/edgar/data/789019/000078901923000123/doc.htm", "asOf": "2023-08-03" }
        ]
      }
    ]
  }
]
```

### NDJSON

```bash
node dist/cli.js --issuer MSFT --after 2023-01-01 --before 2023-12-31 --forms 10-K --out ndjson
```

---

## Design principles

- Deterministic
- Schema-first
- Provenance-aware
- Composable projections (edges inferred later)

## Contact / Access

For access requests or questions, open an issue. More info at cmdrvl.com.

## License

See LICENSE.

## Appendix: Installing Node.js via nvm

If you don't have Node.js installed, we recommend using [nvm](https://github.com/nvm-sh/nvm) (Node Version Manager):

### macOS / Linux

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

# Restart your terminal, then install Node 18
nvm install 18
nvm use 18

# Verify installation
node --version
```

### Windows

Use [nvm-windows](https://github.com/coreybutler/nvm-windows):

1. Download the installer from the [releases page](https://github.com/coreybutler/nvm-windows/releases)
2. Run the installer
3. Open a new terminal and run:

```bash
nvm install 18
nvm use 18
```
