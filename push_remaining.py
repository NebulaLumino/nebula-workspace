#!/usr/bin/env python3
"""Push remaining apps to GitHub"""
import subprocess, os

WORKDIR = "/Users/nebulalumino/.openclaw/workspace"
APPS = [
    "ai-implicit-bias", "ai-mbti-deep-dive", "ai-enneagram",
    "ai-johari-window", "ai-big-five", "ai-attachment-style",
    "ai-emotional-intelligence", "ai-growth-mindset", "ai-journal-prompter",
    "ai-anger-tracker", "ai-grief-companion", "ai-loneliness-connector",
    "ai-adhd-toolkit", "ai-meditation-breathing"
]

for app in APPS:
    app_dir = os.path.join(WORKDIR, app)
    print(f"=== {app} ===")
    r = subprocess.run(
        ["gh", "repo", "create", f"NebulaLumino/{app}", "--private", "--source=.", "--push"],
        cwd=app_dir, capture_output=True, text=True
    )
    out = r.stdout + r.stderr
    # Show last 3 non-dash lines
    lines = [l for l in out.split('\n') if l and not l.startswith('--')]
    print('\n'.join(lines[-3:]))
    print(f"DONE {app}")
    print()
