# Task 958: ai-fitness-program (Fitness Program Plan Generator)

**Status:** ✅ Complete
**Priority:** MEDIUM
**Cycle:** 32 (951-960)
**Generated:** 2026-03-28
**Completed:** 2026-03-28
**Build:** npm run build passing ✅
**GitHub:** https://github.com/NebulaLumino/ai-fitness-program ✅
**DeepSeek API:** Integrated ✅
**Dark UI:** #0a0a0f to #1a1a2e gradient, purple accent (#a855f7) ✅
**Priority:** MEDIUM
**Cycle:** 32 (951-960)
**Generated:** 2026-03-28

---

## App Overview
**AI Generator:** Fitness Program Plan Generator
**Purpose:** Generate personalized fitness/training programs from user profile and goals
**GitHub:** https://github.com/NebulaLumino/ai-fitness-program

## Specs
- **Stack:** Next.js 16, TypeScript, Tailwind CSS, dark gradient UI (#0a0a0f→#1a1a2e, purple accent #a855f7)
- **AI API:** DeepSeek via `https://api.deepseek.com/v1` (model: deepseek-chat)
- **Input:** Form with fitness profile (goals, experience, equipment, schedule, limitations)
- **Output:** Comprehensive fitness program in markdown
- **API Route:** `POST /api/generate` with `generateText` from `ai` + `@ai-sdk/deepseek`

## Prompt Template
Generate a personalized fitness program for the following individual:

Client Profile:
- Name: [name]
- Age: [age]
- Current Fitness Level: [level] (Beginner, Intermediate, Advanced)
- Primary Goal: [goal] (e.g., Weight Loss, Muscle Gain, Endurance, Flexibility, General Health)
- Secondary Goal: [secondary_goal]
- Training Days Per Week: [days]
- Session Duration: [duration]
- Available Equipment: [equipment]
- Training Location: [location] (Home, Gym, Both)
- Physical Limitations/Injuries: [limitations]
- Medical Considerations: [medical]
- Current Weight/Body Fat % (optional): [stats]
- Target Weight/Goal: [target]
- Experience with Exercise: [experience]
- Preferred Training Style: [style] (e.g., Bodyweight, Powerlifting, HIIT, Yoga, CrossFit)

Requirements:
- Include: Program overview, warm-up protocol, weekly workout schedule with specific exercises, sets/reps/rest periods, progressive overload guidance, cool-down/stretching protocol, cardio recommendation, nutrition guidelines overview, rest/recovery recommendations
- Exercises should be specific with form cues
- Include alternative exercises for each movement pattern
- Progressions for weeks 4, 8, and 12
- 800-1200 words
- Format as clean markdown with tables for schedules

## Status History
- 2026-03-28: Task created
