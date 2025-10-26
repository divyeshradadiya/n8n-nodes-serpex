# n8n-nodes-serpex - Community Node

![Serpex Banner](https://serpex.dev/images/banner.png)

## Overview

This package contains the **Serpex** community node for n8n, enabling you to integrate real-time search results from multiple search engines into your n8n workflows.

### What is Serpex?

[Serpex](https://serpex.dev) is a powerful API that provides search results from:
- 🔍 Google
- 🔍 Bing  
- 🦆 DuckDuckGo
- 🦁 Brave
- 📧 Yahoo
- 🔎 Yandex

Perfect for SEO analysis, content research, market intelligence, and automated data collection.

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
2. Get your API key from the [Dashboard](https://serpex.dev/dashboard)
3. Free tier includes 100 searches/month

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

- ✅ Execute search queries
- ✅ Multi-engine support (auto-selection or manual)
- ✅ Time-based filtering
- ✅ Location-based results
- ✅ Language selection
- ✅ Customizable result count

### Supported Parameters

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| Query | string | Search query | Required |
| Engine | dropdown | Search engine | auto |
| Time Range | dropdown | Filter by time | all |
| Number of Results | number | Results count | 10 |
| Location | string | Geographic location | - |
| Language | string | Language code | - |

### Available Engines

- **Auto** - Automatically selects best engine
- **Google** - Google Search
- **Bing** - Microsoft Bing
- **DuckDuckGo** - Privacy-focused search
- **Brave** - Brave Search
- **Yahoo** - Yahoo Search
- **Yandex** - Yandex (Russian search engine)

### Time Range Options

- All time
- Past 24 hours
- Past week
- Past month
- Past year

*Note: Time filtering not supported by Brave*

## Example Workflows

### 1. Basic Search

```
Manual Trigger → Serpex (Query: "AI trends 2024") → Display Results
```

### 2. Automated SEO Monitoring

```
Schedule Trigger → Serpex (Track keyword rankings) → Google Sheets → Slack Notification
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

The node returns comprehensive search data:

```json
{
  "search_metadata": {
    "id": "...",
    "status": "Success",
    "query": "your query",
    "engine": "google"
  },
  "organic_results": [
    {
      "position": 1,
      "title": "Page Title",
      "link": "https://example.com",
      "snippet": "Description...",
      "date": "2024-01-01"
    }
  ],
  "related_searches": [...],
  "people_also_ask": [...]
}
```

## Use Cases

### SEO & Marketing
- Track keyword rankings
- Monitor SERP features
- Analyze competitor content
- Research trending topics

### Data Collection
- Gather market intelligence
- Collect product information
- Monitor brand mentions
- Track news and updates

### Content Research
- Find trending topics
- Gather source materials
- Validate information
- Discover content gaps

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
- Try a different search engine
- Check time range settings

**Issue: "Rate limit exceeded"**
- Upgrade your Serpex plan
- Implement retry logic
- Space out your requests

## API Limits

| Plan | Searches/Month | Rate Limit |
|------|----------------|------------|
| Free | 100 | 10/min |
| Basic | 1,000 | 30/min |
| Pro | 10,000 | 100/min |
| Enterprise | Custom | Custom |

Check [Serpex Pricing](https://serpex.dev/pricing) for details.

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
