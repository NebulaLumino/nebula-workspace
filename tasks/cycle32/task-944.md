# Task 944: AI Financial Due Diligence Report Generator

**Status:** ✅ Complete
**Type:** App Generator
**Priority:** HIGH
**Cycle:** 32 (941-950)
**Created:** 2026-03-28

## Description
Create a web app that generates comprehensive financial due diligence reports for M&A transactions, investments, and acquisitions, covering financial health, valuation analysis, risk assessment, and regulatory compliance.

## Tech Stack
- Next.js 16 (App Router, TypeScript, Tailwind CSS)
- DeepSeek API (deepseek-chat model)
- Dark gradient UI (#0a0a0f → #1a1a2e, purple accent)
- @ai-sdk/deepseek provider

## Features
- Input: Company information, financials, transaction type, deal context
- Output: Full due diligence report with financial analysis, risk matrix, valuation summary, and recommendations
- Transaction type (M&A Acquisition, Merger, Private Equity Buyout, VC Investment, Real Estate, Asset Purchase)
- Company profile (industry, size, revenue range, years in operation)
- Financial data input (revenue, EBITDA, debt, cash position)
- Target market and competitive landscape
- Legal/regulatory considerations
- Risk assessment matrix
- Valuation approach recommendations
- Integration/transaction recommendations
- Copy/download functionality
- Markdown-formatted output display

## API Integration
- Route: `src/app/api/generate/route.ts`
- Method: `generateText` from `ai` SDK
- Model: `deepseek-chat` via `@ai-sdk/deepseek`
- Env: `DEEPSEEK_API_KEY`

## Deliverable
- Fully functional Next.js app pushed to GitHub
- `npm run build` passes
- GitHub public repository created
- Task file updated to ✅ Complete
