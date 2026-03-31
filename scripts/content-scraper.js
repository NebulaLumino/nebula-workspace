#!/usr/bin/env node
/**
 * Content Scraper - Extract articles, product listings, etc.
 */

const { chromium } = require('playwright');

async function scrapeArticle(url, options = {}) {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    try {
        await page.goto(url, { timeout: options.timeout || 30000 });
        await page.waitForTimeout(options.wait || 2000);
        
        const article = await page.evaluate(() => {
            // Try common article selectors
            const selectors = [
                'article',
                '[role="article"]',
                '.article',
                '.post-content',
                '.entry-content',
                'main',
                '.content'
            ];
            
            let content = null;
            for (const sel of selectors) {
                const el = document.querySelector(sel);
                if (el) {
                    content = {
                        title: document.querySelector('h1')?.textContent?.trim() || 
                               document.querySelector('title')?.textContent?.trim(),
                        content: el.textContent?.trim(),
                        url: window.location.href
                    };
                    break;
                }
            }
            return content || { error: 'No content found' };
        });
        
        return article;
        
    } finally {
        await browser.close();
    }
}

async function scrapeListings(url, options = {}) {
    const { selector = 'a, li, div[item]' } = options;
    
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    try {
        await page.goto(url, { timeout: options.timeout || 30000 });
        await page.waitForTimeout(options.wait || 2000);
        
        const listings = await page.$$eval(selector, els => 
            els.slice(0, options.limit || 20).map(el => ({
                text: el.textContent?.trim().substring(0, 200),
                href: el.querySelector('a')?.href,
                title: el.querySelector('a, h2, h3, .title')?.textContent?.trim()
            })).filter(item => item.text)
        );
        
        return listings;
        
    } finally {
        await browser.close();
    }
}

// CLI
const url = process.argv[2];
const mode = process.argv[3] || 'article';

if (!url) {
    console.log('Usage:');
    console.log('  node content-scraper.js <url> [article|listings] [--limit N]');
    process.exit(1);
}

if (mode === 'article') {
    scrapeArticle(url).then(data => console.log(JSON.stringify(data, null, 2)));
} else if (mode === 'listings') {
    const limit = parseInt(process.argv.find(a => a.startsWith('--limit'))?.split('=')[1]) || 20;
    scrapeListings(url, { limit }).then(data => console.log(JSON.stringify(data, null, 2)));
}
