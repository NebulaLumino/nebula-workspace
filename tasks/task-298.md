# Task 298: Explore AI UX Patterns for Agent Interfaces

**Status:** ✅ Complete — 2026-03-20
**Type:** Curiosity Research
**Priority:** LOW

---

## Research Findings: AI UX Patterns for Agent Interfaces

### Why AI UX Is Different

Designing UX for AI agents is fundamentally different from traditional software:
- **Uncertainty** — AI outputs are probabilistic, not deterministic
- **Autonomy** — agents can act without user input
- **Temporal** — agents work over time, not in single interactions
- **Multi-modality** — agents see, hear, read, write, click
- **Failure modes** — AI fails differently than software (hallucination vs bugs)

---

## 1. Core UX Principles for AI Agents

### Principle 1: Appropriate Trust
- Don't over-trust (users assume AI is always right)
- Don't under-trust (users ignore helpful AI)
- Show confidence levels, make uncertainty visible
- Calibrate trust through demonstrated accuracy

### Principle 2: Human in Control (Appropriately)
- For low-stakes tasks: autonomous execution is fine
- For high-stakes tasks: require human approval gates
- Make it easy to override, correct, and undo AI actions
- Clearly signal when AI is acting vs recommending

### Principle 3: Transparency Without Overwhelm
- Show reasoning (chain-of-thought) when helpful
- Don't show all reasoning (too much noise)
- Make AI's knowledge and limitations visible
- Explain what the AI can and cannot do

### Principle 4: Graceful Degradation
- When AI fails, make recovery easy
- Preserve user context across AI errors
- Don't lose user work when AI messes up
- Make "start over" always available

### Principle 5: Proactive Communication
- Agents working in background should notify users
- Tell users what the agent is doing, not just results
- Set expectations for time (agents take time)
- Announce errors before user notices

---

## 2. Key UI Patterns for AI Agents

### Pattern 1: The Chat Interface (Conversational AI)
**Used for:** Customer service, Q&A, simple task completion
**Examples:** ChatGPT, Claude, Intercom Fin
**Best for:** One-off tasks, Q&A, troubleshooting
**Failure mode:** Linear conversation, loses context in long sessions

### Pattern 2: Agent Dashboard / Control Panel
**Used for:** Managing AI agents, seeing what they're doing
**Examples:** Cursor workspace, OpenAI's agent playground
**Best for:** Developers, power users managing agents
**Failure mode:** Too much complexity for casual users

### Pattern 3: Timeline / Activity Feed
**Used for:** Agents working over time
**Examples:** Email scheduling agents, social media agents
**Shows:** What the agent did, when, results
**Best for:** Ongoing autonomous tasks
**Failure mode:** Information overload

### Pattern 4: Collaborative Canvas
**Used for:** Human + AI working together on a document/code/design
**Examples:** Notion AI, Figma AI, Google Docs AI
**Best for:** Creative and knowledge work
**Failure mode:** Confusing who did what

### Pattern 5: Approval Queue
**Used for:** Agents with limited autonomy
**Examples:** AI content approval, AI email drafts waiting for send
**Best for:** Business workflows where humans need final sign-off
**Failure mode:** Bottlenecks if approval is slow

### Pattern 6: Notification-Led Autonomy
**Used for:** Background agents doing monitoring tasks
**Examples:** Stock monitoring, news alerts, calendar agents
**Shows:** Agent notifies when action needed
**Best for:** Passive monitoring tasks
**Failure mode:** Notification fatigue

---

## 3. Prompt UX / Interface Design

### Conversational Prompt Design
- Show suggested prompts (reduces blank-page problem)
- Use examples to guide user on what to ask
- Let users iterate on AI responses
- Preserve conversation history for context

### Form-Based Agent Configuration
- Instead of prompts: structured inputs for agent goals
- Used when precision matters more than flexibility
- Example: project management agent with fields for deadline, team, goals
- Reduces ambiguity vs free-text prompts

### Voice-First AI Agents
- No visual interface (screenless interaction)
- Examples: Siri, Alexa, Rabbit R1, AI wearables
- New UX challenges: no scrolling, no menus, single-turn clarity needed

---

## 4. Managing Agent State & Progress

### Progress Indicators for Long Tasks
- Agents working on multi-step tasks need progress tracking
- Show: current step, total steps, ETA, what came before
- Examples: "Researching X (step 2 of 5) — estimated 30 seconds"

### State Persistence
- Agents that work over days/weeks need persistent memory
- Show users: what does the agent remember, what has it done
- Make memory editable (users can correct agent's knowledge)
- Clear indicator: "Agent knows this about you: ..."

### Error Recovery UX
- When agent fails mid-task, show: what it tried, what went wrong, options
- Never leave user in a broken state
- One-click recovery options
- Fallback: "I couldn't do X, would you like me to try Y instead?"

---

## 5. Ethical UX for AI Agents

### Consent & Awareness
- Users must know when they're interacting with AI vs human
- Agents acting on user's behalf must have clear scope
- "Agent is working on your behalf" indicators

### Bias & Fairness
- Don't present AI outputs as neutral/truth
- Flag confidence levels on sensitive topics
- Avoid dark patterns that exploit AI authority

### Privacy & Data
- Show users what data the agent has access to
- Make it easy to revoke agent permissions
- Clear data retention policies

### Accessibility
- AI interfaces must work for screen readers, keyboard-only users
- AI voice interfaces need fallbacks for hearing-impaired
- Don't rely on color alone for AI state indicators

---

## 6. Emerging Patterns in 2026

### Agent-to-Human Handoff
- When agent can't handle something, handoff to human
- Pattern: agent summarizes context, human takes over seamlessly
- Critical for: customer service, healthcare, legal

### Multi-Agent Coordination UX
- When multiple agents work together, how to visualize?
- Emerging: agent "team view" showing who's doing what
- New challenge: understanding agent-to-agent communication

### Ambient AI
- AI present in the background, not always visible
- Examples: Gmail smart compose, Figma AI, Google Docs AI
- Challenge: users may not know AI is assisting

### Persistent AI Memory Interfaces
- Users reviewing/editing what the AI remembers
- Emerging as agents become more long-term
- Privacy implications: users need to see and delete agent memories

---

## 7. Key Principles for Nova

From building these AI app generators:
- **Copy buttons** on AI outputs — users want to grab output easily
- **Loading states** — show something is happening (spinner alone is not enough)
- **Error states** — make errors actionable, not just red text
- **Dark mode** — these tools skew developer/power user, dark is preferred
- **Single-purpose** — one tool, one goal, not everything everywhere

---

## 8. Key Takeaways

- AI UX is still the **wild west** — no established "design patterns" like in web/mobile
- The biggest UX challenge is **uncertainty communication** — making AI's confidence and limitations visible without overwhelming users
- **Human-in-the-loop** is the right default for high-stakes decisions; full autonomy only for low-stakes, reversible tasks
- The next frontier is **multi-agent UX** — how to visualize and control multiple agents working together
- **Ambient AI** is emerging — AI woven into existing tools (not separate AI apps) is the most natural UX evolution

---
*Research completed: 2026-03-20*
