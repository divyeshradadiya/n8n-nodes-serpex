// Offline tests for the Serpex node — no network, no API key. Runs against the
// built dist/ with a fake n8n execution context. test/fixtures holds sanitized
// responses captured from api.serpex.dev on 2026-10-23 (statuses that cannot
// be triggered safely use the exact body from the backend code);
// manifest.json has each status and headers.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { NodeApiError, NodeOperationError } = require('n8n-workflow');
const { Serpex, SERPEX_NODE_VERSION } = require('../dist/nodes/Serpex/Serpex.node.js');
const { describeSerpexError, errorBodyFrom } = require('../dist/nodes/Serpex/apiErrors.js');

const FIXTURES = path.join(__dirname, 'fixtures');
const manifest = JSON.parse(fs.readFileSync(path.join(FIXTURES, 'manifest.json'), 'utf8'));
const fixture = (name) => JSON.parse(fs.readFileSync(path.join(FIXTURES, `${name}.json`), 'utf8'));

/**
 * Fake IExecuteFunctions: one input item, the given parameters, and an HTTP
 * helper that answers like n8n's httpRequest with returnFullResponse +
 * ignoreHttpStatusErrors (it never throws on a status) — unless `throwError`.
 */
function context({ params, typeVersion = 2, fixtureName, continueOnFail = false, throwError, rawResponse }) {
	const sent = [];
	const node = { id: '1', name: 'Serpex', type: 'n8n-nodes-serpex.serpex', typeVersion, position: [0, 0], parameters: {} };
	const ctx = {
		getInputData: () => [{ json: {} }],
		getNodeParameter: (name, _i, fallback) => (name in params ? params[name] : fallback),
		getNode: () => node,
		continueOnFail: () => continueOnFail,
		helpers: {
			httpRequestWithAuthentication: async function (credential, request) {
				sent.push({ credential, request });
				if (throwError) throw throwError;
				if (rawResponse) return rawResponse;
				const { status, headers } = manifest[fixtureName];
				return { statusCode: status, headers, body: fixture(fixtureName) };
			},
		},
	};
	return { ctx, sent };
}

async function run(opts) {
	const { ctx, sent } = context(opts);
	const out = await new Serpex().execute.call(ctx);
	return { out: out[0], sent };
}

const search = (extra = {}) => ({ resource: 'search', operation: 'execute', query: 'q', ...extra });

test('node metadata', () => {
	const d = new Serpex().description;
	assert.deepStrictEqual(d.version, [1, 2]);
	assert.strictEqual(d.defaultVersion, 2);
	assert.strictEqual(d.usableAsTool, true);
	assert.strictEqual(SERPEX_NODE_VERSION, '1.1.1');
	assert.strictEqual(require('../package.json').version.replace(/-0$/, ''), SERPEX_NODE_VERSION);
	const text = JSON.stringify(d).toLowerCase();
	assert.doesNotMatch(text, /multi-engine|serp api|cheapest|stealth/);
});

test('search v2: only q is sent; output is the API JSON', async () => {
	const { out, sent } = await run({ params: search({ query: 'python asyncio tutorial' }), fixtureName: 'search_plain' });
	const r = sent[0].request;
	assert.strictEqual(sent[0].credential, 'serpexApi');
	assert.strictEqual(r.method, 'GET');
	assert.strictEqual(r.url, 'https://api.serpex.dev/api/search');
	assert.deepStrictEqual(r.qs, { q: 'python asyncio tutorial' });
	assert.strictEqual(r.headers['User-Agent'], 'serpex-n8n/1.1.1');
	assert.strictEqual(r.returnFullResponse, true);
	assert.strictEqual(r.ignoreHttpStatusErrors, true);
	assert.deepStrictEqual(out[0].json, fixture('search_plain'));
	assert.deepStrictEqual(out[0].pairedItem, { item: 0 });
});

test('search v1: deprecated Additional Fields are not sent', async () => {
	const { sent } = await run({
		typeVersion: 1,
		params: search({ additionalFields: { engine: 'legacy-value', timeRange: 'day', num: 5, language: 'en', location: 'US' } }),
		fixtureName: 'search_plain',
	});
	assert.deepStrictEqual(sent[0].request.qs, { q: 'q' });
});

test('search v2: include_content sends the content options with the longer timeout', async () => {
	const { out, sent } = await run({
		params: search({ options: { includeContent: true, contentResults: 10 } }),
		fixtureName: 'search_content',
	});
	const r = sent[0].request;
	assert.deepStrictEqual(r.qs, { q: 'q', include_content: true, content_results: 10 });
	assert.ok(r.timeout >= 100000);
	const results = out[0].json.results;
	assert.ok(results.slice(0, 5).every((x) => typeof x.content === 'string' && !('content_error' in x)));
});

test('search: content errors and no results pass through', async () => {
	let { out } = await run({ params: search({ options: { includeContent: true } }), fixtureName: 'search_content_errors' });
	assert.ok(out[0].json.results.slice(0, 5).every((x) => x.content_error === 'robots_disallowed'));
	({ out } = await run({ params: search(), fixtureName: 'search_no_results' }));
	assert.strictEqual(out[0].json.metadata.status, 'no_results');
	assert.strictEqual(out[0].json.metadata.credits_used, 0);
});

test('extract: urls + format in the body; per-URL failure kept', async () => {
	let { out, sent } = await run({
		params: { resource: 'extract', operation: 'execute', urls: 'https://example.com,\nhttps://example.org', format: 'markdown' },
		fixtureName: 'extract_markdown',
	});
	assert.strictEqual(sent[0].request.method, 'POST');
	assert.strictEqual(sent[0].request.url, 'https://api.serpex.dev/api/crawl');
	assert.deepStrictEqual(sent[0].request.body, { urls: ['https://example.com', 'https://example.org'], format: 'markdown' });
	assert.strictEqual(out[0].json.results[0].success, true);
	({ out } = await run({ params: { resource: 'extract', operation: 'execute', urls: 'https://example.com/x', format: 'markdown' }, fixtureName: 'extract_failed_404' }));
	assert.strictEqual(out[0].json.results[0].error_type, 'http');
});

test('extract: 0 or 11 URLs are rejected before any request', async () => {
	for (const urls of ['', Array.from({ length: 11 }, (_, i) => `https://a.com/${i}`).join(',')]) {
		const { ctx, sent } = context({ params: { resource: 'extract', operation: 'execute', urls }, fixtureName: 'extract_markdown' });
		await assert.rejects(new Serpex().execute.call(ctx), NodeOperationError);
		assert.strictEqual(sent.length, 0);
	}
});

test('usage: days in the query string', async () => {
	const { out, sent } = await run({ params: { resource: 'usage', operation: 'get', days: 7 }, fixtureName: 'usage_days7' });
	assert.deepStrictEqual(sent[0].request.qs, { days: 7 });
	assert.strictEqual(out[0].json.effective_days, 7);
});

test('API errors become NodeApiError with the API message and what to do', async () => {
	const cases = [
		['error_400_content_results', '400', /^Serpex rejected the request: content_results must be 5 or 10\.$/, /Fix the node parameters/],
		['error_401_bad_key', '401', /^Serpex rejected the API key: Invalid or inactive API key\.$/, /credential/],
		['error_402_search', '402', /^Out of Serpex credits\. Balance: 0 credits\.$/, /Top up at https:\/\/app\.serpex\.dev/],
		['error_429', '429', /^Serpex rate limit exceeded \(limit: 5 requests per second\)\.$/, /Retry in 292 ms/],
		['error_503_search', '503', /^Serpex is temporarily unavailable \(HTTP 503\): Search temporarily unavailable, please retry\.$/, /Not charged/],
		['error_500_search', '500', /HTTP 500\): Internal server error\.$/, /Request id: 00000000-0000-4000-8000-0000000000aa/],
		['error_500_malformed_json', '500', /Unexpected end of JSON input/, /Not charged/],
	];
	for (const [name, code, message, description] of cases) {
		const { ctx } = context({ params: search(), fixtureName: name });
		await assert.rejects(new Serpex().execute.call(ctx), (err) => {
			assert.ok(err instanceof NodeApiError, `${name}: ${err && err.constructor && err.constructor.name}`);
			assert.strictEqual(err.httpCode, code, name);
			assert.match(err.message, message, `${name}: ${err.message}`);
			assert.match(err.description, description, `${name}: ${err.description}`);
			return true;
		});
	}
});

test('continueOnFail: the error, status and advice become the item', async () => {
	const { out } = await run({ params: search(), fixtureName: 'error_402_search', continueOnFail: true });
	assert.strictEqual(out[0].json.statusCode, 402);
	assert.match(out[0].json.error, /Out of Serpex credits/);
	assert.match(out[0].json.description, /Top up/);
});

test('no response (network) is a NodeOperationError that says to retry', async () => {
	const { ctx } = context({ params: search(), fixtureName: 'search_plain', throwError: new Error('connect ECONNRESET') });
	await assert.rejects(new Serpex().execute.call(ctx), (err) => {
		assert.ok(err instanceof NodeOperationError);
		assert.match(err.description, /Retry shortly/);
		return true;
	});
});

test('describeSerpexError falls back to Retry-After and a status message', () => {
	assert.match(describeSerpexError(429, { error: 'Rate limit exceeded' }, '2').description, /Retry in 2000 ms/);
	assert.strictEqual(describeSerpexError(524, {}).message, 'Serpex is temporarily unavailable (HTTP 524): HTTP 524.');
});

test('a non-JSON error page never becomes the message: tags stripped, 200 chars max', async () => {
	const page =
		'<html><head><title>502 Bad Gateway</title><style>body{color:red}</style></head>' +
		'<body><h1>502 Bad Gateway</h1><p>' + 'x'.repeat(500) + '</p><script>alert(1)</script></body></html>';
	const { ctx } = context({ params: search(), rawResponse: { statusCode: 502, headers: {}, body: page } });
	await assert.rejects(new Serpex().execute.call(ctx), (err) => {
		assert.ok(err instanceof NodeApiError);
		assert.strictEqual(err.httpCode, '502');
		assert.match(err.message, /^Serpex is temporarily unavailable \(HTTP 502\): 502 Bad Gateway 502 Bad Gateway x+\.$/);
		assert.doesNotMatch(err.message, /<|>|alert|color:red/);
		assert.ok(err.message.length < 260, `too long: ${err.message.length}`);
		return true;
	});
});

test('errorBodyFrom: object, JSON string, Buffer, empty', () => {
	assert.deepStrictEqual(errorBodyFrom(400, { error: 'bad' }), { error: 'bad' });
	assert.deepStrictEqual(errorBodyFrom(402, '{"error":"Insufficient credits","remainingCredits":0}'), {
		error: 'Insufficient credits',
		remainingCredits: 0,
	});
	assert.deepStrictEqual(errorBodyFrom(503, Buffer.from('<b>Service Unavailable</b>')), { error: 'Service Unavailable' });
	assert.deepStrictEqual(errorBodyFrom(504, ''), { error: 'HTTP 504' });
	assert.deepStrictEqual(errorBodyFrom(500, undefined), { error: 'HTTP 500' });
	assert.deepStrictEqual(errorBodyFrom(502, ['not', 'an', 'object']), { error: 'HTTP 502' });
	assert.strictEqual(errorBodyFrom(502, 'y'.repeat(1000)).error.length, 200);
});
