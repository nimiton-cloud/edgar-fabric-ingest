"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postJson = exports.fetchJson = void 0;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const fetchJson = async (url, clientOptions, options = {}) => {
    const delayMs = clientOptions.delayMs ?? 200;
    const retries = clientOptions.retries ?? 3;
    const backoffMs = clientOptions.backoffMs ?? 400;
    let attempt = 0;
    let lastError = null;
    while (attempt <= retries) {
        if (delayMs > 0) {
            await sleep(delayMs);
        }
        try {
            const response = await fetch(url, {
                headers: {
                    "User-Agent": clientOptions.userAgent,
                    Accept: "application/json",
                    ...(options.headers ?? {})
                }
            });
            if (!response.ok) {
                if (response.status === 429 || response.status >= 500) {
                    throw new Error(`SEC request failed with status ${response.status}`);
                }
                const text = await response.text();
                throw new Error(`SEC request failed with status ${response.status}: ${text}`);
            }
            return (await response.json());
        }
        catch (error) {
            lastError = error;
            if (attempt >= retries) {
                break;
            }
            const backoff = backoffMs * Math.pow(2, attempt);
            if (clientOptions.verbose) {
                console.error(`Retrying SEC request (${attempt + 1}/${retries}) after ${backoff}ms: ${lastError.message}`);
            }
            await sleep(backoff);
        }
        attempt += 1;
    }
    throw lastError ?? new Error("SEC request failed");
};
exports.fetchJson = fetchJson;
const postJson = async (url, body, clientOptions) => {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "User-Agent": clientOptions.userAgent,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });
    if (!response.ok) {
        const text = await response.text();
        throw new Error(`POST failed with status ${response.status}: ${text}`);
    }
};
exports.postJson = postJson;
