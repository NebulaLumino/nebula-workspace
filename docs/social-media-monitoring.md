# Social Media Monitoring

## Setup

### X (Twitter) via xurl

1. **Authenticate:**
   ```bash
   xurl auth apps add default
   # Follow prompts to add your X API credentials
   ```

2. **Test authentication:**
   ```bash
   xurl whoami
   ```

## Monitoring Commands

### Search for mentions/keywords
```bash
# Search recent posts
xurl search "your-keyword" -n 20

# Search with filters
xurl search "your-brand" -n 50 --since 2026-01-01
```

### Check your mentions
```bash
xurl mentions
```

### Monitor specific users
```bash
# Get user's recent posts
xurl read <user-id>
```

## Heartbeat Integration

To add to heartbeat checks, create a script:

```bash
#!/bin/bash
# ~/.openclaw/workspace/scripts/check-mentions.sh

KEYWORDS="${1:-your-keyword}"
MENTIONS=$(xurl search "$KEYWORDS" -n 10 2>/dev/null)

if [ -n "$MENTIONS" ]; then
  echo "New mentions found for: $KEYWORDS"
  echo "$MENTIONS"
else
  echo "No new mentions"
fi
```

## Automation Examples

### Via Cron
```bash
# Check mentions every hour
openclaw cron add --every 1h --message "Check social media mentions"
```

### Via Webhook
Set up X API webhooks for real-time notifications (requires elevated API access).

## Alternative: Discord/Slack Notifications

```python
def notify_mention(post_data: dict):
    """Send mention notification to Discord."""
    webhook_url = os.environ.get("DISCORD_WEBHOOK")
    if not webhook_url:
        return
    
    message = {
        "content": f"🔔 New mention from @{post_data['username']}: {post_data['text']}"
    }
    
    requests.post(webhook_url, json=message)
```

## Notes

- xurl requires X API credentials (Bearer Token / OAuth)
- Free tier has limited API access
- Consider rate limits when monitoring
