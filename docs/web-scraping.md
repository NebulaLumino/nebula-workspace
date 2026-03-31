# Web Scraping Framework

Tools for scraping websites using Playwright.

## Base Scraper

```bash
# Basic text extraction
node scripts/scraper.js --url "https://example.com" --selector "article"

# Extract HTML
node scripts/scraper.js --url "https://example.com" --format html --output page.html

# Extract as JSON
node scripts/scraper.js --url "https://example.com" --selector "div.item" --format json

# Wait for dynamic content
node scripts/scraper.js --url "https://example.com" --wait 3000

# Set timeout
node scripts/scraper.js --url "https://example.com" --timeout 60000
```

### Options
- `--url` - Target URL (required)
- `--selector` - CSS selector (default: body)
- `--wait` - Wait milliseconds after load (default: 1000)
- `--format` - Output format: text, html, json (default: text)
- `--output` - Save to file
- `--timeout` - Page load timeout ms (default: 30000)

## Content Scraper

Extract articles and listings:

```bash
# Extract article content
node scripts/content-scraper.js "https://news.site.com/article" article

# Extract listing items
node scripts/content-scraper.js "https://shop.site.com/products" listings --limit=50
```

## Rate Limiting

Add delays between requests:

```javascript
// In your scraper
const delay = ms => new Promise(r => setTimeout(r, ms));

for (const url of urls) {
    await scrape(url);
    await delay(1000); // 1 second between requests
}
```

## Best Practices

1. **Respect robots.txt** - Check before scraping
2. **Add delays** - Don't hammer servers
3. **Use headers** - Mimic real browser
4. **Handle errors** - Try/catch with retries
5. **Cache responses** - Don't re-scrape same content
