export declare const normalizeCik: (cik: string) => string;
export declare const cikNoLeadingZeros: (cik: string) => string;
export declare const normalizeAccession: (accession: string) => string;
export declare const buildDocumentUrl: (cik: string, accessionNumber: string, primaryDocument: string) => string;
export declare const parseDate: (value: string) => Date;
export declare const isDateInRange: (value: string, after: string, before: string) => boolean;
