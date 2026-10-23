import type { SerpexErrorBody } from './types';

const BILLING_URL = 'https://app.serpex.dev/dashboard/billing';

export interface SerpexErrorText {
	/** Short headline shown on the node. */
	message: string;
	/** What to do about it: whether it was charged and whether to retry. */
	description: string;
	retryable: boolean;
}

/** The API's own error text (string, `{ message }` or framework `message`). */
export function apiMessage(status: number, body: SerpexErrorBody | undefined): string {
	const b = body ?? {};
	if (typeof b.error === 'string' && b.error) {
		if (status === 404 && typeof b.message === 'string' && b.message) return b.message;
		return b.error;
	}
	if (b.error && typeof b.error === 'object' && typeof b.error.message === 'string' && b.error.message) {
		return b.error.message;
	}
	if (typeof b.message === 'string' && b.message) return b.message;
	return `HTTP ${status}`;
}

function sentence(text: string): string {
	return /[.!?]$/.test(text) ? text : `${text}.`;
}

/** One message + description per HTTP status of the Serpex API. */
export function describeSerpexError(
	status: number,
	body: SerpexErrorBody | undefined,
	retryAfterHeader?: string,
): SerpexErrorText {
	const b = body ?? {};
	const msg = apiMessage(status, b);
	switch (status) {
		case 400:
			return {
				message: `Serpex rejected the request: ${sentence(msg)}`,
				description: 'Fix the node parameters. Not charged.',
				retryable: false,
			};
		case 401:
			return {
				message: `Serpex rejected the API key: ${sentence(msg)}`,
				description: 'Check the API key in the Serpex API credential. Not charged.',
				retryable: false,
			};
		case 402: {
			const balance = typeof b.remainingCredits === 'number' ? ` Balance: ${b.remainingCredits} credits.` : '';
			return {
				message: `Out of Serpex credits.${balance}`,
				description: `Top up at ${BILLING_URL}, then run the workflow again.`,
				retryable: false,
			};
		}
		case 403:
		case 410:
			return { message: sentence(msg), description: 'Not charged. Do not retry.', retryable: false };
		case 429: {
			const limit = typeof b.limit === 'number' ? ` (limit: ${b.limit} requests per second)` : '';
			const headerMs = retryAfterHeader !== undefined ? Number(retryAfterHeader) * 1000 : NaN;
			const wait =
				typeof b.retryAfterMs === 'number' ? b.retryAfterMs : Number.isFinite(headerMs) ? headerMs : 1000;
			return {
				message: `Serpex rate limit exceeded${limit}.`,
				description: `Retry in ${wait} ms. Enable "Retry On Fail" on the node, or slow the workflow down. Not charged.`,
				retryable: true,
			};
		}
		default: {
			const reqId = typeof b.request_id === 'string' ? ` Request id: ${b.request_id}.` : '';
			if (status >= 500) {
				return {
					message: `Serpex is temporarily unavailable (HTTP ${status}): ${sentence(msg)}`,
					description: `Not charged. Retry shortly.${reqId}`,
					retryable: true,
				};
			}
			return { message: `Serpex request failed (HTTP ${status}): ${sentence(msg)}`, description: reqId.trim(), retryable: false };
		}
	}
}
