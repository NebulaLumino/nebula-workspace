# Task 590: AI Chaos Engineering Plan Generator

**Status:** ✅ Complete
**Type:** App Generator — SRE/DevOps
**Priority:** MEDIUM
**Cycle:** 21 (571-600)

---

## App Concept

Generate chaos engineering experiment plans for resilience testing. Input: system architecture, critical user journeys, current resilience measures, known failure modes, blast radius tolerance, stakeholder approval status. Output: structured chaos experiment plan with hypothesis, experimental design, failure injection steps (kill instance, add latency, partition network, exhaust resources), success criteria, monitoring assertions, rollback procedure, and stakeholder communication template.

## Tech Stack

- Next.js 16 (App Router)
- Tailwind CSS
- DeepSeek API (OpenAI-compatible)
- TypeScript

## Output

- GitHub repo: `ai-chaos-engineering-plan`
- Deployed URL: `ai-chaos-engineering-plan-{suffix}.vercel.app`
