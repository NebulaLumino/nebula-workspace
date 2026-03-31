# Email Automation Templates

## Daily Summary Template

```python
def daily_summary_email(recipient: str, tasks: list, events: list) -> dict:
    """Generate daily summary email content."""
    subject = f"Daily Summary - {datetime.now().strftime('%Y-%m-%d')}"
    
    body = f"""Good morning!

Here's your agenda for today:

## Upcoming Events
{chr(10).join(f"- {e['time']}: {e['title']}" for e in events) or "No events scheduled"}

## Tasks
{chr(10).join(f"- [{'x' if t.get('done') else ' '}] {t['title']}" for t in tasks) or "No tasks"}

---
Automated by OpenClaw
"""
    return {"to": recipient, "subject": subject, "body": body}
```

## Weekly Report Template

```python
def weekly_report_email(recipient: str, week_data: dict) -> dict:
    """Generate weekly report email."""
    subject = f"Weekly Report - Week {datetime.now().isocalendar()[1]}"
    
    body = f"""Hi!

Here's your weekly summary:

## Completed Tasks: {week_data.get('completed', 0)}
## Time Spent: {week_data.get('hours', 0)} hours
## Projects Worked On: {', '.join(week_data.get('projects', []))}

### Highlights
{week_data.get('highlights', 'No highlights')}

---
Have a great week!
"""
    return {"to": recipient, "subject": subject, "body": body}
```

## Reminder Template

```python
def reminder_email(recipient: str, title: str, details: str, due: str) -> dict:
    """Generate reminder email."""
    subject = f"Reminder: {title}"
    
    body = f"""Hey!

Just a quick reminder:

**{title}**
{details}

Due: {due}

---
Don't forget!
"""
    return {"to": recipient, "subject": subject, "body": body}
```

## Usage with Gmail Skill

```python
import urllib.request
import json

def send_email(to: str, subject: str, body: str):
    """Send email via Gmail API."""
    url = "https://gateway.maton.ai/google-mail/gmail/v1/users/me/messages/send"
    
    message = {
        "raw": base64.urlsafe_b64encode(
            f"To: {to}\nSubject: {subject}\n\n{body}".encode()
        ).decode()
    }
    
    req = urllib.request.Request(url, data=json.dumps(message).encode())
    req.add_header("Authorization", f"Bearer {os.environ['MATON_API_KEY']}")
    req.add_header("Content-Type", "application/json")
    
    return json.load(urllib.request.urlopen(req))
```

## Cron Scheduling Examples

```bash
# Daily summary at 8 AM
openclaw cron add --every 1d --at "08:00" --message "Send daily summary email"

# Weekly report every Monday at 9 AM
openclaw cron add --cron "0 9 * * 1" --message "Send weekly report"
```
