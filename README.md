# n8n-nodes-serpex

This is an n8n community node that lets you use [Serpex](https://serpex.dev) in your n8n workflows.

**Serpex** is a real-time web search API. It returns structured JSON search results for any query, built for AI agents, LLM tools, RAG pipelines and automated workflows.

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
- **Execute**: Run a real-time web search and get structured JSON results

## Credentials

To use this node, you need to set up Serpex API credentials:

1. Get your API key from the [Serpex Dashboard](https://serpex.dev/dashboard)
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

- **Time Range**: Filter results by time (all, day, week, month, year)
- **Number of Results**: How many results to return
- **Location**: Geographic location for localized results
- **Language**: Language code for results (e.g. en, es, fr)
- **Engine (Deprecated)**: Ignored — Serpex is a single search engine. Kept so workflows saved with an older version keep loading; any value is sent as `auto`.

### Parameters

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| q | string | Yes | Search query | "coffee shops near me" |
| time_range | string | No | Time filter | "day" |
| num | number | No | Number of results | 10 |
| location | string | No | Location for localized results | "New York, USA" |
| language | string | No | Language code | "en" |

### Example Workflow

```
Manual Trigger → Serpex (Search for "AI tools") → Process Results → Send Email
```

### Response Data

The node returns the Serpex API response as JSON:

```json
{
  "metadata": {
    "number_of_results": 10,
    "response_time": 850,
    "timestamp": "2026-09-22T09:00:00.000Z",
    "credits_used": 1
  },
  "id": "search_id",
  "query": "your search query",
  "engines": ["auto"],
  "results": [
    {
      "title": "Page Title",
      "url": "https://example.com",
      "snippet": "Description...",
      "position": 1,
      "engine": "auto"
    }
  ]
}
```

`engines` / `engine` are legacy fields kept for compatibility.

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
* [Serpex API Documentation](https://serpex.dev/docs)
* [Serpex Dashboard](https://serpex.dev/dashboard)

## Version history

### 1.0.8

- Docs and node description: Serpex is a real-time web search API.
- **Engine** is deprecated (ignored by the API since 2026-06). The field stays, as free text, so saved workflows keep loading; any value is sent as `auto`.

### 1.0.0

Initial release with support for:
- Real-time web search with structured JSON responses
- Time range filtering
- Customizable result count

## License

[MIT](LICENSE.md)

## Support

For issues, questions, or feature requests:
- Open an issue on [GitHub](https://github.com/divyeshradadiya/n8n-nodes-serpex/issues)
- Contact [Serpex Support](https://serpex.dev/support)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
