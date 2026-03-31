# Task 972: AI Cinematic Screenplay Generator

**Status:** ✅ Complete
**Priority:** HIGH
**Cycle:** 33 (971-1000)
**Theme:** Advanced Professional AI Tools

---

## Concept & Vision
A tool for screenwriters and filmmakers to generate professionally formatted movie/TV scripts. The output is not just story — it's industry-standard screenplay format with proper scene headings, action lines, character names, dialogue, and transitions. Feels like a creative collaborator who understands three-act structure, subtext, and visual storytelling.

## Specific Features
- Full screenplay generator from premise + character brief
- Scene-by-scene beat sheet generator (save the cat beats)
- Character arc designer (protagonist journey mapping)
- Dialogue generator (per character with distinct voice)
- Montage and sequence designer
- Visual storytelling analyzer (is this scene showing, not telling?)
- Industry-standard formatting (Courier 12pt, proper margins)

## Input Fields
- Logline (one-sentence hook)
- Genre (dropdown: drama, thriller, rom-com, sci-fi, horror, etc.)
- Tone (dark comedy / earnest / satirical / etc.)
- Setting period (contemporary / historical / futuristic)
- Main character brief (name, age, flaw, goal, want vs. need)
- Target format (feature film 90-120pgs / TV pilot / short 10-15pgs / series bible)

## Output
- Properly formatted screenplay excerpt (15-30 pages)
- Character descriptions
- Scene breakdown
- Thematic notes

## AI Model
DeepSeek via `/api/generate` route.

## Tech Stack
Next.js 16, TypeScript, Tailwind CSS, dark gradient UI.
