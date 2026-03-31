# Task 973: AI Music Composition & Arrangement Generator

**Status:** ✅ Complete
**Priority:** HIGH
**Cycle:** 33 (971-1000)
**Theme:** Advanced Professional AI Tools

---

## Concept & Vision
A tool for composers, music producers, and content creators to generate music compositions and arrangements described in text. The output is a detailed musical score description including instrumentation, chord progressions, melodic structure, dynamics, and arrangement notes — essentially a complete blueprint a musician or AI music generator can execute.

## Specific Features
- Genre-specific composition generator ( orchestral, jazz, electronic, folk, etc.)
- Chord progression designer with Roman numeral analysis
- Melody and motif generator with intervallic description
- Arrangement planner (which instruments play what, when)
- Tempo and dynamics map
- Song structure designer (intro/verse/chorus/bridge/outro)
- Lyrics generator (optional, if applicable to genre)

## Input Fields
- Musical description / prompt (textarea)
- Genre / style (dropdown: classical, film score, jazz, pop, EDM, hip-hop, folk, world, etc.)
- Mood keywords (multi-select + custom)
- Key and mode (dropdown + "surprise me")
- Tempo range (BPM slider or dropdown)
- Instrumentation (checkboxes + custom)
- Duration target (30s / 60s / 90s / 3min / 5min)

## Output
Detailed composition blueprint:
- Key, mode, tempo
- Chord progression (with Roman numerals)
- Melodic description (contour, range, notable phrases)
- Full arrangement notes (instrument × time)
- Dynamics map
- Lyrics (if applicable)

## AI Model
DeepSeek via `/api/generate`.

## Tech Stack
Next.js 16, TypeScript, Tailwind CSS, dark gradient UI.
