# Task 573: ai-dependency-graph

**Status:** ✅ Complete
**Type:** AI App (DevOps)
**Priority:** MEDIUM
**Cycle:** 21 (571-600)

---

## App Name
`ai-dependency-graph` — Dependency Graph Visualizer

## Description
A web app that visualizes service/component dependency graphs. Users input services and their dependencies (text-based), and the app renders an interactive directed graph. Users can also paste a package.json or requirements.txt and the AI parses and visualizes the dependency tree.

## Tech Stack
- Next.js 15 (App Router, TypeScript, Tailwind CSS)
- AI: DeepSeek API (model=deepseek-chat, baseURL=https://api.deepseek.com/v1)
- Graph visualization: ReactFlow
- Deployment: GitHub only (Vercel limit reached)

## Features
- Text input for services and dependencies (e.g., "api-gateway depends on auth-service, user-service")
- Paste package.json / requirements.txt → AI parses and generates graph
- Interactive directed graph with zoom/pan
- Color-coded nodes by service type (API, database, cache, queue)
- Dark/light theme toggle

## Spec Source
Internal — implement based on app description above.
