# MEMORY.md - Long-Term Agent Memory

_Last updated: 2026-03-19_

## Identity
- **Name:** Nova
- **User:** Nebula (from hostname nebulalumino)
- **Emoji:** 🧠
- **Created:** 2026-03-15

## User Profile
- Name: Nebula (from hostname)
- Timezone: America/Los_Angeles
- Equipment: MacBook/macOS (Darwin 25.3.0)
- Experience: AI agents, CLI tools, automation, building things

## Infrastructure

### Vercel
- Account: IasmymNishizawa@gmail.com
- Token: stored in 1Password ("Vercel Account")
- Team/org: sac1
- Projects deploy to: vercel.app (aliased subdomains)

### 1Password
- Authenticated via `op signin` (no need to re-auth frequently)
- Stores all API keys and credentials

### DeepSeek API
- API Key: `[DEEPSEEK_API_KEY_REDACTED]`
- Endpoint: `https://api.deepseek.com/v1`
- Used for: AI app development/testing (OpenAI-compatible)

### MixedCloud APIs (Volcengine/ByteDance)
- API Key: `[OPENAI_API_KEY_REDACTED]`
- Image: doubao-seedream-5-0-260128
- Video: doubao-seedance-1-5-pro-251215

## Key Projects Built

### AI App Fleet (Cycle 5 — March 19)
All Next.js 16 + Tailwind CSS + DeepSeek API + Vercel:

| # | App | URL |
|---|-----|-----|
| 111 | AI Recipe Generator | ai-recipe-generator-blue.vercel.app |
| 112 | AI Song Lyrics Generator | ai-lyrics-generator-mu.vercel.app |
| 114 | AI Business Name Generator | ai-business-name-generator-one.vercel.app |
| 115 | AI Product Description Generator | ai-product-desc-generator-ten.vercel.app |
| 117 | AI LinkedIn Post Generator | ai-linkedin-post-generator-sac1.vercel.app |
| 120 | AI Email Subject Line Generator | ai-email-subject-generator-sac1.vercel.app |

Previous cycles (031-110) completed March 18. Total: 120 tasks across 4 cycles.

## Skills Installed
- volcengine-seedream: AI image generation
- volcengine-seedance: AI video generation
- clawhub: Skill management
- github: GitHub operations
- And ~15 more (check with `npx openclaw skills list`)

## Preferences
- Prefers to work autonomously (said "keep developing" — doesn't micromanage)
- Interested in AI agents, automation, Next.js development
- Likes seeing things deployed quickly
- Quiet hours: generally avoids late-night/early-morning work unless asked

## Workspace Structure
```
~/.openclaw/workspace/
├── skills/           # Custom skills (Volcengine, etc.)
├── scripts/          # Utilities (todo.py, healthcheck.py, etc.)
├── tasks/            # Task files (task-XXXX.md) + TASKS.md
├── memory/            # Daily logs + project-progress.md
├── docs/              # OpenClaw documentation
└── ai-*-generator/   # Individual Next.js app projects
```

## GitHub
- Username: NebulaLumino
- All repos at: https://github.com/NebulaLumino
- Previous 30 repos from March 16 still exist

## Lessons Learned
- Session interruption mid-write — always verify files were actually saved
- Vercel token must be passed as env var: `VERCEL_TOKEN=... npx vercel`
- create-next-app can be fully automated with `--yes` flag
- Task files should be updated immediately after deployment
- TASKS.md should be kept in sync with individual task files

## Completed AI Apps (2026-03-20)
- **ai-landing-page-copy**: https://ai-landing-page-copy.vercel.app
  - Next.js 15 + Tailwind + DeepSeek API
  - Landing page copy generator (hero, features, CTA, FAQ)
  - GitHub: https://github.com/NebulaLumino/ai-landing-page-copy

## Vercel Token Issue
- Token `[VERCEL_TOKEN_REDACTED]` is EXPIRED
- CLI requires interactive `vercel login` - cannot deploy headlessly
- Workaround: Use Vercel REST API via curl with a fresh token

## Completed AI Apps (2026-03-22)
- **Fleet: 480 tasks complete, 164 GitHub repos, 20+ Vercel projects**

## Completed AI Apps (2026-03-20 continued)
- **ai-contract-analyzer**: https://ai-contract-analyzer-g1t0s4ur2-sac1.vercel.app
  - Next.js 15 + Tailwind + DeepSeek API
  - Contract clause analyzer (summary, risks, plain-English explanation)
  - GitHub: https://github.com/NebulaLumino/ai-contract-analyzer

## Vercel Deployment Insights
- `npx vercel --token="..." --yes --prod` works fine for headless deploys
- Token auth works on API even if CLI `vercel login` session is expired
- Direct Vercel REST API requires proper file upload (fileData array with SHA1 refs)

## Completed AI Apps (2026-03-22)
- **Fleet: 480 tasks complete, 164 GitHub repos, 20+ Vercel projects**

## Completed AI Apps (2026-03-20 continued)
- **ai-competitor-analyzer**: https://ai-competitor-analyzer-rho.vercel.app
  - Next.js 15 + Tailwind + DeepSeek API
  - Competitor landscape, SWOT, battle cards, market positioning
  - GitHub: https://github.com/NebulaLumino/ai-competitor-analyzer
- **ai-roadmap-builder**: https://ai-roadmap-builder-flax.vercel.app
  - Next.js 15 + Tailwind + DeepSeek API
  - Quarterly roadmap builder with OKRs, priorities, risk analysis
  - GitHub: https://github.com/NebulaLumino/ai-roadmap-builder
- **ai-pitch-deck-generator**: https://ai-pitch-deck-generator-sac1.vercel.app
  - Next.js 15 + Tailwind + DeepSeek API
  - Investor pitch deck outline with storytelling tips, investor match, objection handling
  - GitHub: https://github.com/NebulaLumino/ai-pitch-deck-generator

## Cycle 14 Completion (2026-03-21)
- 20 apps built + pushed to GitHub (tasks 361-380)
- 10 curiosity research docs written (tasks 381-390)
- Total apps in workspace: 194+ ai-* apps

### Vercel Token Issue (ONGOING)
- Token `[VERCEL_TOKEN_REDACTED]` → invalid/not authorized
- `vercel login` needed to refresh interactively
- OR: create new token at vercel.com/settings/tokens
- Until fixed: push to GitHub only, no Vercel deploy

### Fleet Status (2026-03-21)
- 73 apps confirmed deployed on vercel.app
- ~30 Cycle 14 apps built + on GitHub, NOT deployed (Vercel token blocked)
- Cycle 15 (391-420): task files written, apps being built by subagent
- 101 repos on GitHub (NebulaLumino account)

### Vercel Token BROKEN (2026-03-21)
- `[VERCEL_TOKEN_REDACTED]` → "not valid" / "not authorized"
- Deploys blocked until fresh token obtained
- Fix: vercel.com/settings/tokens or `vercel login` (interactive)

### Disk Space FIXED (2026-03-21 evening)
- Was 641MB → Now 32GB free
- Cleaned: ~80 node_modules folders (40GB freed)
- Only kept: ai-travel-itinerary/node_modules

### Subagent Pattern (Proven)
- Spawn subagent for bulk app building (10 apps at a time works well)
- 48 min runtime for 10 apps, 1.9M tokens
- Pattern: scaffold → implement → build → git init → commit → gh push
- Git identity: set via `git config --global user.email/name` before first commit

### Vercel Token FIXED (2026-03-21 evening)
- Token is: `[VERCEL_TOKEN_REDACTED]`
- Prefix is `vcp_`, NOT `ptx_` (the `ptx_` prefix was wrong all along)
- Deploy command: `npx vercel --token="[VERCEL_TOKEN_REDACTED]" --yes --prod`
- Team: sac1
- Account: IasmymNishizawa@gmail.com

### Fleet Status (2026-03-22)
- 90+ apps deployed on vercel.app (Cycles 1-17)
- Cycles 1-17 complete (510 tasks done or in progress)
- Cycle 18 (481-510) building now
- ~130 repos on GitHub (NebulaLumino account)
- All token errors resolved: use `vcp_` prefix always

### Bluebubbles Fix
- Moved duplicate ~/.openclaw/extensions/bluebubbles → .bak
- Official version at: ~/.nvm/.../openclaw/extensions/bluebubbles/
