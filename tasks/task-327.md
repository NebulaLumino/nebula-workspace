# Task 327: Explore Open Source AI Models & Fine-Tuning

**Status:** ✅ Complete  
**Type:** Research: Open Source AI Models & Fine-Tuning  
**Completed:** 2026-03-20

---

## Executive Summary

The open-source AI ecosystem has undergone a revolution. Meta's LLaMA family, Mistral's models, DeepSeek's R1, and hundreds of specialized fine-tunes have collectively closed most of the capability gap with proprietary models for the majority of practical applications. The key strategic insight is: **fine-tuning on domain-specific data can make an open-source model outperform GPT-4 at specific tasks for a fraction of the cost**. This has profound implications for enterprise AI strategy: you don't always need the biggest, most expensive model — you need the right model for your specific use case, trained on your specific data.

---

## The Open-Source Model Landscape (March 2026)

### Tier 1: Frontier Open Models
| Model | Provider | Strengths | Best For |
|-------|----------|-----------|---------|
| Llama 4 (Scorpion/Maverick) | Meta | Top-tier reasoning, multi-modal, open weights | General purpose, foundation for fine-tuning |
| Mistral Large 2 | Mistral AI | Strong reasoning, excellent French/German/code, commercial license | European enterprise, code-heavy tasks |
| DeepSeek R1 | DeepSeek | Chain-of-thought reasoning, extremely efficient | Reasoning-heavy tasks, cost-sensitive |
| Qwen 2.5 (72B/110B) | Alibaba | Strong Chinese language, code, mathematics | Multi-lingual, Chinese market |
| Gemma 3 (27B) | Google | On-device capable, multi-modal, open weights | Consumer apps, on-device AI |
| Command R+ (104B) | Cohere | RAG-optimized, enterprise, multi-lingual | Enterprise RAG applications |

### Tier 2: Efficient Models (Good Enough + Cheap)
| Model | Size | Strengths | Deployment |
|-------|------|-----------|-----------|
| Llama 3.1 8B | 8B | Fast, cheap, good for instruction following | High-volume, simple tasks |
| Mistral Nemo | 12B | Balanced capability + speed | General purpose |
| Phi-4 (14B) | 14B | Microsoft quality, synthetic data trained | Reasoning,STEM |
| Qwen 2.5 7B | 7B | Excellent Chinese + code, fast | Mobile, edge deployment |
| DeepSeek R1 Distill (1.5B-7B) | 1.5B-7B | COT reasoning distilled into small models | Very cheap deployment |

### Key Trend: The "Small but Mighty" Phenomenon
Models trained on high-quality synthetic data (Microsoft's Phi series being the prototype) are dramatically smaller than frontier models but achieve competitive performance on specific benchmarks. This has made on-device AI feasible:
- **iOS**: Apple Intelligence uses on-device 3B parameter models for many tasks
- **Android**: Google's on-device models (Gemma 3B) for Pixel devices
- **Laptops**: Ollama, LM Studio make running 7-13B models locally practical on MacBooks

---

## Fine-Tuning Methods

### 1. SFT (Supervised Fine-Tuning)
The foundational method: continue training a pretrained model on a curated dataset of (input, output) examples.

**When to use**: You have high-quality examples of the behavior you want.
**Cost**: Moderate (1-10 A100 hours for 7B models)
**Key techniques**:
- Dataset quality matters more than size
- 1K-10K high-quality examples often sufficient
- Overfitting is the primary risk

### 2. RLHF (Reinforcement Learning from Human Feedback)
Train a reward model from human preference data, then optimize the policy against it using PPO or DPO.

**When to use**: You need to align model behavior to human preferences (helpfulness, harmlessness, honesty)
**Cost**: Expensive (requires human labelers for preference data)
**Key techniques**:
- DPO (Direct Preference Optimization): Simplifies RLHF, no separate reward model needed
- KTO (Kahneman-Tversky Optimization): Anthropic's alternative to DPO

### 3. LoRA (Low-Rank Adaptation) — The Dominant Method
Instead of fine-tuning all weights, add small trainable adapter matrices to existing layers. Keeps base model frozen, trains only 0.1-5% of parameters.

**Why it dominates**:
- **Cheap**: 1-2 A100 hours vs. full fine-tune
- **Modular**: Different LoRA adapters for different tasks, swapped at inference
- **Composability**: Stack multiple LoRAs for multi-skill agents
- **Popular frameworks**: Axolotl, LLaMA Factory, PEFT (HuggingFace)

**Rank (r) selection**: Higher r = more capacity, more compute. r=8 for subtle style transfer, r=64 for complex task learning.

### 4. QLoRA (Quantized LoRA)
Quantize the frozen base model to 4-bit (or 8-bit), then apply LoRA to the quantized weights. Enables fine-tuning a 65B model on a single 48GB A100.

**Key libraries**: BitsAndBytes (quantization), Guanaco dataset (QA fine-tune benchmark)

### 5. RAG vs. Fine-Tuning
The key strategic question:

| Use Case | Approach |
|----------|---------|
| Need up-to-date information | RAG (Retrieval-Augmented Generation) |
| Need specific format/structure | Fine-tuning |
| Need to learn new terminology | Fine-tuning |
| Need reasoning style adaptation | Fine-tuning |
| Cost-sensitive with changing data | RAG |
| Low training data volume | RAG + prompt engineering |

**Most production systems use both**: RAG for up-to-date knowledge + fine-tuned model for domain reasoning style.

---

## Production Fine-Tuning Patterns

### Pattern 1: Domain Fine-Tune for Enterprise
```
Base: Llama 3.1 70B
+ Fine-tune on: Company internal documents, support tickets, emails
= Custom model that understands company context + terminology
Deploy via: VLLM inference server or llama.cpp (local)
```

### Pattern 2: Task-Specific Expert Models
```
Base: Llama 3.1 8B
+ Fine-tune on: 5K medical Q&A examples
= Medical expert model for that specific task
Deploy via: On-device for privacy-sensitive applications
```

### Pattern 3: Multi-LoRA Composition
```
Base: Llama 3.1 70B (frozen)
LoRA A: Medical reasoning
LoRA B: Patient communication style
LoRA C: Medical coding (ICD-10, CPT)
Inference: Compose A+B+C simultaneously → Expert medical agent
```

### Pattern 4: Distillation + Quantization
```
DeepSeek R1 (large) → 
Generate reasoning chains on domain data →
Distill into Phi-4-14B →
Quantize to 4-bit →
Deploy locally for cheap inference with R1-like reasoning
```

---

## Specialized Fine-Tune Datasets

| Dataset | Task | Size | Notes |
|---------|------|------|-------|
| Magicoder-Evol-Instruct | Code generation | 110K | Improves coding ability |
| Orca-2 (Microsoft) | Reasoning | 88K | Teaches step-by-step reasoning |
| MetaMath | Math reasoning | 395K | Math-specific LoRA fine-tune |
| Dolphin (Cognitive Computations) | Generalist | 6M | Highly capable but unfiltered |
| NousResearch datasets | Various | Various | Hermes, Hermes-2 variants |
| DeepSearch | RAG + reasoning | Synthetic | Excellent for search tasks |

---

## Inference Infrastructure

### Open-Source Inference Servers
| Server | Engine | Speed (tokens/s/A100) | Key Feature |
|--------|--------|----------------------|-------------|
| vLLM | PagedAttention | ~3000+ | Best throughput, continuous batching |
| llama.cpp | Quantized (GGUF) | ~50-100/s (7B) | CPU/metal, no GPU needed |
| TensorRT-LLM | NVIDIA-optimized | ~2000+ | Best NVIDIA GPU perf |
| Ollama | Simplified local | Variable | Easy local deployment |
| LM Studio | GUI + API | Variable | Consumer-friendly |

### Cost Comparison (per 1M tokens)
| Model | Cost |
|-------|------|
| GPT-4o | ~$5 |
| Claude 3.5 Sonnet | ~$3 |
| Llama 3.1 70B (self-hosted, A100) | ~$0.20-0.50 |
| Llama 3.1 8B (self-hosted) | ~$0.02-0.05 |
| DeepSeek R1 Distill 7B | ~$0.01 |

**Strategic implication**: For high-volume applications, self-hosted fine-tuned open models can be 50-500x cheaper than frontier API models.

---

## Key Resources
- HuggingFace Model Hub (model weights, datasets, fine-tuning guides)
- LLaMA Factory (GitHub) — popular fine-tuning framework
- Axolotl (GitHub) — production fine-tuning toolkit
- DeepSeek R1 technical report (excellent reasoning analysis)
- "The Llama 3 Herd of Models" (Meta technical report)
- Weights & Biases LLM course (fine-tuning practical guide)
- PEFT library documentation (HuggingFace)
