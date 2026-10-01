import {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestOptions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

// Sent as the User-Agent (serpex-n8n/<version>) so Serpex can see which node
// versions are still in use. Keep in step with package.json.
export const SERPEX_NODE_VERSION = '1.1.0';

const BASE_URL = 'https://api.serpex.dev';

// Client timeouts sit above the server's own budget for each call (search 30 s
// upstream, 45 s with include_content, extract 55 s), so the node never gives up
// on a request the server still finishes and bills.
const SEARCH_TIMEOUT_MS = 60_000;
const SEARCH_CONTENT_TIMEOUT_MS = 100_000;
const EXTRACT_TIMEOUT_MS = 100_000;

function parseUrls(value: unknown): string[] {
	if (Array.isArray(value)) {
		return value.map((url) => String(url).trim()).filter((url) => url.length > 0);
	}
	return String(value ?? '')
		.split(/[\s,]+/)
		.map((url) => url.trim())
		.filter((url) => url.length > 0);
}

export class Serpex implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Serpex',
		name: 'serpex',
		icon: 'file:serpex.svg',
		group: ['transform'],
		// Version 1 kept so saved workflows load unchanged; version 2 drops the
		// fields the Serpex API ignores and adds page content.
		version: [1, 2],
		defaultVersion: 2,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Web search and page extraction for AI agents with the Serpex API',
		defaults: {
			name: 'Serpex',
		},
		inputs: ['main'],
		outputs: ['main'],
		usableAsTool: true,
		credentials: [
			{
				name: 'serpexApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: BASE_URL,
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Extract',
						value: 'extract',
					},
					{
						name: 'Search',
						value: 'search',
					},
					{
						name: 'Usage',
						value: 'usage',
					},
				],
				default: 'search',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['search'],
					},
				},
				options: [
					{
						name: 'Execute',
						value: 'execute',
						description: 'Execute a search query',
						action: 'Execute a search query',
					},
				],
				default: 'execute',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['extract'],
					},
				},
				options: [
					{
						name: 'Execute',
						value: 'execute',
						description: 'Extract the content of web pages',
						action: 'Extract the content of web pages',
					},
				],
				default: 'execute',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['usage'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get request counts and the credit balance',
						action: 'Get usage and credit balance',
					},
				],
				default: 'get',
			},
			{
				displayName: 'Query',
				name: 'query',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['search'],
						operation: ['execute'],
					},
				},
				default: '',
				placeholder: 'e.g., best coffee shops in New York',
				description: 'The search query to execute (max 500 characters)',
			},
			// Version 1 only: these fields are ignored by the Serpex API and are no
			// longer sent. Kept so workflows saved with version 1 still load.
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						'@version': [1],
						resource: ['search'],
						operation: ['execute'],
					},
				},
				options: [
					{
						displayName: 'Engine (Deprecated)',
						name: 'engine',
						type: 'string',
						default: 'auto',
						description: 'Deprecated and ignored by the Serpex API; not sent',
					},
					{
						displayName: 'Language (Deprecated)',
						name: 'language',
						type: 'string',
						default: '',
						description: 'Deprecated and ignored by the Serpex API; not sent',
					},
					{
						displayName: 'Location (Deprecated)',
						name: 'location',
						type: 'string',
						default: '',
						description: 'Deprecated and ignored by the Serpex API; not sent',
					},
					{
						displayName: 'Number of Results (Deprecated)',
						name: 'num',
						type: 'number',
						typeOptions: {
							minValue: 1,
							maxValue: 100,
						},
						default: 10,
						description: 'Deprecated and ignored by the Serpex API; not sent',
					},
					{
						displayName: 'Time Range (Deprecated)',
						name: 'timeRange',
						type: 'options',
						options: [
							{
								name: 'All',
								value: 'all',
							},
							{
								name: 'Day',
								value: 'day',
							},
							{
								name: 'Month',
								value: 'month',
							},
							{
								name: 'Week',
								value: 'week',
							},
							{
								name: 'Year',
								value: 'year',
							},
						],
						default: 'all',
						description: 'Deprecated and ignored by the Serpex API; not sent',
					},
				],
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						'@version': [2],
						resource: ['search'],
						operation: ['execute'],
					},
				},
				options: [
					{
						displayName: 'Content Results',
						name: 'contentResults',
						type: 'options',
						options: [
							{
								name: '5',
								value: 5,
							},
							{
								name: '10',
								value: 10,
							},
						],
						default: 5,
						description: 'How many top results to fetch page content for, when Include Content is on',
					},
					{
						displayName: 'Include Content',
						name: 'includeContent',
						type: 'boolean',
						default: false,
						description:
							'Whether to also fetch page content (markdown) for the top results. Best-effort: a page that cannot be extracted returns content_error instead of content.',
					},
				],
			},
			{
				displayName: 'URLs',
				name: 'urls',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['extract'],
						operation: ['execute'],
					},
				},
				default: '',
				placeholder: 'e.g., https://example.com, https://example.org/pricing',
				description: '1 to 10 absolute URLs, separated by commas or new lines',
			},
			{
				displayName: 'Format',
				name: 'format',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['extract'],
						operation: ['execute'],
					},
				},
				options: [
					{
						name: 'HTML',
						value: 'html',
					},
					{
						name: 'Markdown',
						value: 'markdown',
					},
				],
				default: 'markdown',
				description: 'Output format for the page content',
			},
			{
				displayName: 'Days',
				name: 'days',
				type: 'number',
				typeOptions: {
					minValue: 1,
					maxValue: 90,
				},
				displayOptions: {
					show: {
						resource: ['usage'],
						operation: ['get'],
					},
				},
				default: 30,
				description: 'How many days of history to summarise (1 to 90)',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const headers = { 'User-Agent': `serpex-n8n/${SERPEX_NODE_VERSION}` };

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;
				let request: IHttpRequestOptions | undefined;

				if (resource === 'search' && operation === 'execute') {
					const query = this.getNodeParameter('query', i) as string;
					// Only q, include_content and content_results reach the API. The
					// version 1 Additional Fields (engine, time range, number of
					// results, location, language) are ignored by the API and not sent.
					const qs: IDataObject = { q: query };
					let timeout = SEARCH_TIMEOUT_MS;

					if (this.getNode().typeVersion >= 2) {
						const options = this.getNodeParameter('options', i, {}) as {
							includeContent?: boolean;
							contentResults?: number;
						};
						if (options.includeContent) {
							qs.include_content = true;
							qs.content_results = options.contentResults === 10 ? 10 : 5;
							timeout = SEARCH_CONTENT_TIMEOUT_MS;
						}
					}

					request = {
						method: 'GET',
						url: `${BASE_URL}/api/search`,
						qs,
						headers,
						json: true,
						timeout,
					};
				} else if (resource === 'extract' && operation === 'execute') {
					const urls = parseUrls(this.getNodeParameter('urls', i));
					if (urls.length < 1 || urls.length > 10) {
						throw new NodeOperationError(this.getNode(), 'Provide 1 to 10 URLs', {
							itemIndex: i,
						});
					}
					const format = this.getNodeParameter('format', i, 'markdown') as string;
					request = {
						method: 'POST',
						url: `${BASE_URL}/api/crawl`,
						body: { urls, format },
						headers,
						json: true,
						timeout: EXTRACT_TIMEOUT_MS,
					};
				} else if (resource === 'usage' && operation === 'get') {
					const days = this.getNodeParameter('days', i, 30) as number;
					request = {
						method: 'GET',
						url: `${BASE_URL}/api/usage`,
						qs: { days },
						headers,
						json: true,
					};
				}

				if (!request) {
					throw new NodeOperationError(
						this.getNode(),
						`Unsupported resource/operation: ${resource}/${operation}`,
						{ itemIndex: i },
					);
				}

				const response = await this.helpers.httpRequestWithAuthentication.call(
					this,
					'serpexApi',
					request,
				);
				returnData.push({
					json: response,
					pairedItem: {
						item: i,
					},
				});
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error instanceof Error ? error.message : String(error),
						},
						pairedItem: {
							item: i,
						},
					});
					continue;
				}
				throw new NodeOperationError(this.getNode(), error as Error, {
					itemIndex: i,
				});
			}
		}

		return [returnData];
	}
}
