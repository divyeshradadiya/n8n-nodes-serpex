# 🚀 Quick Start Guide - n8n-nodes-serpex

## Overview

**n8n-nodes-serpex** is a community node that brings the power of Serpex search API to your n8n workflows. Search across Google, Bing, DuckDuckGo, Brave, Yahoo, and Yandex in one unified interface.

## What You'll Need

1. **n8n instance** (self-hosted or cloud)
2. **Serpex API key** (get free at [serpex.dev](https://serpex.dev))
3. **5 minutes** to set everything up

---

## 📦 Installation

### Option 1: Via n8n UI (Easiest)

1. Open your n8n instance
2. Click **Settings** (gear icon)
3. Go to **Community Nodes**
4. Click **Install a community node**
5. Enter: `n8n-nodes-serpex`
6. Click **Install**
7. Wait for installation to complete
8. Restart n8n if needed

### Option 2: Manual Installation

```bash
# Navigate to your n8n installation
cd ~/.n8n

# Install the package
npm install n8n-nodes-serpex

# Restart n8n
```

### Option 3: Docker

Add to your `docker-compose.yml` or Dockerfile:

```dockerfile
RUN cd /usr/local/lib/node_modules/n8n && npm install n8n-nodes-serpex
```

---

## 🔑 Get Your API Key

1. **Sign up** at [serpex.dev](https://serpex.dev)
2. **Verify** your email
3. Go to **Dashboard**
4. Copy your **API Key**
5. ⚡ Free tier: 100 searches/month

---

## ⚙️ Configure Credentials

### In n8n:

1. Click **Credentials** (top right)
2. Click **+ New**
3. Search for **Serpex API**
4. Enter your API key
5. Click **Create**
6. ✅ Test the connection

---

## 🎯 Your First Search

### Step 1: Create a Workflow

1. Click **+ New Workflow**
2. Give it a name: "My First Serpex Search"

### Step 2: Add Manual Trigger

1. Click **+** to add node
2. Search: "Manual"
3. Select **Manual Trigger**

### Step 3: Add Serpex Node

1. Click **+** after Manual Trigger
2. Search: "Serpex"
3. Select **Serpex**
4. Choose your credentials
5. Enter query: `"best pizza in New York"`
6. Leave other settings default

### Step 4: Execute

1. Click **Execute Node** or **Execute Workflow**
2. See results! 🎉

---

## 🛠️ Common Use Cases

### 1. SEO Keyword Research

**Workflow**: Schedule → Serpex → Google Sheets

```
Trigger: Every Monday 9 AM
Serpex: Search your target keywords
Sheets: Log results with timestamp
```

### 2. Competitor Monitoring

**Workflow**: Schedule → Serpex (Multiple Queries) → Slack Alert

```
Trigger: Daily
Serpex: Search "competitor name + [keywords]"
Slack: Alert if new results found
```

### 3. Content Research

**Workflow**: Manual → Serpex → Filter → Notion

```
Trigger: Manual
Serpex: Topic research
Filter: Top 10 results
Notion: Save to database
```

### 4. News Monitoring

**Workflow**: Schedule → Serpex (Time: Day) → Email

```
Trigger: Every 4 hours
Serpex: "your topic" + time_range: day
Email: Send digest
```

---

## 🎛️ Advanced Configuration

### All Available Options

| Option | Type | Description | Example |
|--------|------|-------------|---------|
| Query | String | Search terms | "AI tools 2024" |
| Engine | Select | Search engine | google, bing, auto |
| Time Range | Select | Filter by time | day, week, month |
| Num Results | Number | Result count | 10, 50, 100 |
| Location | String | Geographic | "New York, USA" |
| Language | String | Language code | "en", "es", "fr" |

### Example: Advanced Search

```
Query: "machine learning tutorials"
Engine: google
Time Range: week
Num Results: 20
Location: "San Francisco, CA"
Language: "en"
```

---

## 📊 Understanding Results

### Response Structure

```json
{
  "search_metadata": {
    "id": "search_abc123",
    "status": "Success",
    "query": "your query",
    "engine": "google",
    "total_results": "1,234,567"
  },
  "organic_results": [
    {
      "position": 1,
      "title": "Best Result",
      "link": "https://example.com",
      "snippet": "Description of the page...",
      "date": "3 days ago"
    }
  ],
  "related_searches": [
    "related query 1",
    "related query 2"
  ],
  "people_also_ask": [...]
}
```

### Accessing Data in n8n

Use expressions to access specific data:

```
{{ $json.organic_results[0].title }}
{{ $json.organic_results[0].link }}
{{ $json.search_metadata.total_results }}
```

---

## 🐛 Troubleshooting

### "Authentication Failed"

**Problem**: Invalid API key

**Solution**:
1. Check API key is copied correctly
2. Verify no extra spaces
3. Check subscription is active at [serpex.dev/dashboard](https://serpex.dev/dashboard)

### "No Results"

**Problem**: Query returns empty

**Solution**:
1. Try broader search terms
2. Change search engine
3. Remove time filter
4. Check query spelling

### "Rate Limit Exceeded"

**Problem**: Too many requests

**Solution**:
1. Check your plan limits
2. Add delays between searches
3. Upgrade plan at [serpex.dev/pricing](https://serpex.dev/pricing)

### "Node Not Found"

**Problem**: Package not installed

**Solution**:
```bash
# Reinstall
npm install n8n-nodes-serpex

# Restart n8n
pm2 restart n8n
# or
systemctl restart n8n
```

---

## 💡 Pro Tips

### 1. Batch Searching

Use **Loop** node to search multiple queries:

```
Set Node (array of queries) → Loop → Serpex → Merge
```

### 2. Error Handling

Enable **Continue on Fail** in Serpex node settings to handle errors gracefully.

### 3. Rate Limiting

Add **Wait** node between searches:

```
Serpex → Wait (2 seconds) → Next Serpex
```

### 4. Data Filtering

Use **Filter** node to get only top results:

```
Serpex → Filter (position < 5) → Process
```

### 5. Caching Results

Store results in n8n's **Static Data** to avoid duplicate searches:

```javascript
// In Code node
const cache = $workflow.staticData;
if (!cache[query]) {
  cache[query] = $json.results;
}
```

---

## 📈 Monitoring Usage

### Check API Usage

1. Log in to [serpex.dev](https://serpex.dev)
2. Go to **Dashboard**
3. View **Usage Stats**

### Track in n8n

Add **Set** node after Serpex:

```
Set Node:
- search_count: {{ $now.toISO() }}
- query: {{ $node["Serpex"].parameter["query"] }}
- results: {{ $json.organic_results.length }}
```

---

## 🔄 Upgrading

### Update Package

```bash
npm update n8n-nodes-serpex
```

### Via n8n UI

1. Settings → Community Nodes
2. Find n8n-nodes-serpex
3. Click **Update** if available

---

## 🆘 Get Help

### Documentation
- 📖 [Full Documentation](./DOCUMENTATION.md)
- 🔧 [API Reference](https://serpex.dev/docs)

### Support
- 💬 [GitHub Issues](https://github.com/divyeshradadiya/n8n-nodes-serpex/issues)
- 📧 [Serpex Support](https://serpex.dev/support)
- 👥 [n8n Community](https://community.n8n.io)

### Resources
- 🎓 [Example Workflows](#)
- 🎬 [Video Tutorial](#)
- 📝 [Blog Post](#)

---

## ✅ Checklist

Before going live with your workflow:

- [ ] API key is valid and active
- [ ] Tested with sample data
- [ ] Error handling configured
- [ ] Rate limits considered
- [ ] Credentials secured
- [ ] Results validated
- [ ] Monitoring in place

---

## 🎉 You're All Set!

You now have Serpex integrated into your n8n workflows. Start building powerful automations with real-time search data!

**Happy Automating! 🚀**

---

**Next Steps:**
- Explore [example workflows](./DOCUMENTATION.md#example-workflows)
- Join [n8n community](https://community.n8n.io)
- Share your workflows!
