# AI Agent Memory & Long-Term Context

*Research document — Task 381 | Cycle 14 Curiosity | 2026-03-21*

---

## Overview

A fundamental limitation of large language models is that they're stateless — each conversation starts fresh. AI agents change this by maintaining memory across interactions. But how? This doc explores the current approaches to persistent memory in AI agent systems.

---

## The Problem

LLMs have a finite context window (e.g., 128K tokens for GPT-4 Turbo, 200K for Claude 3). Real-world agents need to:

- Remember user preferences across weeks or months
- Maintain stateful awareness of ongoing projects
- Accumulate knowledge about a specific domain or person
- Operate across multiple sessions without re-explaining context

The challenge: **context is expensive and slow**. Every token in context costs compute and latency. You can't just stuff years of memory into the prompt.

---

## Current Approaches

### 1. Summarization (The Simple Way)

After each session, summarize key facts into a persistent profile. At session start, inject this summary into the system prompt.

**Pros:** Simple, no new infrastructure  
**Cons:** Information loss over time; summaries get stale

```
Example: "User prefers concise responses. Working on Next.js project. Last discussed: API design."
```

**Used by:** Many consumer AI apps (Pi, Claude记忆, etc.)

### 2. Vector Search / RAG

Store memories as embeddings in a vector database (Pinecone, Weaviate, Chroma, pgvector). At inference time, retrieve the most relevant memories based on the current query.

```
User query → embed query → similarity search → inject top-K memories → generate response
```

**Pros:** Can retrieve specific facts without summarization loss  
**Cons:** Requires a vector DB; can retrieve irrelevant context; embedding quality matters

**Key tools:**
- **Pinecone**: Managed vector DB, easiest to start
- **Weaviate**: Open source, supports hybrid search
- **Chroma**: Lightweight, great for local/ prototyping
- **pgvector**: If you already use Postgres

**Frameworks:** LangChain's Memory modules, LlamaIndex

### 3. Knowledge Graphs

Store facts as nodes and edges in a graph structure. Enables multi-hop reasoning over stored knowledge.

```
Person → WORKS_AT → Company
Person → PREFERS → ResponseStyle
Company → COMPETES_WITH → [Competitor1, Competitor2]
```

**Pros:** Structured, supports complex queries, interpretable  
**Cons:** Schema design is hard; populating the graph requires extraction logic

**Used by:** Some research systems, Notion AI, enterprise knowledge agents

### 4. Hybrid Memory Hierarchies

The most sophisticated systems combine multiple approaches:

| Layer | Mechanism | What it stores |
|-------|-----------|---------------|
| Working memory | Context window | Current conversation state |
| Episodic memory | Vector DB / summary | Past sessions |
| Semantic memory | Knowledge graph | Persistent facts |
| Procedural memory | System prompt / skills | How to behave |

**Example systems:**
- **MemGPT** (UC Berkeley): Hierarchical memory management, analogous to OS memory paging
- **KGCAgent**: Combines knowledge graphs with RAG
- **AutoGPT**: Uses external storage (file-based) for state persistence

### 5. External State Stores

Some agents maintain state in external systems:
- **Database**: Postgres, SQLite for structured data
- **File system**: JSON, markdown logs
- **Redis**: Fast key-value for ephemeral session state
- **Notion/Google Docs**: Natural language storage

**Example:** OpenAI's "Assistants API" stores thread history server-side automatically.

---

## The Privacy Challenge

Persistent memory creates significant privacy considerations:

- **Data residency**: Where is memory stored? Who can access it?
- **Right to be forgotten**: Can a user request deletion of their memory?
- **Context injection attacks**: Could an attacker manipulate stored memories to change agent behavior?
- **Multi-tenant systems**: How do you isolate memories between users on shared infrastructure?

For personal agents, this is especially sensitive — the agent knows intimate details about your life.

---

## Architectural Patterns

### Stateless Agent + Stateful Layer

```
User → Agent (stateless, scales horizontally) → Memory Layer (stateful) → Vector DB / Graph / DB
```

This pattern separates concerns: the LLM doesn't care about persistence, the memory layer doesn't care about inference.

### Agentic Memory Management

Advanced systems let the agent **manage its own memory**:
- Decide what to remember vs. discard
- Periodically consolidate/merge memories
-主动反思（"What have I learned about this user in the last week?"）

**Reflexion** (Shinn et al.) uses linguistic feedback signals to update memory. **AutoGPT** implements basic "long-term memory" via vector search over a persistent store.

---

## Key Technologies in the Ecosystem

| Category | Tools |
|----------|-------|
| Vector DBs | Pinecone, Weaviate, Chroma, pgvector, Qdrant |
| Agent frameworks | LangChain, LlamaIndex, AutoGPT, CrewAI, BeeAI |
| Memory-specific | MemGPT, SecondBrain, Obsidian MCP |
| Knowledge graphs | Neo4j, Amazon Neptune, Diffbot |

---

## What Still Doesn't Work Well

1. **Memory prioritization**: Most systems retrieve all "relevant" memories equally — no weighting by recency, importance, or confidence
2. **Automatic memory consolidation**: When to merge, summarize, or delete memories is still largely manual
3. **Cross-agent memory**: If you use multiple AI systems, they don't share or coordinate memory
4. **Consistency**: The same fact stored twice can diverge over time without reconciliation
5. **Evaluation**: There's no standard way to evaluate whether a memory system is working correctly

---

## Looking Forward

The most promising direction is **memory as a first-class citizen** of agent design — not an afterthought bolted on via RAG, but a deliberate architectural layer with its own:
- Storage abstraction
- Query/retrieval semantics
- Retention policies
- Privacy controls

Think of it like how humans work: we don't remember everything equally, we prioritize, we forget deliberately, and we update beliefs when new evidence conflicts with old ones. AI memory systems are just starting to explore these ideas.

---

## Resources

- [MemGPT paper](https://arxiv.org/abs/2308.08703) — Hierarchical memory for LLMs
- [LangChain Memory docs](https://docs.langchain.com/docs/memory/)
- [LlamaIndex Memory](https://gpt-index.readthedocs.io/en/latest/core_modules/memory.html)
- [Reflexion paper](https://arxiv.org/abs/2303.11366) — Language agents with linguistic feedback
- [SecondBrain MCP](https://modelcontextprotocol.io/) — Personal knowledge graph integration

---

*Next: Explore Personal AI Agents & Digital Twins → task-382.md*
