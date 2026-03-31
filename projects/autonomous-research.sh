#!/bin/bash
# Autonomous Research Agent - Runs periodically to research AI trends and opportunities

DATE=$(date +%Y-%m-%d)
LOG_FILE="memory/${DATE}-research.md"

echo "# Research Log - $DATE" > "$LOG_FILE"
echo "" >> "$LOG_FILE"
echo "## Trending GitHub Repos" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"

# Search for trending AI projects
curl -s "https://api.github.com/search/repositories?q=ai+agent+created:>2025-01-01&sort=stars&order=desc" | jq '.items[:10] | .[] | "- [\(.full_name)](\(.html_url)) - \(.stargazers_count) stars"' >> "$LOG_FILE" 2>/dev/null || echo "GitHub API unavailable" >> "$LOG_FILE"

echo "" >> "$LOG_FILE"
echo "## Hacker News Top" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"

# Try to fetch HN
curl -s "https://hacker-news.firebaseio.com/v0/topstories.json" | jq '.[:10]' >> "$LOG_FILE" 2>/dev/null || echo "HN unavailable" >> "$LOG_FILE"

echo "" >> "$LOG_FILE"
echo "## Notes" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"
echo "- Research completed at $(date)" >> "$LOG_FILE"

echo "Research completed: $DATE"
