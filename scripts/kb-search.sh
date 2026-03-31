#!/bin/bash
# Knowledge Base Search Script
# Usage: ./kb-search.sh [query]

QUERY="${1:-}"
KB_DIR="$(dirname "$0")/../kb"

if [ -z "$QUERY" ]; then
    echo "Usage: $0 <search-query>"
    echo "Search the knowledge base for a term"
    exit 1
fi

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "Searching for: $QUERY"
echo "---"

# Search in kb directory
results=$(grep -r -i --include="*.md" "$QUERY" "$KB_DIR" 2>/dev/null)

if [ -z "$results" ]; then
    echo "No results found."
    exit 0
fi

# Display results with file names
echo "$results" | while IFS= read -r line; do
    file=$(echo "$line" | cut -d: -f1)
    content=$(echo "$line" | cut -d: -f2-)
    rel_path="${file#$KB_DIR/}"
    echo -e "${GREEN}$rel_path${NC}: ${content:0:100}..."
done
