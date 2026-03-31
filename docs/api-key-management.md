# API Key Management

## Current Keys Inventory

| Service | Key Name (1Password) | Environment Variable | Status | Last Rotated |
|---------|---------------------|---------------------|--------|---------------|
| MixedCloud (Seedream/Seedance) | MixedCloud API - Seedream/Seedance | `MIXEDCLOUD_API_KEY` | Active | 2026-03-15 |
| Maton (Gmail) | Maton AI | `MATON_API_KEY` | Active | Unknown |
| Google Web Search | (in config) | (in config) | Active | N/A |

## Key Rotation Schedule

### Recommended Rotation Intervals
- **API Keys (MixeCloud, Maton)**: Every 90 days
- **OAuth Tokens**: Refresh as needed
- **SSH Keys**: Every 12 months

### 1Password Notes Field
Store in 1Password:
- Creation date
- Expiry date
- Last rotated date
- Notes about where it's used

## Rotation Process

### 1. Generate New Key
```bash
# For MixedCloud - get from dashboard or regenerate
op item get "MixedCloud API - Seedream/Seedance" --reveal
```

### 2. Update Environment
```bash
# Update in shell profile
export MIXEDCLOUD_API_KEY="new-key-here"

# Or update in OpenClaw config
openclaw config set --json '{"tools":{"web":{"search":{"gemini":{"apiKey":"new-key"}}}}}' 
```

### 3. Test Key
```bash
# Test the new key works
python ~/.openclaw/workspace/skills/volcengine-seedream/seedream.py "test" --count 1
```

### 4. Archive Old Key
- Move old key note to "Archive" vault in 1Password
- Keep for 30 days in case of rollback needs

## Monitoring & Reminders

### Cron Reminder (weekly check)
```bash
# Weekly key check reminder
openclaw cron add --every 7d --message "Check API key expiry dates"
```

### 1Password Features
- Use 1Password password keeper to track expiry
- Enable "Item expires" notifications
- Create shared vault for team access

## Script: Key Health Check

```python
#!/usr/bin/env python3
"""Check API key health and expiry."""

import os
import subprocess

def check_key(name, env_var, test_cmd=None):
    """Check if a key is set and optionally test it."""
    key = os.environ.get(env_var)
    if key:
        print(f"✅ {name}: Set ({len(key)} chars)")
        if test_cmd:
            result = subprocess.run(test_cmd, shell=True, capture_output=True)
            print(f"   Test: {'✅ Passed' if result.returncode == 0 else '❌ Failed'}")
    else:
        print(f"❌ {name}: Not set")

if __name__ == "__main__":
    print("🔑 API Key Health Check")
    print("-" * 40)
    check_key("MIXEDCLOUD_API_KEY", "MIXEDCLOUD_API_KEY")
    check_key("MATON_API_KEY", "MATON_API_KEY")
    check_key("OpenAI (web search)", "OPENAI_API_KEY")
```

## Emergency Rollback

If a new key causes issues:
1. Restore old key from 1Password archive
2. Update environment variable
3. Restart gateway: `openclaw gateway restart`
4. Document the issue
