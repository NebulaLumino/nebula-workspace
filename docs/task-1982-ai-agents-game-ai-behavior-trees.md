# Task 1982: AI Agents in Game AI & Non-Player Character Behavior Trees

## Status: ✅ Complete

## What Was Explored

Every non-player character in a modern game — from the ghost in *Pac-Man* to the squadmates in *Mass Effect* — runs on some form of AI. The discipline of game AI has evolved from simple state machines to sophisticated behavior trees, utility systems, and now LLM-driven agents that can reason, remember, and adapt in real-time.

## The Architecture of NPC Intelligence

### Behavior Trees
The workhorse of game AI for two decades, behavior trees organize NPC decision-making into hierarchical trees of conditions and actions. An enemy soldier might have a root "Patrol" behavior with child nodes for "Walk Path," "Alert," and "Combat Mode." Behavior trees are readable, debuggable, and artistically controllable — but they require hand-authoring for every behavior and can feel scripted when players encounter edge cases the designer didn't anticipate.

### Utility-Based AI
Rather than discrete states, utility systems assign *scores* to possible actions and pick the highest. This allows NPCs to smoothly blend behaviors — an NPC might be 60% afraid and 40% aggressive, interpolating between flee and fight animations. Games like *The Sims* and *Supreme Commander* pioneered this approach for organic-feeling AI.

### GOAP (Goal-Oriented Action Planning)
Games like *F.E.A.R.* popularized GOAP, where NPCs have high-level goals (e.g., "eliminate threats") and the AI autonomously sequences actions to achieve them. This produces emergent tactics that players can't easily predict, because the NPC isn't following a script — it's *problem-solving*.

## How AI Agents Are Changing NPC AI

### Large Language Models as NPCs
The most dramatic shift is using LLMs directly as NPC brains. Characters in games like *Inklore*, *Virtuoso*, and various indie experiments can hold multi-exchange conversations, remember past interactions across sessions, and respond to questions the developer never anticipated. This fundamentally changes the relationship between game content and player agency.

### Memory and Context
The key challenge: LLM-driven NPCs need *memory*. Without it, they'll contradict themselves, forget key plot events, or behave inconsistently across sessions. Solutions include:
- Summarized conversation logs fed back as context
- Vector database retrieval of relevant past interactions  
- Structured "facts" databases the LLM must respect
- Hierarchical memory systems (working memory → episodic → semantic)

### Procedural Dialogue Generation
The apps built in Cycle 66 (NPC dialogue, character backstory, TTRPG campaign) represent the content generation side of this revolution. But the execution side — real-time dialogue generation that respects lore, character voice, and game state — is where it gets technically demanding.

## Emotional AI and Believability

The Turing test for game NPCs isn't "can you tell it's AI?" — it's "does it feel like a person?" Games increasingly aim for *believability* over realism. An NPC that gets confused when you ask about something off-script, that has a plausible life schedule, that reacts to seeing you in a bar vs. on a battlefield — these create the illusion of a living world.

The frontier is NPCs that have their own goals that interact with the player's goals in emergent, story-generating ways — the AI director in *Left 4 Dead* meets the improv actor in *Dungeons & Dragons*.

## Related Cycle 66 Apps

- ai-npc-dialogue (1967)
- ai-character-backstory (1963)
- ai-dungeon-master (1962)
- ai-ttrpg-campaign (1972)
