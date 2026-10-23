# n8n-nodes-serpex - Community Node

![Serpex Banner](https://serpex.dev/images/banner.png)

## Overview

This package contains the **Serpex** community node for n8n, bringing web search and page extraction into your n8n workflows.

### What is Serpex?

[Serpex](https://serpex.dev) is a web search API and extract API for AI agents: ranked web results as structured JSON, optionally with page content as markdown, plus extraction of known URLs. Built for AI agents, LLM tools, RAG pipelines and automated workflows.

## Installation

### Via n8n Community Nodes (Recommended)

1. Open your n8n instance
2. Go to **Settings** > **Community Nodes**
3. Click **Install**
4. Enter: `n8n-nodes-serpex`
5. Click **Install**

### Manual Installation

```bash
# For npm
npm install n8n-nodes-serpex

# For pnpm
pnpm add n8n-nodes-serpex

# For yarn
yarn add n8n-nodes-serpex
```

### Docker Installation

Add to your Dockerfile before font installation:

```dockerfile
RUN cd /usr/local/lib/node_modules/n8n && npm install n8n-nodes-serpex
```

## Quick Start

### 1. Get Your API Key

1. Sign up at [Serpex.dev](https://serpex.dev)
2. Get your API key from the dashboard

### 2. Configure Credentials in n8n

1. In n8n, go to **Credentials** > **New**
2. Search for **Serpex API**
3. Paste your API key
4. Click **Save**

### 3. Use the Node

1. Add **Serpex** node to your workflow
2. Select your credentials
3. Enter your search query
4. Configure options (optional)
5. Execute!

## Features

### Search Operations

- ✅ Web search queries with structured JSON responses
- ✅ Optional page content (markdown) for the top 5 or 10 results
- ✅ Extract 1 to 10 known URLs as markdown or HTML
- ✅ Usage and credit balance
- ✅ Usable as a tool by the n8n AI Agent

### Engine (deprecated)

Every search is routed automatically, so there is nothing to select. The **Engine**
field is deprecated and ignored by the API since 2026-06. It is shown only on
node version 1, so workflows saved with an older version keep loading; it is not sent.

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

## Example Workflows

### 1. Basic Search

```
Manual Trigger → Serpex (Query: "AI trends 2024") → Display Results
```

### 2. Automated SEO Monitoring

```
Schedule Trigger → Serpex (Track keyword rankings) → Spreadsheet → Slack Notification
```

### 3. Content Research

```
Webhook → Serpex (Search multiple queries) → Filter Results → Airtable
```

### 4. Competitor Analysis

```
Manual Trigger → Serpex (Competitor keywords) → Analyze Data → Email Report
```

## Response Format

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

## SDKs

Serpex provides official SDKs for easy integration:

### TypeScript SDK
```bash
npm install serpex
```

### Python SDK
```bash
pip install serpex
```

## Use Cases

### AI & Data Projects
- Structured data extraction for AI training
- Automated research and content generation
- Market intelligence gathering
- Competitive analysis

### SEO & Marketing
- Track keyword rankings
- Monitor SERP features
- Analyze competitor content
- Research trending topics

### Automation
- Scheduled monitoring
- Alert systems
- Data enrichment
- Report generation

## Troubleshooting

### Common Issues

**Issue: "Authentication failed"**
- Check your API key is correct
- Verify your subscription is active
- Check API quota hasn't been exceeded

**Issue: "No results returned"**
- Verify your search query

**Issue: "Rate limit exceeded"**
- Each plan has a per-second limit: 5, 25 or 50 requests per second
- The error says how long to wait; enable **Retry On Fail** on the node
- A search with page content counts as 2 (5 pages) or 3 (10 pages) requests

### Error messages

The node reports what the Serpex API said, by HTTP status:

| Status | Message | What to do |
|---|---|---|
| 400 | Serpex rejected the request: ... | Fix the node parameters |
| 401 | Serpex rejected the API key: ... | Check the Serpex API credential |
| 402 | Out of Serpex credits. Balance: N credits. | Top up at app.serpex.dev |
| 429 | Serpex rate limit exceeded (limit: N requests per second). | Retry after the wait in the description |
| 5xx | Serpex is temporarily unavailable (HTTP 5xx): ... | Retry shortly; not charged |

With **Continue On Fail**, the failed item carries `error`, `statusCode` and `description`
instead of stopping the workflow.

## API Limits

See [Serpex rate limits](https://serpex.dev/docs/getting-started/rate-limits) and
[pricing](https://serpex.dev/docs/getting-started/pricing).

## Development

### Building from Source

```bash
# Clone the repository
git clone https://github.com/divyeshradadiya/n8n-nodes-serpex.git
cd n8n-nodes-serpex

# Install dependencies
npm install

# Build the package
npm run build

# Link for local testing
npm link
```

### Testing

```bash
# Run linter
npm run lint

# Fix lint issues
npm run lintfix

# Format code
npm run format
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support & Resources

- 📖 [Serpex API Documentation](https://serpex.dev/docs)
- 💬 [GitHub Issues](https://github.com/divyeshradadiya/n8n-nodes-serpex/issues)
- 🌐 [Serpex Website](https://serpex.dev)
- 📧 [Serpex Support](https://serpex.dev/support)
- 📚 [n8n Documentation](https://docs.n8n.io)

## License

MIT © 2025 Divyesh Radadiya

## Acknowledgments

- Built for the [n8n](https://n8n.io) community
- Powered by [Serpex API](https://serpex.dev)

---

**Made with ❤️ for the n8n community**
