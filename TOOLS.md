# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Skills Installed

- **vercel** - Deploy and manage Vercel projects
- **cli-anything** - Auto-generate CLIs for any software
- **peekaboo** - macOS UI automation (screenshot, click, type)

## Vercel Setup

- **Account:** IasmymNishizawa@gmail.com
- **Token:** `[VERCEL_TOKEN_REDACTED]` (in 1Password) — ⚠️ EXPIRED, requires interactive re-auth via `vercel login`
- **Project:** workspace (prj_JX9zdTNpMzBHrshBISYSnLK5Lr7W)
- **Team:** team_fd6RUrZr3zA9LkLf9j8Sea5F
- **Deployed:** weather-ai-one.vercel.app, ai-landing-page-copy.vercel.app

## Project Focus

- **Framework:** Next.js 15/16 (App Router)
- **Deployment:** Vercel (deploy-ready)
- **AI Library:** OpenAI SDK (compatible with DeepSeek, OpenAI, etc.)
- **Testing API:** DeepSeek ([DEEPSEEK_API_KEY_REDACTED])

## Deployed Projects

- **AI Chat WebApp:** https://ai-chat-webapp-sac1.vercel.app (Next.js + DeepSeek)

## Peekaboo (macOS UI Automation)

- **Status:** Installed, requires permissions
- **Binary:** `/opt/homebrew/bin/peekaboo`
- **Permissions needed:** Screen Recording, Accessibility

## Volcengine (Custom Skills)

Custom skills for ByteDance Seedream/Seedance via MixedCloud API.

### volcengine-seedream
- **Purpose:** AI Image generation
- **API:** https://models.mixedcloud.cn/v1/images/generations
- **Env Var:** `MIXEDCLOUD_API_KEY` (optional - uses default from 1Password)
- **Script:** `skills/volcengine-seedream/seedream.py`
- **Models:** doubao-seedream-5-0-260128, doubao-seedream-4-5-251128

### volcengine-seedance
- **Purpose:** AI Video generation
- **API:** https://models.mixedcloud.cn/v1/video/generations
- **Env Var:** `MIXEDCLOUD_API_KEY` (optional - uses default from 1Password)
- **Script:** `skills/volcengine-seedance/seedance.py`
- **Models:** doubao-seedance-1-5-pro-251215, doubao-seedance-1-0-pro-250528

### API Key (1Password)
- **Item:** "MixedCloud API - Seedream/Seedance"
- **Note:** Only for Seedream/Seedance - stored in 1Password

### DeepSeek API
- **API Key:** `[DEEPSEEK_API_KEY_REDACTED]`
- **Endpoint:** `https://api.deepseek.com/v1`
- **Use for:** Testing AI projects with DeepSeek models

## Email Setup

### Gmail (via Maton)
- **API Key:** Get from maton.ai → Settings
- **Env Var:** `MATON_API_KEY`
- **Status:** Not configured

### Himalaya (CLI)
- **Status:** Installed (`himalaya` binary)
- **Config:** `~/.config/himalaya/config.yaml`
- **Supports:** IMAP/SMTP for multiple accounts

- Cloned to: `~/CLI-Anything/`
- HARNESS.md: Reference for CLI building methodology
- Dependencies: click (Python package)

## Examples

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

## Troubleshooting

### Common Issues

**Exec commands hanging:**
- Check if directory has many files (use `find` with `-maxdepth`)
- Try shorter timeouts
- Kill stuck sessions with `process(action=kill, sessionId=...)`

**1Password CLI not working:**
- Run `op signin` to authenticate
- Check `op vault list` to verify access

**Skills not loading:**
- Check skill exists in `~/.nvm/versions/node/v24.14.0/lib/node_modules/openclaw/skills/`
- Verify SKILL.md is present

**Cron not working:**
- Check with `crontab -l`
- Verify script is executable (`chmod +x`)
- Check logs at `logs/organize.log`

## Workspace Structure

```
~/.openclaw/workspace/
├── skills/           # Custom skills
├── scripts/         # Utility scripts
├── tasks/           # Task tracking
├── docs/            # Documentation
├── memory/          # Daily memory files
└── logs/            # Log files
```
