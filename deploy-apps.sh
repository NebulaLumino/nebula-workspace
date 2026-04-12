#!/bin/bash
WORKSPACE="/Users/nebulalumino/.openclaw/workspace"
APPS=(
  "ai-npc-dialogue"
  "ai-game-lore"
  "ai-boss-fight"
  "ai-character-backstory"
  "ai-dungeon-rooms"
  "ai-game-economy"
  "ai-speedrun-route"
  "ai-gacha-calculator"
  "ai-game-music"
  "ai-platformer-level"
  "ai-card-deck"
  "ai-game-accessibility"
  "ai-crafting-system"
  "ai-weather-cycle"
  "ai-patch-notes"
  "ai-esports-bracket"
  "ai-game-achievements"
  "ai-game-lobby"
  "ai-world-geography"
  "ai-npc-schedule"
  "ai-retro-rom"
  "ai-alternate-history"
  "ai-magic-items"
  "ai-conlang-builder"
  "ai-creature-design"
  "ai-skill-tree"
  "ai-faction-matrix"
  "ai-game-pacing"
  "ai-lore-fragment"
)

for app in "${APPS[@]}"; do
  echo ""
  echo "=== Building $app ==="
  app_dir="$WORKSPACE/$app"
  cd "$app_dir"
  
  # Build
  echo "Building..."
  OPENAI_API_KEY=dummy npm run build > /tmp/build_$app.log 2>&1
  if [ $? -ne 0 ]; then
    echo "BUILD FAILED:"
    tail -5 /tmp/build_$app.log
    continue
  fi
  echo "  Build OK"
  
  # Git
  if [ ! -d ".git" ]; then
    echo "Initializing git..."
    git init
    git add -A
    git commit -m "feat: initial commit"
    echo "Creating GitHub repo..."
    gh repo create NebulaLumino/$app --public 2>/dev/null
    git remote add origin https://github.com/NebulaLumino/$app.git 2>/dev/null
    git push -u origin main 2>&1
  else
    echo "Git repo exists, pushing..."
    git add -A
    git commit -m "feat: initial commit" 2>/dev/null
    git push 2>&1 | head -3
  fi
  
  # Clean up
  rm -rf node_modules .next
  echo "✓ $app done"
done

echo ""
echo "=== All apps built and pushed ==="
df -h / | tail -1
