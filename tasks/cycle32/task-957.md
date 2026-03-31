# Task 957: ai-pet-care-instructions (Pet Care Instruction Generator)

**Status:** ✅ Complete
**Priority:** MEDIUM
**Cycle:** 32 (951-960)
**Generated:** 2026-03-28
**Completed:** 2026-03-28
**Build:** npm run build passing ✅
**GitHub:** https://github.com/NebulaLumino/ai-pet-care-instructions ✅
**DeepSeek API:** Integrated ✅
**Dark UI:** #0a0a0f to #1a1a2e gradient, purple accent (#a855f7) ✅
**Priority:** MEDIUM
**Cycle:** 32 (951-960)
**Generated:** 2026-03-28

---

## App Overview
**AI Generator:** Pet Care Instruction Generator
**Purpose:** Generate comprehensive pet care instruction sheets for pet sitters, boarding facilities, or vet visits
**GitHub:** https://github.com/NebulaLumino/ai-pet-care-instructions

## Specs
- **Stack:** Next.js 16, TypeScript, Tailwind CSS, dark gradient UI (#0a0a0f→#1a1a2e, purple accent #a855f7)
- **AI API:** DeepSeek via `https://api.deepseek.com/v1` (model: deepseek-chat)
- **Input:** Form with pet and care details (pet name, species, breed, age, health conditions, routine, etc.)
- **Output:** Comprehensive care instruction document in markdown
- **API Route:** `POST /api/generate` with `generateText` from `ai` + `@ai-sdk/deepseek`

## Prompt Template
Generate comprehensive pet care instructions for the following pet:

Pet Information:
- Pet Name: [pet_name]
- Species: [species] (Dog, Cat, Bird, Reptile, Small Animal, etc.)
- Breed: [breed]
- Age: [age]
- Weight: [weight]
- Sex: [sex]
- Color/Markings: [description]
- Microchip ID: [microchip]
- Owner Name: [owner_name]
- Emergency Contact: [emergency_contact]
- Vet Name & Phone: [vet_info]
- Pet Insurance: [insurance]

Care Details:
- Feeding Schedule & Amount: [feeding]
- Food Brand/Type: [food]
- Medications: [medications]
- Medical Conditions: [conditions]
- Behavioral Notes: [behavior]
- Favorite Toys/Activities: [toys]
- Grooming Needs: [grooming]
- Walking/Exercise Routine: [exercise]
- House Rules/Commands Known: [commands]
- Sleep/Rest Spots: [sleep]
- Special Needs: [special]

Requirements:
- Format for clarity and quick reference by a caretaker
- Include emergency procedures section
- Daily routine schedule with times
- Clear "DO" and "DO NOT" sections
- Feeding instructions with portions
- Medication administration guide if applicable
- Veterinary contact prominently displayed
- 500-800 words
- Format as clean markdown with clear sections

## Status History
- 2026-03-28: Task created
