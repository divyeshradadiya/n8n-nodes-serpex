# n8n-nodes-serpex

This is an n8n community node that lets you use [Serpex](https://serpex.dev) in your n8n workflows.

**Serpex** is a fast, affordable search API that provides structured search results with intelligent routing, automatic retries, and comprehensive data extraction. **10x cheaper than competitors** - Pricing starts at just $0.0008 per request.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Usage](#usage)  
[Resources](#resources)  
[Version history](#version-history)  

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

### Community Nodes (Recommended)

1. Go to **Settings > Community Nodes**.
2. Select **Install**.
3. Enter `n8n-nodes-serpex` in **Enter npm package name**.
4. Agree to the [risks](https://docs.n8n.io/integrations/community-nodes/risks/) of using community nodes.
5. Select **Install**.

After installing the node, you can use it like any other node. n8n displays the node in search results in the **Nodes** panel.

### Manual Installation

To get started, install the package in your n8n root directory:

```bash
npm install n8n-nodes-serpex
```

For Docker-based deployments, add the following line before the font installation command in your [n8n Dockerfile](https://github.com/n8n-io/n8n/blob/master/docker/images/n8n/Dockerfile):

```dockerfile
RUN cd /usr/local/lib/node_modules/n8n && npm install n8n-nodes-serpex
```

## Operations

### Search
- **Execute**: Perform a search query with intelligent routing and structured JSON responses

## Credentials

To use this node, you need to set up Serpex API credentials:

1. Get your API key from [Serpex Dashboard](https://serpex.dev/dashboard) (200 free searches to get started)
2. In n8n, create new credentials and select **Serpex API**
3. Enter your API key

## Compatibility

Tested against n8n version 1.0.0 and above.

## Usage

### Basic Search

1. Add the Serpex node to your workflow
2. Connect your Serpex API credentials
3. Enter your search query
4. Execute the workflow

### Advanced Options

- **Engine**: Choose search engine (auto, google, bing, duckduckgo, etc.)
- **Time Range**: Filter results by time (all, day, week, month, year)
- **Number of Results**: Specify how many results to return (1-50)
- **Safe Search**: Enable safe search filtering

### Parameters

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| q | string | Yes | Search query | "coffee shops near me" |
| category | string | No | Search category (currently 'web' only) | "web" |
| time_range | string | No | Time filter | "day" |
| num | number | No | Number of results (max 50) | 10 |
| safe_search | boolean | No | Enable safe search | true |

### Example Workflow

```
Manual Trigger → Serpex (Search for "AI tools") → Process Results → Send Email
```

### Response Data

The node returns search results in structured JSON format including:
- Organic search results with position, title, link, snippet
- Related searches
- People also ask
- Search metadata

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
* [Serpex API Documentation](https://serpex.dev/docs)
* [Serpex Dashboard](https://serpex.dev/dashboard)

## Version history

### 1.0.0

Initial release with support for:
- Intelligent auto-routing with automatic retries
- Multi-engine support (Auto Route, Google, Bing, DuckDuckGo, etc.)
- Time range filtering
- Safe search options
- Customizable result count (up to 50)
- Structured JSON responses

## License

[MIT](LICENSE.md)

## Support

For issues, questions, or feature requests:
- Open an issue on [GitHub](https://github.com/divyeshradadiya/n8n-nodes-serpex/issues)
- Contact [Serpex Support](https://serpex.dev/support)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
