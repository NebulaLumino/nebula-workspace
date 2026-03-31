# Task 581: ai-security-report

**Status:** ✅ Complete
**Type:** AI App (DevOps)
**Priority:** MEDIUM
**Cycle:** 21 (571-600)

---

## App Name
`ai-security-report` — Security Vulnerability Report Generator

## Description
A web app that generates structured security vulnerability reports from scan results or manual findings. Users input vulnerability data, severity levels, and affected components. The AI generates executive summaries, risk assessments, remediation timelines, and CVSS scores.

## Tech Stack
- Next.js 15 (App Router, TypeScript, Tailwind CSS)
- AI: DeepSeek API (model=deepseek-chat, baseURL=https://api.deepseek.com/v1)
- Deployment: GitHub only (Vercel limit reached)

## Features
- Input: vulnerability name, severity (Critical/High/Medium/Low), affected service, description, CVSS vector (optional)
- AI generates: executive summary, risk rating, CVSS score, remediation steps, timeline, affected asset list
- Severity color coding and priority ordering
- Download as Markdown or JSON
- Dark/light theme toggle

## Spec Source
Internal — implement based on app description above.
