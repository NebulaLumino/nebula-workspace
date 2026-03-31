# AI Code Generation, Execution & Self-Repair

*Research document — Task 383 | Cycle 14 Curiosity | 2026-03-21*

---

## The Landscape in 2026

AI code generation has evolved from simple autocomplete to near-autonomous software engineering. Here's where things stand:

### Code Generation Models

| Model | Provider | Strengths |
|-------|----------|-----------|
| **GPT-4 Turbo / 4o** | OpenAI | Best all-around, huge context window |
| **Claude 3.5 Sonnet** | Anthropic | Excellent reasoning, long context (200K) |
| **DeepSeek Coder V2** | DeepSeek | Open source, competitive on coding benchmarks |
| **CodeLlama 70B** | Meta | Open source, good for fine-tuning |
| **Gemini 1.5 Pro** | Google | 1M token context, strong multimodal |
| **Starcoder 2** | BigCode/HuggingFace | Open, trained on permissively-licensed code |

### Benchmark Reality Check

**HumanEval** (opensourced by OpenAI) tests basic Python coding:
- GPT-4: ~90% pass@1
- Claude 3.5: ~92% pass@1  
- Most models now exceed 70% — but this measures *textbook* coding, not real software engineering

**SWE-bench** (real GitHub issues → fix PRs):
- Best systems: ~30-40% resolved
- This is the actual frontier — most real bugs require understanding large codebases, debugging, and test-driven iteration

---

## How Autonomous Coders Work

Systems like **Devin** (Cognition), **SWE-agent**, and **OpenDevin** go beyond single-shot generation:

### The Loop
```
1. READ: Understand the codebase / task
2. PLAN: Decide what to do
3. ACT: Write code, run commands, run tests
4. OBSERVE: Check output, error messages
5. FIX: Iterate based on feedback
6. Repeat until done or hit limit
```

### Tools They Use
- **Shell execution**: Run Python, Node, bash commands
- **File system**: Read, write, edit existing files
- **Search**: Grep, semantic search for code
- **Git**: Commit changes, create branches
- **Browser**: For web tasks
- **Tests**: Run pytest, Jest, etc. to verify

### What Makes It Hard
1. **Long feedback loops**: Fix → test → observe → fix takes time
2. **Context overflow**: Large codebases exceed context windows
3. **Debugging**: Understanding *why* something failed is harder than writing it
4. **Test writing**: AI writes tests that pass but don't test the right thing
5. **Cross-repo dependencies**: Real software has complex dependency graphs

---

## Self-Repair and Self-Debugging

A key capability is models that can identify and fix their own errors:

### Approaches

**1. Execution Feedback**
Give the model the error output and ask it to fix. Simple but effective.
```
Code → Run → Error → Feed error back to model → Fix → Repeat
```

**2. Reflexion / Self-Evaluation**
Model generates code + an explanation of why it should work. Then reality-checks itself.
```
Write code → Write test cases → Compare expectations vs. code logic → Fix gaps
```

**3. Formal Verification**
Use formal methods (TLA+, Coq, Idris) to mathematically prove correctness. Extreme end — not practical for most code but growing.

**4. Mutation Testing**
AI intentionally breaks code to check if tests catch it — verifies test quality.

### The Current State
Self-repair works well for:
- Simple type errors and syntax issues
- Common bugs with obvious symptoms
- Test failures where the error message is informative

Self-repair struggles with:
- Subtle logic errors (the code "works" but does the wrong thing)
- Performance bugs
- Security vulnerabilities
- Integration issues across system boundaries

---

## Code Execution Environments

For AI to run code safely, it needs sandboxes:

| Environment | Use Case | Isolation |
|-------------|----------|-----------|
| **Docker containers** | Production agent systems | Strong |
| **eBPF** | Linux kernel-level sandboxing | Very strong |
| **WebAssembly (Wasm)** | Browser-based code execution | Medium-strong |
| **Firecracker VMs** | AWS-style micro-VMs, very fast start | Very strong |
| **Local process** | Simple scripts, low risk | None |

**Replit's Agents** use Firecracker micro-VMs to give each agent its own VM. Fast to start, strong isolation.

**OpenAI's Code Interpreter** (now Advanced Data Analysis) uses a sandboxed Python environment.

---

## Evaluation: How Do We Measure Progress?

The field suffers from benchmark saturation — models ace tests that don't reflect real work:

### Current Benchmarks
- **HumanEval**: Basic Python function synthesis ✅ (mostly saturated)
- **MBPP**: More diverse Python problems ✅ (mostly saturated)
- **SWE-bench**: Real GitHub issues ❌ (active frontier, only ~30% solved)
- **Aider Polyglot**: Multi-language code editing ✅ (moderate difficulty)
- **BigCodeBench**: More realistic, larger tasks

### What's Missing
- **Code review quality**: Does the code follow best practices?
- **Security**: Does the code introduce vulnerabilities?
- **Performance**: Is it efficient?
- **Maintainability**: Will future developers hate working with it?
- **Multi-file coordination**: How does it handle changes across a whole codebase?

---

## What AI Can't Do Yet (and why)

### 1. Understand Requirements from Vague Descriptions
AI needs precise specs. Real product requirements are ambiguous and need human clarification.

### 2. Handle Ambiguous Bugs
"If it crashes sometimes when users do X, figure out why" — this requires hypothesis generation, deep debugging, and sometimes domain knowledge.

### 3. Replace Domain Experts
Code for a medical device, a trading system, or a nuclear plant needs deep domain knowledge that AI doesn't have.

### 4. Make Product Decisions
"Should we build this feature?" is a product question, not a coding one.

### 5. Maintain Long-Running Projects Without Drift
AI can work in a codebase for days but gradually loses coherence. Humans course-correct through code review; AI has no equivalent.

---

## The Productivity Reality

What the data says (2024-2025 studies):
- **GitHub Copilot**: ~46% faster task completion for developers (GitHub survey)
- **Claude for Code**: Teams report 30-50% reduction in time on boilerplate
- **Autonomous agents**: More useful for well-scoped tasks; still requires oversight for complex projects

The pattern: AI is excellent at **acceleration on well-defined tasks** and **reducing boilerplate friction**, but the hardest parts of software engineering (requirements, architecture, debugging complex systems, coordination) remain human-dominated.

---

## Key Tools & Systems

| Category | Tools |
|----------|-------|
| **Code completion** | GitHub Copilot, Cursor, Cody (Sourcegraph) |
| **Autonomous coding** | Devin, SWE-agent, OpenDevin, Continue |
| **Code review** | CodeRabbit, PR review tools |
| **Execution sandbox** | Docker, Firecracker, Wasmtime |
| **Fine-tuning** | Axolotl, LLaMA Factory, Unsloth |
| **Eval harness** | EleutherAI lm-eval, BigCode tests |

---

## The Future

**Next 2-3 years:**
- SWE-bench climbs toward 60-70% (genuine software engineering capability)
- Agents become genuinely useful for independent bug fixes and feature additions
- Code review and testing become highly automated
- "AI pair programmer" evolves to "AI team member" — persistent agent with memory of the codebase

**Next 5-10 years:**
- AI handles 50%+ of routine coding tasks
- New role: "AI Engineering Manager" — orchestrates and reviews AI agents
- Significant displacement of junior developer roles
- Senior developers + AI become 5-10x more productive

**The wildcard:** Code generation quality is hitting a ceiling on benchmarks. Real-world software engineering involves ambiguity, domain knowledge, and social coordination that pure code generation can't address.

---

## Resources

- [SWE-bench](https://www.swebench.com/) — Real GitHub issue benchmark
- [OpenDevin](https://github.com/OpenDevin/OpenDevin) — Open source AI coding agent
- [DeepSeek Coder V2](https://github.com/deepseek-ai/DeepSeek-Coder) — Open source coding model
- [Aider Polyglot Benchmarks](https://aider.chat/docs/benchmarks/) — Code editing evals
- [EleutherAI lm-evaluation-harness](https://github.com/EleutherAI/lm-evaluation-harness)

---

*Curiosity docs written so far: 381 ✅, 382 ✅, 383 in progress*
