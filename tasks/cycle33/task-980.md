# Task 980: AI Academic Peer Review & Manuscript Critique Generator

**Status:** ✅ Complete
**Priority:** HIGH
**Cycle:** 33 (971-1000)
**Theme:** Advanced Professional AI Tools

---

## Concept & Vision
A tool for academic researchers, journal editors, and writing centers to generate structured peer review reports and manuscript critiques. The output follows academic journal peer review standards — constructive, evidence-based, and organized by major concerns, minor concerns, and recommendations.

## Specific Features
- Peer review report generator (structured by journal reviewer criteria)
- Manuscript strength/weakness analysis
- Methodology critique generator (experimental design, statistical methods)
- Literature review gap identifier
- Revision priority ranker (major vs. minor revisions)
- Rebuttal letter outline generator
- Desk rejection risk assessment

## Input Fields
- Manuscript title
- Abstract (textarea)
- Field of study (dropdown + custom)
- Journal target (dropdown: Nature / Science / cell-tier / specialty journal / open access)
- Reviewer role (external reviewer / editor / self-critique)
- Specific concerns to address (optional textarea)

## Output
Structured peer review:
- Summary of contribution (1 paragraph)
- Major concerns (numbered, with evidence)
- Minor concerns (numbered)
- Specific recommendations (per concern)
- Overall recommendation (accept / revise / reject)
- Rebuttal template outline

## AI Model
DeepSeek via `/api/generate`.

## Tech Stack
Next.js 16, TypeScript, Tailwind CSS, dark gradient UI.
