#!/usr/bin/env node
/**
 * Web Scraper Base - Reusable scraping templates with Playwright
 * 
 * Usage:
 *   node scraper.js --url <url> --selector <selector> [--wait <ms>] [--output <file>]
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const config = {
    url: null,
    selector: 'body',
    wait: 1000,
    output: null,
    format: 'text',
    cookies: null,
    headers: null,
    timeout: 30000
};

// Parse arguments
for (let i = 0; i < args.length; i++) {
    if (args[i] === '--url' && args[i + 1]) config.url = args[++i];
    else if (args[i] === '--selector' && args[i + 1]) config.selector = args[++i];
    else if (args[i] === '--wait' && args[i + 1]) config.wait = parseInt(args[++i]);
    else if (args[i] === '--output' && args[i + 1]) config.output = args[++i];
    else if (args[i] === '--format' && args[i + 1]) config.format = args[++i];
    else if (args[i] === '--cookies' && args[i + 1]) config.cookies = args[++i];
    else if (args[i] === '--headers' && args[i + 1]) config.headers = JSON.parse(args[++i]);
    else if (args[i] === '--timeout' && args[i + 1]) config.timeout = parseInt(args[++i]);
}

if (!config.url) {
    console.error('Usage: node scraper.js --url <url> [--selector <selector>] [--wait <ms>] [--output <file>] [--format text|html|json]');
    process.exit(1);
}

async function scrape() {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });
    
    const page = await context.newPage();
    
    // Set extra headers if provided
    if (config.headers) {
        await page.setExtraHTTPHeaders(config.headers);
    }
    
    // Load cookies if provided
    if (config.cookies && fs.existsSync(config.cookies)) {
        const cookies = JSON.parse(fs.readFileSync(config.cookies, 'utf8'));
        await context.addCookies(cookies);
    }
    
    try {
        console.log(`Fetching: ${config.url}`);
        await page.goto(config.url, { timeout: config.timeout, waitUntil: 'domcontentloaded' });
        
        // Wait for dynamic content
        if (config.wait > 0) {
            await page.waitForTimeout(config.wait);
        }
        
        // Extract content based on format
        let content;
        if (config.format === 'html') {
            content = await page.content();
        } else if (config.format === 'json') {
            const elements = await page.$$eval(config.selector, els => 
                els.map(el => ({
                    text: el.textContent?.trim(),
                    html: el.innerHTML?.trim(),
                    tag: el.tagName.toLowerCase(),
                    attributes: Object.fromEntries(
                        Array.from(el.attributes).map(a => [a.name, a.value])
                    )
                }))
            );
            content = JSON.stringify(elements, null, 2);
        } else {
            content = await page.$$eval(config.selector, els => 
                els.map(el => el.textContent?.trim()).filter(Boolean).join('\n')
            );
        }
        
        // Output
        if (config.output) {
            fs.writeFileSync(config.output, content, 'utf8');
            console.log(`Saved to: ${config.output}`);
        } else {
            console.log(content);
        }
        
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    } finally {
        await browser.close();
    }
}

scrape();
