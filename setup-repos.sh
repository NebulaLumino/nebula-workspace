#!/bin/bash
set -e

WORKSPACE="/Users/nebulalumino/.openclaw/workspace"
GITHUB_TOKEN=$(gh auth token)

DEEPSEEK_KEY="${DEEPSEEK_API_KEY_REDACTED}"

REPOS=(
  "ai-data-cleaning:AI Data Cleaning & Outlier Detection Tool"
  "ai-chart-recommender:AI Dashboard Widget & Chart Type Recommender"
  "ai-sql-generator:AI SQL Query Generator from Natural Language"
  "ai-ab-test-analyzer:AI A/B Test Results Analyzer"
  "ai-anomaly-detection:AI Time Series Anomaly Detection Dashboard"
  "ai-data-dictionary:AI Data Dictionary & Metadata Documentation Generator"
  "ai-funnel-analysis:AI Funnel Drop-Off Analysis & Recommendation Engine"
  "ai-kpi-alerts:AI KPI Alert Threshold Calculator"
  "ai-cohort-retention:AI Cohort Retention Analysis Generator"
  "ai-feature-importance:AI Correlation Matrix & Feature Importance Visualizer"
)

for repo_info in "${REPOS[@]}"; do
  IFS=':' read -r slug desc <<< "$repo_info"
  dir="$WORKSPACE/$slug"
  echo "===== Processing: $slug ====="

  cd "$dir"

  # Write .env.local
  cat > .env.local << EOF
OPENAI_API_KEY=$DEEPSEEK_KEY
EOF

  # git init if needed
  if [ ! -d .git ]; then
    git init
    git config user.email "agent@openclaw.local"
    git config user.name "OpenClaw Agent"
    git add -A
    git commit -m "Initial commit: $desc"
    echo "  git init + commit done"
  else
    echo "  .git already exists"
  fi

  # Create GitHub repo
  repo_name="$slug"
  if gh repo view "$repo_name" 2>/dev/null; then
    echo "  Repo $repo_name already exists"
  else
    gh repo create "$repo_name" --public --source=. --push 2>&1
    sleep 3
    echo "  Repo $repo_name created"
  fi

  # Push to HTTPS remote
  remote_url="https://NebulaLumino:${GITHUB_TOKEN}@github.com/NebulaLumino/${repo_name}.git"
  git remote remove origin 2>/dev/null || true
  git remote add origin "$remote_url"
  git branch -M main 2>/dev/null || true
  
  retry=0
  while [ $retry -lt 5 ]; do
    if git push origin main 2>&1; then
      echo "  Pushed successfully"
      break
    else
      retry=$((retry + 1))
      echo "  Push attempt $retry failed, retrying in 3s..."
      sleep 3
    fi
  done

  # Verify .git exists
  if [ -d "$dir/.git" ]; then
    echo "  ✅ .git verified for $slug"
  else
    echo "  ❌ .git MISSING for $slug"
  fi

  echo ""
done

echo "===== ALL DONE ====="
