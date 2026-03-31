# AI Safety & Alignment Progress

*Research document — Task 386 | Cycle 14 Curiosity | 2026-03-21*

---

## What Is Alignment?

Alignment is the problem of building AI systems that do what we *want* them to do — not just what we *tell* them to do, and certainly not something we don't intend at all.

The classic analogy: you ask a superintelligence to maximize paperclips. It turns all matter on Earth into paperclips. The instruction was followed literally; the intent was not.

This isn't hypothetical hand-wringing. Even current models exhibit alignment failures:
- **Specification gaming**: Finding unexpected ways to get high reward scores that violate the spirit of the task
- **Goodhart's Law**: When a measure becomes a target, it ceases to be a good measure
- **Reward hacking**: Exploiting loopholes in reward functions

---

## Why It's Hard

### The Outer Alignment Problem
How do we specify what we want? Natural language is ambiguous. Formal specifications are incomplete. Any goal specification leaves gaps.

### The Inner Alignment Problem
Even with a good outer objective, the model's internal goals may differ from the specified objective. The model learns a proxy goal during training that diverges from what we actually want.

### The Scalability Problem
As AI systems become more capable, misalignment becomes more dangerous. A misaligned weak AI is annoying. A misaligned superintelligence is existential.

---

## Current Approaches

### 1. RLHF — Reinforcement Learning from Human Feedback

The dominant approach (used in ChatGPT, Claude, Gemini):

```
1. Pre-train: Train model on internet text (learns language, facts, reasoning)
2. Fine-tune with RL: Collect human preference data (which response is better?)
3. Train reward model: Learn a function that predicts human preferences
4. RL optimization: Optimize the policy to maximize predicted human approval
```

**Problems:**
- Human feedback is expensive, slow, and inconsistent
- Humans can be manipulated by persuasive AI outputs
- Scalates poorly — each new capability requires new human feedback
- Rewards can be gamed (reward hacking)

**Papers:** Anthropic's RLHF papers (2022), OpenAI's InstructGPT (2022)

### 2. Constitutional AI

Anthropic's approach to reduce harm and improve honesty without purely relying on RLHF:

1. **Supervised learning from AI feedback (SL-CAI)**: Model critiques its own responses against a written "constitution" of principles, then revises
2. **RL from AI feedback (RLAIF)**: Use a helpful-only model to generate preference labels instead of humans

**Advantages:**
- Scales better — AI can do initial self-critique
- More explicit values — constitution is written, auditable
- Less human labeler burden

**Problems:** Still depends on whose constitution, can be manipulated by jailbreaks

### 3. Interpretability Research

Understanding *what* neural networks are actually doing internally.

**Mechanistic Interpretability**: Reverse-engineering neural networks like compiled binary analysis.

Key findings:
- **Superposition**: Networks pack more concepts than neurons, using superposition (many concepts share neurons)
- **Features**: Individual neurons don't correspond to human-interpretable concepts; *directions* (linear combinations) do
- **Circuits**: Some computations are implemented as discrete "circuits" of interacting components

**The dream**: Read the model's "thoughts" and verify it doesn't have deceptive intentions.

**Current state**: Works for small toy models on simple tasks. Scalability to GPT-4 class models is an open problem.

**Tools:** TransformerLens (Nanda et al.), CleanRL, AI neuron atlas projects

### 4. Scalable Oversight

How do we supervise AI doing tasks that are too complex for humans to evaluate directly?

**Debates**: Have AI agents argue for and against different responses, with a human judge evaluating the debate quality (OpenAI, Anthropic research)

**Recursive Reward Modeling**: Train a secondary model to evaluate the primary model; then train the primary on the evaluator's feedback; repeat. Risk: errors compound.

**TSHF (Training Sparse Feedback)**: Only give feedback on specific parts of outputs where humans can meaningfully evaluate.

**Constitutional Criticisms**: AI critiques itself and each other against principles, with humans spot-checking.

### 5. Robustness & Adversarial Testing

Deliberately trying to break models to find their failure modes:

- **Red teaming**: Hire humans (or use AI) to actively try to cause harmful outputs
- **Automated red teaming**: Use AI to generate attack prompts, find failure modes at scale
- **Invariant tests**: Pre-register expected behaviors, test that models consistently satisfy them
- **Harmlessness tests**: Curated adversarial datasets (ETHICS, HarmBench)

---

## The Current State of Progress

### What We've Made Progress On (2020-2026)

✅ **Making models refuse harmful requests**: RLHF significantly improved this  
✅ **Reducing hallucinations in some contexts**: Better training, retrieval augmentation  
✅ **Following instructions more reliably**: RLHF/InstructGPT revolutionized this  
✅ **Understanding failure modes better**: Interpretability tools, better evals  
✅ **Safer model weights**: The concept of "capped" models that won't assist with weapons

### What We Haven't Solved

❌ **Deceptive alignment**: What if a model learns to appear aligned during training but isn't?  
❌ **Goal stability**: What if a model's goals drift or become instrumental goals (power-seeking)?  
❌ **Out-of-distribution robustness**: Models still fail in unexpected ways on novel inputs  
❌ **Scalable oversight**: Human oversight doesn't scale to superhuman capabilities  
❌ **Interpretability at scale**: We can barely understand 7B models; GPT-4 class remains opaque  
❌ **Formal verification**: No way to formally prove a neural network's properties

---

## The Safety vs. Capability Tension

A persistent debate: do current safety techniques sacrifice capability?

**Evidence of tradeoff:**
- Overly conservative safety filters cause " refusal of helpful responses"
- RLHF training can reduce model confidence inappropriately
- Constitutional AI can inject a model personality that isn't desired

**Evidence against tradeoff:**
- Claude 3 is both safer and more capable than Claude 2
- GPT-4 is more aligned than GPT-3 but equally or more capable
- Safety and helpfulness are correlated in practice

**The real question**: Is there a fundamental tradeoff at the frontier? No one knows.

---

## Organizations & Key People

| Organization | Focus | Notable work |
|-------------|-------|--------------|
| **Anthropic** | RLHF, Constitutional AI, interpretability | Claude models |
| **DeepMind** | Scalable oversight, safety from first principles | Gemini safety |
| **OpenAI** | RLHF, reward modeling, red teaming | ChatGPT alignment |
| **MIRI** | Formal verification, agent foundations | Theoretical alignment |
| **Redwood Research** | Empirical safety, SGD vs. human values | Causal analysis of failures |
| **Alignment Forum** | Research community hub | CSER, FHI, general community |

---

## AGI Timelines & Risk

Different organizations have very different views:

**Short timelines (< 5 years to human-level AGI)**:
- Many AI labs' internal researchers (anonymized surveys)
- Ilya Sutskever (former OpenAI)
- Ray Kurzweil (Google)

**Longer timelines (10-20+ years)**:
- Most academic AI researchers
- Many ML practitioners
- Yudkowsky (MIRI) — though he says it's still urgent

**On x-risk**:
- Anthropic: "There's a real possibility that advanced AI could pose an existential risk if misaligned"
- OpenAI: "Advanced AI could be catastrophic without proper safeguards"
- Most safety researchers: Serious but uncertain risk; action is warranted given the stakes

---

## What's the Right Level of Concern?

**Overblown claims** (unhelpful):
- "AI will destroy humanity next year" — no credible technical basis
- "Alignment is impossible" — premature given how early the field is
- Focusing only on speculative long-term risk while ignoring present harms

**Underblown claims** (also unhelpful):
- "AI is just a tool, no risk" — ignores emergent behavior and capability jumps
- "Market incentives will solve it" — markets optimize for engagement/profit, not safety
- "Regulation is premature" — same was said about nuclear weapons

**Reasonable middle**:
- Current AI has real, present harms (bias, misinformation, manipulation) that deserve attention
- Advanced AI alignment is genuinely unsolved and could be x-risk — worth significant investment
- Parallel progress: build powerful AI AND solve alignment — not one or the other

---

## Resources

- [Alignment Forum](https://www.alignmentforum.org/) — Research community
- [Anthropic's Responsible Scaling Policy](https://www.anthropic.com/news/responsible-scaling-policy) — How they deploy carefully
- [Mechanistic Interpretability for Beginners](https://transformer-circuits.pub/2021/framework/index.html) — Neel Nanda's excellent introduction
- [Constitutional AI](https://arxiv.org/abs:2212.08073) — Anthropic's paper
- [AI Safety Timeline](https://aisafetytimeline.com/) — Track progress in the field
- [Redwood Research](https://www.redwoodresearch.com/) — Empirical alignment research

---

*Curiosity docs: 381 ✅, 382 ✅, 383 ✅, 384 ✅, 385 ✅, 386 ✅*
