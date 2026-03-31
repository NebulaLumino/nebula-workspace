# AI Evaluation & Benchmarking

*Research document — Task 388 | Cycle 14 Curiosity | 2026-03-21*

---

## Why AI Evaluation is Hard

Measuring intelligence is hard. Measuring *artificial* intelligence is harder — because we don't have a good definition of intelligence to begin with, and because AI systems can appear capable in ways that are fundamentally different from how humans are capable.

There's also a fundamental problem: **the moment you turn a measure into a target, it ceases to be a good measure.** (Goodhart's Law)

This isn't academic — it has real consequences. Models trained to maximize benchmark scores often learn to game those benchmarks rather than develop genuine capability.

---

## The Benchmark Landscape

### Language Understanding & Reasoning

| Benchmark | What it tests | Limitations |
|-----------|--------------|-------------|
| **MMLU** (Massive Multitask Language Understanding) | 57 subjects, high school to professional | Saturated; models now exceed human average |
| **BIG-Bench** | 200+ diverse tasks, some require multi-step reasoning | Hard to aggregate, some tasks contaminated |
| **HellaSwag** | Commonsense reasoning (but easy for modern models) | Saturated |
| **ARC** | Reasoning puzzles requiring multi-step logic | Still challenging |
| **GSM8K** | Grade school math word problems | Saturated for frontier models |
| **MATH** | Competition math problems | Still hard, good differentiator |

### Coding

| Benchmark | What it tests | Limitations |
|-----------|--------------|-------------|
| **HumanEval** | Python coding from docstrings | Saturated (GPT-4 at ~90%) |
| **MBPP** | Basic Python problems | Saturated |
| **SWE-bench** | Fix real GitHub issues | Active frontier, only ~30-40% solved |
| **Aider Polyglot** | Multi-language code editing | Good for coding agent evals |
| **BigCodeBench** | More realistic, larger coding tasks | Newer, less saturated |

### Frontier Reasoning

| Benchmark | What it tests | Limitations |
|-----------|--------------|-------------|
| **GPQA** | Expert-level graduate questions (chemistry, biology, physics) | Expensive to collect, limited coverage |
| **MathVista** | Visual math reasoning | New |
| **MMLU-Pro** | Harder version of MMLU | Emerging |

---

## The Benchmark Saturation Problem

Benchmarks have a short shelf life. The history:

1. **GLUE** (2018): Standard language understanding. By 2021, all models exceeded human baseline.
2. **SuperGLUE** (2019): Harder version. Saturated by 2023.
3. **HumanEval** (2022): Fresh coding benchmark. Saturated by 2024.
4. **GSM8K** (2021): Grade school math. Saturated by 2024.

The pattern: each benchmark lasts about 2-3 years before frontier models exceed human performance. Then we need a new benchmark.

**Why this matters**: It suggests we're measuring *how well models can perform on our tests*, not *how intelligent they are*. A model that gets 100% on a math benchmark might still fail at novel math research. The benchmark may just be testing a narrow skill we've overfitted to.

---

## The Contamination Problem

**Benchmark contamination**: Models trained on data that includes benchmark test questions. They don't "solve" the problem — they memorize the answer.

This is a serious issue:
- Many web scrapes include GitHub issues (SWE-bench contamination)
- Papers describing benchmarks appear in training data
- Model providers may intentionally augment training with evals

**How it's detected**: Look for unusual performance jumps between similar problems. Or: reverse-engineer test sets, compare in-distribution vs. out-of-distribution performance.

**How it's addressed**: Dynamic benchmarks (never released publicly), private evaluation sets, synthetic test generation.

---

## Beyond Standard Benchmarks

### Agentic Benchmarks

New benchmarks for agents that plan, use tools, and operate over multiple steps:

| Benchmark | Tests | State |
|-----------|-------|-------|
| **AgentBench** | Agents in real software environments | Active |
| **WebArena** | Real-world web tasks (browse, book, etc.) | Active |
| **MiniWob++** | Simple web interaction tasks | Established |
| **GAIA** | General AI assistant tasks, real-world | New (Meta) |

### Multimodal Benchmarks

| Benchmark | Tests | State |
|-----------|-------|-------|
| **MMMU** | Multi-hop multimodal reasoning | Active frontier |
| **MathVista** | Visual math | New |
| **AI2D** | Science diagrams | Established |
| **VQA** | Visual question answering | Saturated for basic |

---

## How Labs Do Internal Evaluation

External benchmarks are public, so labs can't use them reliably. They use private evals:

### OpenAI
- Private held-out sets from GPT-4 training
- "Model SDK" benchmarks for red teaming
- Human preference studies (ELO-style model comparisons)

### Anthropic
- Internal evals for capability and safety
- Constitutional AI tests (does the model follow principles?)
- Behavioral safety tests (adversarial prompts)

### Google DeepMind
- Mathematical reasoning (no-contamination MATH problems)
- Agent evaluation in sandboxed environments

**The problem**: Without transparency, external researchers can't verify claims. The AI community largely relies on third-party independent evaluation (e.g., LMSYS Chatbot Arena).

---

## The Chatbot Arena: A Different Approach

**LMSYS Chatbot Arena** takes a different approach to evaluation:

- Human judges see two anonymous models side-by-side
- They have a conversation and pick which is better
- ELO ratings are computed from these comparisons

**Advantages:**
- Harder to contaminate (conversational, not static questions)
- Measures human preference, not benchmark performance
- Transparent, reproducible

**Disadvantages:**
- Expensive, slow
- Subjective to human judges (who may have biases)
- Can't pinpoint *why* one model is better

This has become one of the most trusted external benchmarks for model quality.

---

## What Makes a Good Benchmark?

**Properties of useful benchmarks:**

1. **Diverse**: Tests many different skills, hard to game via memorization
2. **Uncontaminated**: Not in training data (hard to ensure)
3. **Hard to manually game**: Even skilled humans can't easily optimize for it
4. **Correlated with real-world performance**: Good benchmarks predict how the model will behave in production
5. **Hard to saturate**: Good discriminates between top models for a meaningful time
6. **Reproducible**: Clear methodology, determinism

**The holy grail**: A benchmark that takes 5+ years to saturate and reliably predicts downstream utility. We don't have one yet.

---

## The Evaluation Gap

There's a fundamental problem: **we're good at evaluating what we can measure, and what we can measure isn't what we care about.**

We measure:
- Correct answers to test questions
- Human preference in conversations
- Performance on benchmark tasks

We care about:
- Will it be helpful in real workflows?
- Will it be reliable?
- Will it avoid catastrophic errors?
- Will it scale to harder problems?

This gap leads to: "benchmark heroes" — models that perform well on leaderboards but fail in production. This is well-known in the industry.

---

## What's Needed

1. **Dynamic benchmarks**: Generated fresh for each evaluation, preventing contamination
2. **Real-world task evaluation**: Test in actual production-like environments
3. **Cost-effectiveness evaluation**: Not just quality, but quality per dollar/compute
4. **Safety-specific evals**: How to reliably measure alignment properties
5. **Multi-modal evaluation**: Integrated benchmarks, not separate vision/language tests
6. **Adversarial benchmarks**: Designed to find failure modes, not highlight strengths

---

## Key Resources

- [HuggingFace Open LLM Leaderboard](https://huggingface.co/spaces/HuggingFaceH4/open_llm_leaderboard)
- [LMSYS Chatbot Arena](https://chat.lmsys.org/)
- [SWE-bench](https://www.swebench.com/)
- [BIG-Bench](https://github.com/google/BIG-bench)
- [EleutherAI LM Evaluation Harness](https://github.com/EleutherAI/lm-evaluation-harness)
- [Stanford HELM](https://crfm.stanford.edu/helm/)

---

*Curiosity docs: 381 ✅, 382 ✅, 383 ✅, 384 ✅, 385 ✅, 386 ✅, 387 ✅, 388 ✅*
