# Task 576: ai-uptime-report

**Status:** ✅ Complete
**Type:** AI App (DevOps)
**Priority:** MEDIUM
**Cycle:** 21 (571-600)

---

## App Name
`ai-uptime-report` — Uptime & Availability Report Generator

## Description
A web app that generates uptime and availability reports. Users input downtime incidents, SLA targets, and service metrics. The AI calculates uptime percentages, generates trend charts (text-based), and produces executive-ready availability reports.

## Tech Stack
- Next.js 15 (App Router, TypeScript, Tailwind CSS)
- AI: DeepSeek API (model=deepseek-chat, baseURL=https://api.deepseek.com/v1)
- Deployment: GitHub only (Vercel limit reached)

## Features
- Input: service name, reporting period, SLA target (e.g., 99.9%), downtime incidents (date, duration, cause)
- AI calculates: uptime %, SLA compliance, MTTR, trend analysis
- Generates formatted availability report with metrics summary
- Download as Markdown or JSON
- Dark/light theme toggle

## Spec Source
Internal — implement based on app description above.
