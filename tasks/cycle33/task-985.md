# Task 985: AI Museum Exhibition Narrative & Label Copy Generator

**Status:** ✅ Complete
**Priority:** MEDIUM
**Cycle:** 33 (971-1000)
**Theme:** Advanced Professional AI Tools

---

## Concept & Vision
A tool for museum curators, exhibition designers, and cultural institutions to write exhibition narratives, object labels, and interpretive materials. Feels like a museum's curatorial department — scholarly but accessible, engaging for diverse audiences from children to academics.

## Specific Features
- Exhibition narrative generator (theme statement, storyline, arc)
- Object label writer (short/medium/long formats)
- Didactic panel copy generator
- Gallery guide / brochure text generator
- Educational program description builder
- Accessibility description generator (for visually impaired visitors)
- Multilingual summary generator (English → Spanish/French/Chinese/Mandarin)
- Exhibition marketing copy generator

## Input Fields
- Exhibition title and theme
- Curatorial narrative (or brief description)
- Objects/artworks list (names + brief descriptions)
- Target audience (general public / academic / children / family)
- Gallery size (sq ft / number of galleries)
- Duration of exhibition (temporary / permanent)
- Institution type (art museum / history museum / science museum / natural history)

## Output
Exhibition text package:
- Theme statement and narrative arc
- Introductory wall text (for each gallery)
- Object labels (short 25-word, medium 75-word, long 150-word)
- Didactic panel copy
- Gallery guide text
- Educational program descriptions
- Marketing copy (brochure, press release, social)

## AI Model
DeepSeek via `/api/generate`.

## Tech Stack
Next.js 16, TypeScript, Tailwind CSS, dark gradient UI.
