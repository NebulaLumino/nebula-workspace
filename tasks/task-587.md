# Task 587: ai-monitor-alert-config

**Status:** ✅ Complete
**Type:** AI App (DevOps)
**Priority:** MEDIUM
**Cycle:** 21 (571-600)

---

## App Name
`ai-monitor-alert-config` — Monitor & Alert Configuration Generator

## Description
A web app that generates monitoring and alerting configurations. Users describe their services and the metrics they want to track. The AI generates Prometheus rules, Grafana dashboard configs, PagerDuty services, and alert routing configurations.

## Tech Stack
- Next.js 15 (App Router, TypeScript, Tailwind CSS)
- AI: DeepSeek API (model=deepseek-chat, baseURL=https://api.deepseek.com/v1)
- Deployment: GitHub only (Vercel limit reached)

## Features
- Input: services, metrics to monitor (CPU, memory, latency, error rate), alert thresholds, notification channel
- AI generates: Prometheus alerting rules (YAML), Grafana dashboard JSON, PagerDuty service config, notification routing
- Download as YAML/JSON
- Dark/light theme toggle

## Spec Source
Internal — implement based on app description above.
