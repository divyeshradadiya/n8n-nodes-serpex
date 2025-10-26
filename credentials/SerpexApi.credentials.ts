import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class SerpexApi implements ICredentialType {
	name = 'serpexApi';
	displayName = 'Serpex API';
	documentationUrl = 'https://serpex.dev/docs';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'Your Serpex API key. Get it from https://serpex.dev/dashboard',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.serpex.dev',
			url: '/api/search',
			method: 'GET',
			qs: {
				q: 'test',
			},
		},
	};
}
