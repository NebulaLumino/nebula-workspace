# Task 329: Explore AI Reasoning & Planning Improvements

**Status:** ✅ Complete  
**Type:** Research: AI Reasoning & Planning Improvements  
**Completed:** 2026-03-20

---

## Executive Summary

Reasoning and planning are where the gap between "impressive demo" and "reliable production tool" is most visible. Current LLMs reason through chain-of-thought, but their planning remains brittle: they struggle with deeply nested sub-goals, fail to recover gracefully from unexpected states, and lack the world models needed to truly simulate outcomes before acting. The field is advancing rapidly — Chain-of-Thought (CoT), Tree-of-Thought (ToT), ReAct, and newer approaches like DeepSeek R1's reinforcement learning training have materially improved reasoning. The next breakthrough is likely in formal verification of reasoning chains and world model integration for physical/logical planning.

---

## The Reasoning Problem

### What LLMs Do Well
- Pattern recognition across vast training data
- Analogical reasoning (applying solutions from similar past problems)
- Language understanding and generation
- Mathematical computation (when shown work)
- Explaining their reasoning (chain-of-thought)

### What LLMs Still Struggle With
- **Multi-step planning with branch points**: Plans where the best next step depends on uncertain outcomes
- **Recovery from unexpected states**: When a plan fails, humans re-plan from the new state; LLMs can perseverate
- **Commonsense physics**: Mental simulation of physical systems (what happens if I drop X from height Y?)
- **Temporal reasoning**: Understanding how long things take, what can be done in parallel, what must be sequential
- **Self-verification**: Checking whether their own reasoning is correct — LLMs are notoriously overconfident in wrong reasoning

---

## Reasoning Enhancement Techniques

### 1. Chain-of-Thought (CoT) — Foundational
Simply prompting the model to "think step by step" dramatically improves performance on multi-step reasoning tasks.

**Why it works**: Forces the model to externalize intermediate reasoning, reducing the cognitive load on the model's limited working memory.

**Limitations**: The chain is only as good as the model's internal representations; errors compound.

**Variants**:
- **Zero-shot CoT** (Kojima et al.): "Let's think step by step" — no examples needed
- **Few-shot CoT**: Provide exemplars of good reasoning chains
- **Self-Consistency**: Generate multiple reasoning chains, take majority vote

### 2. Tree-of-Thought (ToT) — Planning as Search
Rather than a single chain, explore multiple reasoning paths simultaneously like a tree:

```
                  Root (Problem)
                /    |      \
           Path A  Path B  Path C
           / \      ...       \
        Good  Bad            Good
```

- **When to use**: Problems with multiple valid solution paths where backtracking is needed
- **Cost**: 10-100x more inference compute (multiple branches)
- **Implementation**: LangGraph's built-in ToT support, or custom

### 3. ReAct (Reasoning + Acting)
Interleave reasoning steps with tool use and environment observation:

```
Thought: I need to find the current weather in Tokyo
Action: search(query="weather Tokyo")
Observation: 22°C, partly cloudy
Thought: The weather is nice. The user asked about weather for their trip.
Response: Tokyo is currently 22°C and partly cloudy — great weather for a trip!
```

**Why it matters**: Makes LLMs usable in real environments where they need to gather information before responding.

### 4. Reflexion (Self-Correction)
LLMs generate a response, then critique their own response, then revise:

```
Response → Self-critique → Revised response (with critique in mind)
```

**Key insight**: Separating the generation task from the critique task lets each be optimized independently.

### 5. DeepSeek R1's Approach: RL for Reasoning
DeepSeek R1's breakthrough was training reasoning models via reinforcement learning without relying on supervised fine-tuning examples:

- **Process**: Use a rule-based reward signal (is the answer correct? does the reasoning contain specific keywords?) to train via GRPO (Group Relative Policy Optimization)
- **Result**: Emergent chain-of-thought behavior that matches and sometimes exceeds supervised CoT methods
- **Key insight**: With enough compute and the right reward signal, reasoning can emerge without being explicitly taught

### 6. Formal Verification Integration
The most promising frontier: using formal methods to verify that an LLM's reasoning chain is logically valid:

```
LLM reasoning chain → Formal logic translation →
Formal verifier (Coq, Lean, Z3) → Valid/Invalid/Unknown
```

This doesn't verify the premises are true, but it catches logical fallacy errors.

---

## Planning Architectures

### Planning as Classical AI
Early work treated LLM planning as a classical AI problem:
- **PDDL (Planning Domain Definition Language)**: LLM generates PDDL plans from natural language
- **HTN (Hierarchical Task Networks)**: Decompose tasks hierarchically
- **Limitation**: LLMs generate plausible but often invalid PDDL

### Planning as LLM Generation + Verification
The dominant current approach:
```
Task description → LLM generates plan → Simulator evaluates plan
                                             ↓
                                    Valid? Execute.
                                    Invalid? Ask LLM to revise.
```

### Video Prediction as Planning
A newer approach: use video generation models as world simulators to "imagine" the outcome of actions before executing them.

- **UniSim** (NVIDIA): Generate video of what happens when a robot performs an action in a scene
- **Uses**: Planning for robotics, autonomous driving, game-playing

### MCTS (Monte Carlo Tree Search) + LLM
LLMs generate candidate actions, MCTS evaluates outcomes through simulation:

```
LLM generates K candidate actions
For each candidate: simulate outcome → evaluate result
Choose action with highest expected value
```

Used effectively in game-playing (AlphaCode for competitive programming) and is being applied to agent planning.

---

## Production Reliability Patterns

### Planning with Checkpoints
```
Task → Subgoal 1 → Checkpoint (verify) → Subgoal 2 → Checkpoint → Subgoal 3 → Done
                    ↓                              ↓
              Re-plan if          Re-plan if
              wrong               wrong
```

### Best-of-N with LLM Judge
- Generate N different plans for the same task
- LLM judges which plan is best (or fastest, cheapest, safest)
- Reduces single-path planning errors

### Planning Under Uncertainty
For production agents, plans must handle:
- **Tool failures**: What if the search API is down? Plan for fallback
- **User interruptions**: Can the plan be paused and resumed?
- **Non-deterministic outcomes**: If action has uncertain outcome, have contingency plans

---

## Evaluation of Reasoning Ability

| Benchmark | What It Tests | Current SOTA |
|-----------|--------------|--------------|
| MATH | Competition math | DeepSeek R1 ~97% |
| ARC-AGI | Novel reasoning | Claude 3.5 ~18% (still hard) |
| GPQA | PhD-level reasoning | Gemini 2.0 ~53% (接近 expert) |
| MMLU | Broad knowledge | Gemini Ultra ~90% |
| HumanEval | Code generation | Claude 3.7 ~92% |
| BigBench Hard | Multi-step reasoning | Various ~85% |
| GAIA | Real-world agent tasks | GPT-4o ~35% (room to improve) |

**Key insight**: Benchmarks are saturating on formal reasoning (math, code) but still weak on **novel, real-world planning** — the gap between benchmark performance and production reliability remains significant.

---

## Key Resources
- "Chain-of-Thought Prompting Elicits Reasoning in LLMs" (Wei et al., 2022) — foundational
- "Tree of Thoughts" (Yao et al., 2023) — planning as search
- "ReAct: Synergizing Reasoning and Acting" (Yao et al., 2023)
- DeepSeek R1 technical report — RL for reasoning breakthrough
- "Scaling LLM Test-Time Computation" (Brown et al., 2024) — relationship between inference compute and reasoning quality
- AlphaCode 2 paper (DeepMind) — MCTS + LLM for competitive programming
- Reflexion paper (Shinn et al.) — self-correction in language agents
