import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

export class Serpex implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Serpex',
		name: 'serpex',
		icon: 'file:serpex.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Get search results from Google, Bing, DuckDuckGo, and more via Serpex API',
		defaults: {
			name: 'Serpex',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'serpexApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://api.serpex.dev',
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
						name: 'Search',
						value: 'search',
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
				placeholder: 'e.g., best coffee shops near me',
				description: 'The search query to execute',
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['search'],
						operation: ['execute'],
					},
				},
				options: [
					{
						displayName: 'Engine',
						name: 'engine',
						type: 'options',
						options: [
							{
								name: 'Auto',
								value: 'auto',
								description: 'Automatically select the best search engine',
							},
							{
								name: 'Google',
								value: 'google',
								description: 'Use Google search',
							},
							{
								name: 'Bing',
								value: 'bing',
								description: 'Use Bing search',
							},
							{
								name: 'DuckDuckGo',
								value: 'duckduckgo',
								description: 'Use DuckDuckGo search',
							},
							{
								name: 'Brave',
								value: 'brave',
								description: 'Use Brave search',
							},
							{
								name: 'Yahoo',
								value: 'yahoo',
								description: 'Use Yahoo search',
							},
							{
								name: 'Yandex',
								value: 'yandex',
								description: 'Use Yandex search',
							},
						],
						default: 'auto',
						description: 'The search engine to use',
					},
					{
						displayName: 'Time Range',
						name: 'timeRange',
						type: 'options',
						options: [
							{
								name: 'All',
								value: 'all',
								description: 'Search results from all time',
							},
							{
								name: 'Day',
								value: 'day',
								description: 'Results from the past 24 hours',
							},
							{
								name: 'Week',
								value: 'week',
								description: 'Results from the past week',
							},
							{
								name: 'Month',
								value: 'month',
								description: 'Results from the past month',
							},
							{
								name: 'Year',
								value: 'year',
								description: 'Results from the past year',
							},
						],
						default: 'all',
						description: 'Filter results by time range (not supported by Brave)',
					},
					{
						displayName: 'Number of Results',
						name: 'num',
						type: 'number',
						typeOptions: {
							minValue: 1,
							maxValue: 100,
						},
						default: 10,
						description: 'Number of search results to return',
					},
					{
						displayName: 'Location',
						name: 'location',
						type: 'string',
						default: '',
						placeholder: 'e.g., New York, USA',
						description: 'Geographic location for localized results',
					},
					{
						displayName: 'Language',
						name: 'language',
						type: 'string',
						default: '',
						placeholder: 'e.g., en',
						description: 'Language code for results (e.g., en, es, fr)',
	},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;

				if (resource === 'search' && operation === 'execute') {
					const query = this.getNodeParameter('query', i) as string;
					const additionalFields = this.getNodeParameter('additionalFields', i) as {
						engine?: string;
						timeRange?: string;
						num?: number;
						location?: string;
						language?: string;
					};

					const qs: any = {
						q: query,
					};

					if (additionalFields.engine) {
						qs.engine = additionalFields.engine;
					}

					if (additionalFields.timeRange) {
						qs.time_range = additionalFields.timeRange;
					}

					if (additionalFields.num) {
						qs.num = additionalFields.num;
					}

					if (additionalFields.location) {
						qs.location = additionalFields.location;
					}

					if (additionalFields.language) {
						qs.language = additionalFields.language;
					}

				const response = await this.helpers.httpRequestWithAuthentication.call(
					this,
					'serpexApi',
					{
						method: 'GET',
						url: 'https://api.serpex.dev/api/search',
						qs,
						json: true,
					},
				);					returnData.push({
						json: response,
						pairedItem: {
							item: i,
						},
					});
				}
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
