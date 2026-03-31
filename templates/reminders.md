# Reminder Templates

## Usage
```bash
# Add a reminder
remindctl add "Task name" --list "Work" --due "2026-03-20"

# List reminders
remindctl list --list "Work"
```

## Common Reminder Lists
- Work
- Personal
- Projects
- Follow-up

## Useful Commands
```bash
# Today's reminders
remindctl list --today

# Upcoming (next 7 days)
remindctl list --upcoming

# Overdue
remindctl list --overdue
```

## Template Examples

### Daily Standup
```bash
remindctl add "Daily standup notes" --list "Work" --due "09:00" --repeat "daily"
```

### Weekly Review
```bash
remindctl add "Weekly review" --list "Personal" --due "Friday 17:00" --repeat "weekly"
```

### Project Follow-up
```bash
remindctl add "Follow up on project X" --list "Projects" --due "2026-03-25"
```
