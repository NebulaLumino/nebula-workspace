#!/bin/bash
WORKSPACE="/Users/nebulalumino/.openclaw/workspace"
APPS=(
  "ai-npc-dialogue"
  "ai-game-lore"
  "ai-game-economy"
  "ai-crafting-system"
  "ai-weather-cycle"
  "ai-game-achievements"
  "ai-retro-rom"
  "ai-conlang-builder"
  "ai-game-accessibility"
  "ai-world-geography"
  "ai-alternate-history"
)

for app in "${APPS[@]}"; do
  app_dir="$WORKSPACE/$app"
  cd "$app_dir"
  echo "=== Fixing $app ==="
  
  # Check if it has a remote
  has_remote=$(git remote get-url origin 2>/dev/null | grep -c "github.com" || echo 0)
  
  if [ -d ".git" ]; then
    if [ "$has_remote" = "1" ]; then
      echo "  Repo exists with remote, pushing..."
      git add -A
      git commit -m "feat: initial commit" 2>/dev/null
      git push 2>&1 | head -3
    else
      echo "  Repo exists but no remote..."
      gh repo create NebulaLumino/$app --public 2>/dev/null
      git remote add origin https://github.com/NebulaLumino/$app.git 2>/dev/null
      git push -u origin main 2>&1 | head -3
    fi
  else
    echo "  No git repo, initializing..."
    # First build if needed
    if [ ! -d "node_modules" ]; then
      npm install 2>/dev/null
    fi
    OPENAI_API_KEY=dummy npm run build > /tmp/build_$app.log 2>&1
    if [ $? -ne 0 ]; then
      echo "  BUILD FAILED:"
      tail -3 /tmp/build_$app.log
      continue
    fi
    git init
    git add -A
    git commit -m "feat: initial commit"
    gh repo create NebulaLumino/$app --public 2>/dev/null
    git remote add origin https://github.com/NebulaLumino/$app.git
    git push -u origin main 2>&1 | head -3
    rm -rf node_modules .next
  fi
  echo "  ✓ $app done"
done
echo "=== All fixed ==="
