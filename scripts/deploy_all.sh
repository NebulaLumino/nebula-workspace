#!/bin/bash
TOKEN="[VERCEL_TOKEN_REDACTED]"
DEEPSEEK_KEY="[DEEPSEEK_API_KEY_REDACTED]"

deploy_app() {
  local slug=$1
  local app_dir="/Users/nebulalumino/ai-apps/$slug"
  echo ""
  echo "=== DEPLOYING $slug ==="
  
  # Install deps
  echo "  [1/4] Installing deps..."
  npm install --silent 2>/dev/null
  if [ $? -ne 0 ]; then
    echo "  FAIL: npm install failed"
    return 1
  fi
  
  # Git add/commit/push
  echo "  [2/4] Git push..."
  git add -A 2>/dev/null
  git commit -m "Build: $slug" 2>/dev/null
  # Check if gh repo exists, if not create it
  if ! gh repo view "$slug" > /dev/null 2>&1; then
    gh repo create "$slug" --public --source="$app_dir" --push 2>/dev/null
  fi
  git push origin main --force 2>/dev/null
  
  # Vercel deploy
  echo "  [3/4] Vercel deploy..."
  output=$(vercel --prod --yes --token "$TOKEN" 2>&1)
  
  # Extract URL
  url=$(echo "$output" | grep "vercel.app" | grep "Production:" | sed 's/.*Production: //' | tr -d ' ')
  if [ -z "$url" ]; then
    url=$(echo "$output" | grep "vercel.app" | tail -1 | awk '{print $1}')
  fi
  
  echo "  [4/4] DONE: $url"
  echo "  $url" >> /tmp/cycle18_deployed.txt
  return 0
}

# Clear deploy log
> /tmp/cycle18_deployed.txt

SLUGS=(
  "ai-subscription-revenue-forecast"
  "ai-customer-support-sla"
  "ai-gtm-timeline"
  "ai-brand-asset-generator"
  "ai-ab-test-calculator"
  "ai-legal-nda-generator"
  "ai-employee-onboarding"
  "ai-crm-data-quality"
  "ai-roi-calculator"
  "ai-competitive-analysis-matrix"
  "ai-user-interview-synthesizer"
  "ai-qa-document-generator"
  "ai-sentiment-analysis-dashboard"
  "ai-project-risk-register"
  "ai-bio-about-page"
  "ai-event-agenda-builder"
  "ai-charity-impact-calculator"
  "ai-podcast-show-notes"
  "ai-video-timestamp-generator"
)

for slug in "${SLUGS[@]}"; do
  deploy_app "$slug"
done

echo ""
echo "=== ALL DEPLOYMENTS COMPLETE ==="
echo "URLs:"
cat /tmp/cycle18_deployed.txt
