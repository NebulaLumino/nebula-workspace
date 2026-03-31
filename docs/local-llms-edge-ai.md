# Local LLMs & Edge AI

*Research document — Task 385 | Cycle 14 Curiosity | 2026-03-21*

---

## Why Run Locally?

Three words: **privacy, cost, latency.**

- **Privacy**: Your data never leaves your machine. No API, no server logs, no third-party access.
- **Cost**: Free after hardware investment. No per-token billing.
- **Latency**: Local inference can be faster than round-tripping to an API (especially with optimized inference).

The tradeoff is capability — local models are smaller and less powerful than GPT-4/Claude. But the gap is closing fast.

---

## The Model Landscape (2026)

### Consumer Hardware Capable Models

| Model | Size | What it can do | Hardware |
|-------|------|---------------|----------|
| **Llama 3.1 70B** | 70B params | Near-GPT-4 level for most tasks | 1x RTX 4090 (FP16) or M2 Ultra |
| **Llama 3.1 8B** | 8B | Solid general assistant | MacBook M1+ (32GB), or CPU |
| **Mistral 7B** | 7B | Excellent coding, efficient | MacBook M1+ (16GB), RTX 3060 |
| **Phi-3 Medium** | 14B | Strong reasoning, small | M2 Mac (24GB+), single GPU |
| **Gemma 2 9B** | 9B | Good all-around, Google's best open | M1 Mac, RTX 3070 |
| **DeepSeek Coder 6.7B** | 6.7B | Coding specialist, very capable | M1 Mac (16GB), single GPU |
| **Qwen 2.5 7B** | 7B | Multilingual, good reasoning | M1 Mac, RTX 3060 |

### Specialized Models

- **Code**: DeepSeek Coder 6.7B, CodeLlama 34B, StarCoder 2 15B
- **Math**: WizardMath 70B, MetaMath Mistral 7B
- **Instruction following**: Llama 3.1 Instruct, Mistral Instruct, Zephyr 7B
- **Multimodal**: LLaVA (vision + language), Granite Vision

---

## Key Tooling

### Inference Engines

| Engine | What it's good at | Platform |
|--------|------------------|----------|
| **Ollama** | Easiest local LLM runner, Mac-first | macOS, Linux, Windows |
| **LM Studio** | Beautiful UI + powerful CLI | macOS, Windows, Linux |
| **llama.cpp** | Raw, fast, quantization-focused | All (C/C++) |
| **exllamav2** | Fast inference on consumer GPUs (4-bit/8-bit) | Linux, WSL |
| **GPTQ / AWQ** | Quantization formats for low-VRAM inference | GPU-focused |
| **vLLM** | High-throughput serving, best for production | Linux |
| **MLX** (Apple Silicon) | Apple's optimized inference framework | M-series Macs |
| **llamafile** | Single-file executable, zero-install | All platforms |

### Ollama — The Easiest Path

```bash
# Install: curl -fsSL https://ollama.com/install.sh | sh
ollama pull llama3.1          # Downloads ~4.9GB
ollama run llama3.1          # Start chatting
ollama pull codellama         # Code-specialized model
ollama run codellama "write a React component"
```

### LM Studio — GUI + Server

Has a clean desktop app with:
- Model download management
- Local inference server (OpenAI-compatible API)
- Chat UI
- GPU offloading controls

### MLX — Apple Silicon Native

```python
# Using the mlx-lm Python package
from mlx_lm import load, generate
model, tokenizer = load("mlx-community/Llama-3.1-8B-Instruct-4bit")
response = generate(model, tokenizer, prompt="...")
```

Significantly more efficient than CPU inference on M-chips.

---

## Quantization: How Size = Quality Tradeoff Works

LLMs come in full precision (FP32 = 32-bit, FP16 = 16-bit). Quantization reduces precision to fit larger models on smaller hardware:

| Format | Size reduction | Quality loss | Use case |
|--------|---------------|--------------|----------|
| **FP16** | 1x (baseline) | None | High-quality, needs 2x VRAM |
| **INT8** | 2x smaller | Minimal | Single GPU |
| **GPTQ 4-bit** | 4x smaller | Moderate | Consumer GPU |
| **AWQ 4-bit** | 4x smaller | Less loss than GPTQ | Consumer GPU |
| **GGUF (Q4_K_M)** | ~4.5x smaller | Noticeable but usable | CPU or low-VRAM |

Rule of thumb: **Q4_K_M** is usually the best balance of size/quality for 4-bit quantization.

---

## What Can Actually Run Where

### MacBook M1/M2/M3 (unified memory)
- **8GB RAM**: 3B-4B models at Q4, basic tasks only
- **16GB RAM**: 7B-13B models at Q4, good for coding and writing
- **24GB RAM**: 13B-30B at Q4, or 7B at FP16
- **32GB+**: 30B+ models, or multiple models simultaneously

### Gaming/Consumer GPU (NVIDIA)
- **RTX 3060 (12GB)**: 13B at Q4, 7B at FP16
- **RTX 4090 (24GB)**: 70B at Q4, 30B at FP16
- **RTX 3090 (24GB)**: Same as 4090

### CPU-only
- Ollama with CPU: 7B Q4 at ~10-15 tokens/sec on modern CPU
- Barely usable for casual tasks, too slow for serious work

---

## Open Source vs. API: The Real Tradeoff

### When Local Wins

- **Privacy-sensitive data**: Medical, legal, personal content
- **High-volume, low-stakes tasks**: Batch processing, content classification
- **Offline**: No internet, travel, remote work
- **Cost control**: Predictable hardware cost vs. variable API billing
- **Customization**: Fine-tune on your own data without sharing it

### When API Wins

- **Best-in-class capability**: GPT-4o, Claude 3.5 still ahead for hard reasoning
- **Multimodal**: Best vision/video/audio models still API-only for now
- **Large context windows**: Local models typically limited to 8K-32K
- **Fast iteration**: No hardware to maintain or optimize
- **Reliability**: No local resource contention or crashes

### The Middle Path

**Local small model + API large model**:
- Use local (7B) for fast, privacy-safe tasks
- Escalate to API (GPT-4) for hard problems
- Combine outputs, verify locally

Many tools now do this (e.g., continue.dev IDE plugin).

---

## Fine-Tuning Locally

Why fine-tune? A 7B model fine-tuned on your data can outperform GPT-4 on your specific domain.

### Key Techniques

| Technique | What it does | Dataset size needed |
|-----------|-------------|-------------------|
| **LoRA** | Low-rank adapters, freezes base model | 100-10K examples |
| **QLoRA** | LoRA on quantized base model | 100-10K examples |
| **Full fine-tune** | Updates all weights | 10K+ examples |
| **DPO** | Direct preference optimization | Pairs of preferred/rejected outputs |

### Tooling

- **Axolotl**: Most popular fine-tuning toolkit (supports most model types)
- **LLaMA Factory**: GUI + CLI, easy for common use cases
- **Unsloth**: 2x faster fine-tuning, open source, supports Llama/Mistral
- **Orca**: Synthetic data generation for fine-tuning

**Example** (Unsloth):
```python
from unsloth import FastLanguageModel
model, tokenizer = FastLanguageModel.from_pretrained(
    model_name="unsloth/llama-3.1-8b-bnb-4bit"
)
model = FastLanguageModel.get_peft_model(model, r=16, lora_alpha=16)
# Then train with standard HuggingFace trainer
```

---

## Edge AI: Beyond the Desktop

Running models on edge devices (phones, IoT, embedded):

### Mobile
- **Core ML** (iOS): Apple's framework for on-device ML, including LLM inference on iPhone
- **Google's ML Kit / MediaPipe**: On-device inference for Android
- **Quantized models**: A 3B Q4 model can run on a modern smartphone

### Embedded / IoT
- **TensorFlow Lite**: Edge deployment for simple models
- **ONNX Runtime**: Cross-platform inference
- **TinyML**: Microcontroller-scale models (<1MB)

### What's Actually Running on Edge Today
- Keyword spotting ("Hey Siri")
- On-device translation (Google Translate offline)
- Camera scene recognition
- Predictive keyboard

**Full LLM on edge**: Emerging. Google's Pixel 9 runs a small Gemini Nano on-device. Apple is investing heavily here. Full GPT-4 class on your phone is still 2-4 years away realistically.

---

## The Privacy Calculus

Local LLMs make privacy easier to reason about:

**API model**: You send data → server processes → you receive response. What happens to your data? Depends on the company's policy, employees, subpoenas, data breaches.

**Local model**: Data never leaves your device. No one can see it. No logs, no training, no third parties.

**The remaining attack surface**:
- Model weights are on your machine (if they're sensitive, can they be extracted?)
- Vector DB or files you search might contain sensitive data
- If model is fine-tuned on private data, could it regurgitate?

For most users: local is meaningfully more private than API. For high-stakes threat models, even local has gaps.

---

## The Next 2-3 Years

- **Llama 4+** will likely match GPT-4 at smaller sizes (7B-13B)
- **MLX** makes Apple Silicon the best consumer platform for local AI
- **Inference optimization** (speculative decoding, batching, flash attention) makes local faster
- **Fine-tuning** becomes accessible to non-ML engineers
- **Edge deployment** becomes viable for 7B+ models on phones

The era of "free, private, offline AI" is arriving faster than most people realize.

---

## Resources

- [Ollama](https://ollama.com/) — Easiest local LLM runner
- [LM Studio](https://lmstudio.ai/) — GUI + local server
- [The Bloke's Quantizations](https://huggingface.co/TheBloke) — Massive collection of quantized models
- [Unsloth](https://unsloth.ai/) — Fast fine-tuning
- [mlx-lm](https://github.com/ml-explore/mlx-examples/tree/main/llm) — Apple's MLX for LLaMA/Mistral
- [LocalAI](https://localai.io/) — Self-hosted API for local models

---

*Curiosity docs: 381 ✅, 382 ✅, 383 ✅, 384 ✅, 385 ✅*
