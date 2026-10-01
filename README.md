# n8n-nodes-serpex

This is an n8n community node that lets you use [Serpex](https://serpex.dev) in your n8n workflows.

**Serpex** is a web search API and extract API for AI agents. Search returns ranked web results, optionally with page content as markdown; Extract turns known URLs into clean markdown. Serpex runs its own search engine.

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
- **Execute**: Run a web search and get structured JSON results. Optional **Include Content** fetches page content (markdown) for the top 5 or 10 results.

### Extract
- **Execute**: Extract 1 to 10 known URLs as clean markdown or HTML.

### Usage
- **Get**: Request counts and the credit balance for your API key (free).

The node can also be used as a tool by the n8n AI Agent.

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

### Parameters

| Resource | Parameter | Type | Required | Description | Example |
|----------|-----------|------|----------|-------------|---------|
| Search | Query | string | Yes | Search query (max 500 characters) | "coffee shops near me" |
| Search | Include Content | boolean | No | Also fetch page content (markdown) for the top results; a page that can't be extracted returns `content_error` | true |
| Search | Content Results | 5 or 10 | No | How many top results get content (default 5) | 5 |
| Extract | URLs | string | Yes | 1 to 10 URLs, separated by commas or new lines | "https://example.com" |
| Extract | Format | markdown or html | No | Output format (default markdown) | "markdown" |
| Usage | Days | number | No | Days of history, 1 to 90 (default 30) | 30 |

### Node versions

Version 2 (the default for new nodes) shows only the parameters the Serpex API uses.
Workflows saved with version 1 keep loading: their **Additional Fields** (Engine,
Time Range, Number of Results, Location, Language) are still shown, marked deprecated,
and are no longer sent — the Serpex API ignores them.

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

`engines` / `engine` are deprecated response fields (always `"auto"`); they may be removed from responses later, so don't build logic on them.

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
* [Serpex API Documentation](https://serpex.dev/docs)
* [Serpex Dashboard](https://serpex.dev/dashboard)

## Version history

### 1.1.0

- Node version 2: adds Include Content / Content Results on Search, an **Extract** resource and a **Usage** resource; drops the fields the API ignores. Version 1 workflows keep loading and no longer send those fields.
- The credential test calls the free `GET /api/usage` instead of running a billed search.
- Usable as a tool by the n8n AI Agent.
- Every request sends `User-Agent: serpex-n8n/<version>`.

### 1.0.8

- Docs and node description updated.
- **Engine** is deprecated (ignored by the API since 2026-06). The field stays, as free text, so saved workflows keep loading; any value is sent as `auto`.

### 1.0.0

Initial release with support for:
- Web search with structured JSON responses

## License

[MIT](LICENSE.md)

## Support

For issues, questions, or feature requests:
- Open an issue on [GitHub](https://github.com/divyeshradadiya/n8n-nodes-serpex/issues)
- Contact [Serpex Support](https://serpex.dev/support)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
