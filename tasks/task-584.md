# Task 584: ai-log-format

**Status:** ✅ Complete
**Type:** AI App (DevOps)
**Priority:** MEDIUM
**Cycle:** 21 (571-600)

---

## App Name
`ai-log-format` — Log Format & Parsing Rules Generator

## Description
A web app that generates log format specifications and parsing rules. Users describe their application and the events they want to log. The AI generates structured log formats (JSON, syslog, custom), field definitions, and parsing rules for Logstash/Grok/Fluentd.

## Tech Stack
- Next.js 15 (App Router, TypeScript, Tailwind CSS)
- AI: DeepSeek API (model=deepseek-chat, baseURL=https://api.deepseek.com/v1)
- Deployment: GitHub only (Vercel limit reached)

## Features
- Input: application type, events to log, desired format, log aggregation tool (ELK, Loki, Splunk)
- AI generates: log format specification, field definitions, Grok patterns, JSON schema, sample log entries
- Multiple output formats (Grok, JSON, Syslog)
- Copy to clipboard / download
- Dark/light theme toggle

## Spec Source
Internal — implement based on app description above.
