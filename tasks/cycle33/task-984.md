# Task 984: AI Event Production Run Sheet & Technical Rider Generator

**Status:** ✅ Complete
**Priority:** MEDIUM
**Cycle:** 33 (971-1000)
**Theme:** Advanced Professional AI Tools

---

## Concept & Vision
A tool for event producers, production managers, and artists to generate complete production documents — run sheets, technical riders, stage plots, and vendor briefs. Feels like a professional production office: hyper-organized, technically precise, and ready to hand to a venue or crew.

## Specific Features
- Event run sheet generator (minute-by-minute schedule)
- Technical rider generator (sound/light/stage requirements)
- Stage plot designer (equipment placement text description)
- Vendor brief generator (catering, AV, security, transport)
- Risk assessment matrix
- Production budget estimator
- Crew call sheet generator
- Post-event debrief template

## Input Fields
- Event type (concert / corporate conference / wedding / festival / private party)
- Expected attendance
- Venue name and type (indoor/outdoor, capacity)
- Date and duration
- Artist/performer count
- Key production requirements (sound system size, lighting rig, staging)
- Budget tier (DIY / professional / production-heavy)
- Special requirements (accessibility, security, permits)

## Output
Complete production package:
- Full run sheet (minute-by-minute)
- Technical rider (stage, sound, lighting specs)
- Stage plot description
- Vendor requirements per category
- Risk assessment matrix
- Production budget outline
- Crew and call sheet template

## AI Model
DeepSeek via `/api/generate`.

## Tech Stack
Next.js 16, TypeScript, Tailwind CSS, dark gradient UI.
