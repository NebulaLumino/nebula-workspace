# Task 971: AI Patent Drafting & Prior Art Generator

**Status:** ✅ Complete
**Priority:** HIGH
**Cycle:** 33 (971-1000)
**Theme:** Advanced Professional AI Tools

---

## Concept & Vision
A specialized tool for inventors, patent attorneys, and R&D teams to draft patent applications and search prior art. The app feels like a precision legal instrument — authoritative, thorough, and meticulously structured. Every claim is sharpened, every prior art gap is identified, and the drafting follows USPTO or EPO standards.

## Specific Features
- Patent claims generator (independent + dependent claims in proper hierarchy)
- Prior art search summary (claims novelty + non-obviousness analysis)
- Abstract and specification drafting from invention description
- International patent classification (IPC/CPC) code suggestions
- Claims comparison matrix (your invention vs. cited prior art)
- Response to office action generator (patent examiner rejections)

## Input Fields
- Invention title
- Field of invention (dropdown + free text)
- Detailed technical description (textarea)
- Prior art references (optional, multi-line)
- Target patent office (USPTO / EPO / WIPO / CNIPA / JPO)
- Invention type (method / apparatus / system / composition / software)

## Output
Structured patent application draft with:
- Abstract (150-200 words)
- Field of Invention
- Background of the Invention
- Summary of the Invention
- Detailed Description
- Claims (independent + dependent, numbered)
- Classification codes

## AI Model
DeepSeek via `/api/generate` route, using structured prompts per section.

## Tech Stack
Next.js 16, TypeScript, Tailwind CSS, dark gradient UI (#0a0a0f → #1a1a2e, purple accent #a855f7)
