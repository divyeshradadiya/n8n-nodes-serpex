# n8n-nodes-serpex - Community Node

![Serpex Banner](https://serpex.dev/images/banner.png)

## Overview

This package contains the **Serpex** community node for n8n, bringing real-time web search results into your n8n workflows.

### What is Serpex?

[Serpex](https://serpex.dev) is a real-time web search API that returns structured JSON search results. Built for AI agents, LLM tools, RAG pipelines and automated workflows.

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

- ✅ Real-time web search queries
- ✅ Time-based filtering
- ✅ Customizable result count
- ✅ Structured JSON responses

### Engine (deprecated)

Serpex is a single search engine, so there is nothing to select. The **Engine**
field is deprecated and ignored by the API since 2026-06. It stays in
**Additional Fields** (as free text) so workflows saved with an older version of
this node keep loading and running; any value is sent as `auto`.

### Parameters

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| q | string | Yes | Search query | "coffee shops near me" |
| time_range | string | No | Time filter (all, day, week, month, year) | "day" |
| num | number | No | Number of results | 10 |
| location | string | No | Location for localized results | "New York, USA" |
| language | string | No | Language code | "en" |

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

`engines` / `engine` are legacy fields kept for compatibility.

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
- Check time range settings

**Issue: "Rate limit exceeded"**
- Upgrade your Serpex plan
- Implement retry logic
- Space out your requests

## API Limits

See [Serpex Pricing](https://serpex.dev/pricing) for plans and rate limits.

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
