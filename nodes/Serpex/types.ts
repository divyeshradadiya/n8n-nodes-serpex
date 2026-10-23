// Response shapes of the Serpex API (https://serpex.dev/docs/api), as returned
// by GET /api/search, POST /api/crawl and GET /api/usage. The node outputs the
// API's JSON unchanged; these types document it and keep the code honest.

export type SerpexSearchStatus = 'success' | 'no_results';

export interface SerpexSearchResult {
	title: string;
	url: string;
	snippet: string;
	position: number;
	/** Deprecated: always "auto". */
	engine?: string;
	img_src?: string;
	duration?: string;
	score?: number;
	/**
	 * Page markdown. Only with include_content, only on the first
	 * content_results results, and never together with content_error.
	 */
	content?: string;
	/** Why page content is missing, e.g. "robots_disallowed". Never with content. */
	content_error?: string;
}

export interface SerpexSearchResponse {
	id: string;
	query: string;
	/** Deprecated: always ["auto"]. */
	engines?: string[];
	results: SerpexSearchResult[];
	/** Present only when status is "no_results". */
	message?: string;
	metadata: {
		number_of_results: number;
		response_time: number;
		timestamp: string;
		/** 0, 1, 3 or 6. */
		credits_used: number;
		from_cache?: boolean;
		status?: SerpexSearchStatus;
		content_requested?: number;
		content_delivered?: number;
		no_results_verified?: boolean;
		charged?: boolean;
		message?: string;
	};
}

export type SerpexExtractErrorType =
	| 'timeout'
	| 'connection'
	| 'dns_unresolved'
	| 'ssl_error'
	| 'http'
	| 'blocked'
	| 'robots_disallowed'
	| 'server_error'
	| 'unsupported_content_type'
	| 'too_large'
	| 'unknown';

export interface SerpexExtractResult {
	url: string;
	success: boolean;
	/** format "markdown" (default); "" on a failure. */
	markdown?: string;
	/** format "html". */
	html?: string;
	status_code?: number;
	/** Failure only. */
	error?: string;
	/** Failure only, always set then. */
	error_type?: SerpexExtractErrorType | string;
}

export interface SerpexExtractResponse {
	success: boolean;
	results: SerpexExtractResult[];
	metadata: {
		total_urls: number;
		processed_urls: number;
		successful_crawls: number;
		failed_crawls: number;
		credits_used: number;
		/** Free repeats; omitted when 0. */
		cached_free?: number;
		response_time: number;
		timestamp: string;
	};
}

export interface SerpexUsageResponse {
	api_key: string;
	organization_id: string;
	period_days: number;
	effective_days?: number;
	statistics: {
		totalRequests: number;
		successfulRequests: number;
		failedRequests: number;
		noResultsRequests?: number;
		engineStats: Record<string, number>;
	};
	credits: { balance: number; totalUsed?: number };
	recent_requests?: Array<Record<string, unknown>>;
}

/** Error body. Fields other than `error` depend on the status code. */
export interface SerpexErrorBody {
	/** A string on every Serpex error; `{ message, status }` from the framework error handler. */
	error?: string | { message?: string; status?: number };
	/** Framework 404 bodies. */
	message?: string;
	retryable?: boolean;
	request_id?: string;
	remainingCredits?: number;
	limit?: number;
	retryAfterMs?: number;
	invalid_urls?: string[];
}
