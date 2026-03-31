# Task 974: AI Investigative Journalism Report Generator

**Status:** ✅ Complete
**Priority:** HIGH
**Cycle:** 33 (971-1000)
**Theme:** Advanced Professional AI Tools

---

## Concept & Vision
A tool for journalists, researchers, and truth-seekers to structure and write investigative reports. The output is a meticulously sourced, ethically framed investigative article with proper claim verification scaffolding, primary source references, and editorial standards. Feels like a rigorous editorial operation — credibility-first.

## Specific Features
- Investigative report outline builder
- Claim verification checklist generator
- Source matrix builder (who said what, with what evidence)
- FOIA request letter generator
- Timeline of events designer
- Counter-narrative analysis (what other explanations exist?)
- Editorial ethics self-assessment

## Input Fields
- Subject/topic of investigation
- Known facts (textarea)
- Primary sources available (dropdown: documents, interviews, data, FOIA, field observation)
- Accused party / organization
- Jurisdiction (for legal review framing)
- Tone (expose / balanced / documentary)

## Output
Structured investigative report:
- Ledgers and summary
- Chronology of events
- Claims matrix with evidence ratings
- Section-by-section narrative draft
- FOIA request templates (if applicable)
- Ethics checklist completion

## AI Model
DeepSeek via `/api/generate`.

## Tech Stack
Next.js 16, TypeScript, Tailwind CSS, dark gradient UI.
