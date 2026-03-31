# Multi-Agent Orchestration Frameworks

*Research document — Task 384 | Cycle 14 Curiosity | 2026-03-21*

---

## Overview

Single-agent systems are powerful. Multi-agent systems are where things get interesting — and complex. When multiple AI agents work together, they can divide labor, check each other's work, and tackle problems no single agent could handle. But orchestrating them is a genuinely hard problem.

---

## Why Multi-Agent?

Single agents have hard ceilings:
- Limited context → can't hold entire large projects
- Single perspective → no self-critique or peer review
- Monolithic reasoning → can't parallelize thinking
- Brittleness → one failure kills the whole task

Multi-agent systems solve these by decomposing:
- **Specialization**: Different agents for different domains
- **Parallelism**: Work simultaneously on independent sub-tasks
- **Critique**: One agent writes, another reviews
- **Resilience**: Failure can be isolated and retried locally

---

## How Agents Communicate

The core architectural question in multi-agent systems: **how do agents share state and coordinate?**

### 1. Shared Message Board (Simple)

All agents post to a shared message queue. Each agent reads relevant messages, processes, and posts responses. No central controller.

```
Agent A → [message] → Shared Queue
Agent B → reads A's message, responds → [message] → Shared Queue
Agent C → reads B's response, responds → ...
```

**Pros:** Simple, scalable, fault-tolerant  
**Cons:** No ordering guarantees, can produce conflicting responses, no global state

**Tools:** Simple Redis queue, database-backed message log

### 2. Hierarchical / Central Controller

One "orchestrator" agent decomposes tasks and assigns them to specialist agents, collects results, and synthesizes.

```
Orchestrator → decomposes task → assigns to Agent A, B, C
Agent A ──────────────────────────────→ results
Agent B ──────────────────────────────→ results
Agent C ──────────────────────────────→ results
Orchestrator ← synthesizes all results ←
```

**Pros:** Clear structure, easy to understand and debug  
**Cons:** Bottleneck at orchestrator, orchestrator becomes the ceiling

**Tools:** AutoGen's hierarchical chat, LangGraph's Root+Subgraph patterns

### 3. Debating / Adversarial

Two or more agents with different perspectives argue it out. A judge or consensus mechanism picks the best answer.

```
Agent A (proposes solution) ←→ Agent B (criticizes/challenges)
                ↓
            Judge Agent
                ↓
           Final Output
```

**Pros:** Forces rigorous examination of assumptions  
**Cons:** Can get stuck in loops, slow, adversarial dynamics

**Example:** "Constitutional AI" uses a critic model to evaluate responses against principles. GPT-4's "debate" mode explores this for factual questions.

### 4. Sequential Pipeline

Agents form a processing pipeline — output of one feeds into the next.

```
Raw Input → Agent 1 (clean/parse) → Agent 2 (analyze) → Agent 3 (synthesize) → Output
```

**Pros:** Clear flow, easy to test each stage  
**Cons:** No backtracking, errors compound down the pipeline

**Tools:** LangGraph's linear chains, LangChain's SequentialChain

### 5. Fully Decentralized / P2P

No central orchestrator. Agents discover each other, negotiate, and collaborate as needed.

**Pros:** Most flexible, most resilient  
**Cons:** Hardest to reason about, unpredictable emergent behavior

**Research:** Mostly academic at this point (e.g., "Multi-Agent Negotiating Rationale" papers)

---

## Key Frameworks

### Microsoft AutoGen

The most mature multi-agent framework. Agents communicate via structured messages. Supports:
- **Hierarchical**: Orchestrator + specialists
- **Debate**: Two agents argue, third judges
- **Group chat**: N agents in a shared conversation with selective participation

```python
# Simple AutoGen pattern
assistant = AssistantAgent("assistant")
critic = CriticAgent("critic")
orchestrator = UserProxyAgent("orchestrator")
# Orchestrator delegates to assistant, routes to critic
```

**Strengths:** Mature, well-documented, strong Microsoft backing  
**Weaknesses:** Verbose setup, can be expensive (many LLM calls)

### CrewAI

Role-based agents. Each agent has a defined role (e.g., "researcher", "writer") and they collaborate in a mission structure.

```python
researcher = Agent(role="Researcher", goal="Find best practices", backstory="...")
writer = Agent(role="Writer", goal="Write compelling content", backstory="...")
crew = Crew(agents=[researcher, writer], tasks=[...])
```

**Strengths:** Intuitive mental model, clean API  
**Weaknesses:** Less flexible than AutoGen, newer (2024)

### LangGraph (LangChain)

Graph-based orchestration where agents are nodes and edges define transitions. Supports cycles (iterative refinement), conditional branching, human-in-the-loop.

```python
graph = StateGraph(AgentState)
graph.add_node("research", research_agent)
graph.add_node("write", writer_agent)
graph.add_edge("research", "write")
```

**Strengths:** Very flexible, supports complex topologies, built on LangChain ecosystem  
**Weaknesses:** Steeper learning curve, verbose

### OpenAI Swarm

Experimental (2024), lightweight multi-agent orchestration. Agents are just functions with context. No built-in memory, state is managed by the caller.

**Strengths:** Extremely simple, easy to understand  
**Weaknesses:** Very early, limited features, no persistence

---

## Real-World Applications

### 1. Autonomous Research Teams
Multiple agents where one searches, one analyzes, one writes, one fact-checks. Like a mini research department.

**Example:** "ChatDev" — virtual software company where agents play CEO, CTO, programmer, tester roles.

### 2. Code Review Teams
One agent writes code, another reviews for bugs, a third checks for style/consistency, a fourth verifies tests.

**Example:** CodeRabbit — AI code review with multiple specialized agents.

### 3. Customer Support Orchestration
One agent handles triage, others specialize in refunds, technical issues, escalations. Router agent directs.

**Example:** Zendesk's AI agents, Forethought's multi-agent support.

### 4. Content Pipelines
Research → outline → write → edit → SEO optimize → publish. Each step handled by a specialized agent.

**Example:** Marketing automation tools using multi-agent content pipelines.

---

## Challenges & Failure Modes

### 1. Hallucination Cascades
Agent A's incorrect output becomes Agent B's input. B "confirms" A's error. Cascade of false confidence.

### 2. Loops
Two agents keep disagreeing and reversing each other's decisions indefinitely. Need explicit cycle limits or judge mechanisms.

### 3. Context Fragmentation
No agent has the full picture. Decisions get made in isolation that contradict each other.

### 4. Cost Explosion
Each agent call costs LLM tokens. N agents talking in loops can generate enormous bills quickly.

### 5. Debugging
When a multi-agent system produces a bad output, figuring out *which agent* caused the problem is genuinely hard.

### 6. Emergent Self-Reference
Agents start talking about themselves or each other, creating paradoxical feedback loops.

---

## What Works Well

Multi-agent systems shine when:
- Task has clear natural decomposition (write/edit/publish)
- Different expertise is needed in different phases
- One agent can do preliminary work and another can validate
- The work can be parallelized across independent subtasks

They struggle when:
- Tasks require a single coherent worldview (multiple agents may contradict each other on values)
- Speed is critical (coordination overhead is real)
- Cost is constrained (N agents = N× the cost)
- Tasks are ambiguous (no clear decomposition)

---

## The Future

**Near-term (1-3 years):**
- Multi-agent becomes the default architecture for complex agentic workflows
- Role-based agents (CrewAI pattern) become dominant for business use cases
- Human-in-the-loop becomes a first-class concept in orchestration
- Better tooling for debugging and observability

**Medium-term (3-7 years):**
- Agents that dynamically form and dissolve teams based on task requirements
- Open multi-agent protocols (like HTTP for agents) — agents from different providers working together
- Market-based agent coordination: agents "bid" on tasks, negotiate roles
- Emergent specializations: agents in a large system develop their own roles organically

---

## Key Resources

- [Microsoft AutoGen](https://microsoft.github.io/autogen/) — Multi-agent conversation framework
- [CrewAI](https://crewai.com/) — Role-based AI agents
- [LangGraph](https://langchain.github.io/langgraph/) — Graph-based agent orchestration
- [OpenAI Swarm](https://github.com/openai/swarm) — Experimental multi-agent orchestration
- [ChatDev paper](https://arxiv.org/abs/2307.07924) — Virtual software company with agents

---

*Curiosity docs: 381 ✅, 382 ✅, 383 ✅, 384 ✅*
