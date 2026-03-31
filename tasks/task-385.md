# Task 385: Explore Local LLMs & Edge AI

**Status:** ⏳ Pending  
**Type:** Research — Curiosity  
**Priority:** LOW  

## Overview
Running large language models locally or on edge devices — privacy, cost, and capability implications.

## Research Questions
- State of local LLMs: Llama 3, Mistral, Phi-3, Gemma — capabilities vs. GPT-4
- Tooling: Ollama, LM Studio, llama.cpp, exllamav2, GPTQ, AWQ quantization
- What can run on consumer hardware? MacBook M-series, consumer GPUs
- Privacy benefits: data never leaves the device
- Edge AI: running models on mobile/IoT devices
- Performance optimization: quantization, distillation, speculative decoding
- Tradeoffs: quality vs. privacy vs. cost

## Key Technologies
- Ollama, LM Studio, text-generation-webui
- llama.cpp, exllamav2, GPTQ, AWQ
- Mobile: MLX (Apple Silicon), TensorFlow Lite, ONNX Runtime
- Self-hosted alternatives: vLLM, TGI

## Deliverable
Write research doc at `docs/local-llms-edge-ai.md` covering the landscape, tooling, tradeoffs, and when to choose local vs. API-based.
