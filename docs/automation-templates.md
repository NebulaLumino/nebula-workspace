# Automation Workflow Templates

A collection of reusable automation workflows for common tasks.

---

## 1. Daily Summary Workflow

**Purpose:** Aggregate daily tasks, calendar, and notes into a summary.

**Trigger:** Cron (daily at 8 AM) or manual

**Tools:** Gmail, Calendar (gog), Tasks (Things)

**Flow:**
```
1. Fetch today's calendar events
2. Fetch inbox tasks from Things
3. Check for any due items
4. Compile into summary
5. Send via email or display in chat
```

**Example Output:**
```
📅 Today’s Agenda
- 10:00 AM Team Standup
- 2:00 PM Client Call

✅ Tasks (3)
- [ ] Review PR #42
- [ ] Update documentation  
- [ ] Send weekly report

💡 Tip: You have 2 hours of meetings today.
```

---

## 2. Content Generation Workflow

**Purpose:** Generate content (images, video, text) from a brief.

**Trigger:** Manual or cron

**Tools:** Seedream (image), Seedance (video), LLM (text)

**Flow:**
```
1. Receive content brief (topic, style, format)
2. Generate text copy with LLM
3. Generate image assets with Seedream
4. Compile into final format
5. Save to appropriate folder
6. Notify user of completion
```

**Example:**
```
Input: "Create a promotional post for our new feature"
Output: [Generated image] + [Caption text] → saved to ~/Generated/content/
```

---

## 3. Research Workflow

**Purpose:** Automated research on a topic with web search and summarization.

**Trigger:** Manual

**Tools:** Web search, Summarize, Memory

**Flow:**
```
1. Receive research topic
2. Search web for top sources
3. Fetch and summarize key pages
4. Extract key findings
5. Save to memory/docs
6. Present summary to user
```

**Output Format:**
```
# Research: [Topic]
Date: 2026-03-16

## Key Findings
1. [Finding 1]
2. [Finding 2]
3. [Finding 3]

## Sources
- [Source 1]
- [Source 2]

## Next Steps
- [Suggested action]
```

---

## 4. Backup Workflow

**Purpose:** Regular workspace backup with notification.

**Trigger:** Cron (daily/weekly)

**Tools:** Backup script, Gmail/Discord

**Flow:**
```
1. Run backup script
2. Verify backup integrity
3. Count files backed up
4. Send notification with summary
5. Clean old local backups if needed
```

**Notification:**
```
✅ Backup Complete
- Files: 247
- Size: 1.2 GB
- Location: ~/Backups/openclaw-workspace/
- Duration: 45s
```

---

## How to Use

### Via Cron (OpenClaw)
```bash
# Daily summary at 8 AM
openclaw cron add --every 1d --at "08:00" --message "Run daily summary workflow"

# Weekly backup on Sunday at 3 AM
openclaw cron add --cron "0 3 * * 0" --message "Run backup workflow"
```

### Via Skill
Simply describe what you want to automate:
- "Create a workflow to summarize my emails every morning"
- "Set up automated backups of my workspace"
- "Build a content generation pipeline"

---

## Tool Integration Matrix

| Workflow | Gmail | Calendar | Things | Seedream | Seedance | LLM | Web Search |
|----------|-------|----------|--------|----------|----------|-----|------------|
| Daily Summary | ✅ | ✅ | ✅ | - | - | ✅ | - |
| Content Gen | - | - | - | ✅ | ✅ | ✅ | - |
| Research | - | - | - | - | - | ✅ | ✅ |
| Backup | ✅ | - | - | - | - | - | - |

---

## Adding New Templates

1. Create a new section in this file
2. Document: purpose, trigger, tools, flow, example
3. Add to tool integration matrix
4. Test manually before scheduling
