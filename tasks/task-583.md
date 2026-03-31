# Task 583: ai-backup-strategy

**Status:** ✅ Complete
**Type:** AI App (DevOps)
**Priority:** MEDIUM
**Cycle:** 21 (571-600)

---

## App Name
`ai-backup-strategy` — Backup & Recovery Strategy Generator

## Description
A web app that generates comprehensive backup and disaster recovery strategies. Users describe their infrastructure, data criticality, and RTO/RPO requirements. The AI generates backup schedules, retention policies, recovery procedures, and DR runbook content.

## Tech Stack
- Next.js 15 (App Router, TypeScript, Tailwind CSS)
- AI: DeepSeek API (model=deepseek-chat, baseURL=https://api.deepseek.com/v1)
- Deployment: GitHub only (Vercel limit reached)

## Features
- Input: services/components, data volumes, criticality levels, RTO/RPO targets, current backup tools
- AI generates: backup schedule (full/incremental/differential), retention policy, recovery procedures, DR runbook, failover steps
- Download as Markdown or JSON
- Dark/light theme toggle

## Spec Source
Internal — implement based on app description above.
