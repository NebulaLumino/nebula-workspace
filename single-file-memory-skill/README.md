# Single-File Agent Memory Skill

**Ultra-low latency, zero-infrastructure memory for AI agents**

## Why This Project?

After analyzing 582+ AI project ideas from the NebulaLumino project-ideas-collection, I chose to build the **Single-File Agent Memory Skill** because:

1. **Lowest implementation complexity** (2/5) - Build in 1-2 weeks
2. **Universal market need** - Every AI agent needs memory
3. **Superior technical performance** - 0.025ms latency vs 100ms+ for RAG
4. **Zero infrastructure cost** - Single file vs vector databases
5. **Strong revenue potential** - Multiple monetization tiers

## Quick Start

```bash
# Install memvid-cli
cargo install memvid-cli

# Create memory
memvid create my-agent.mv2

# Add content
echo "Project requirements: Build a weather app" | memvid put my-agent.mv2 --input -

# Search
memvid find my-agent.mv2 --query "weather"

# Ask questions
memvid ask my-agent.mv2 --query "What are the project requirements?"
```

## Features

- 🚀 **Ultra-low latency**: 0.025ms P50, 0.075ms P99
- 📦 **Single file**: .mv2 format - works offline, anywhere
- 🔒 **Crash-safe**: Committed, immutable frames
- 🌐 **Multi-modal**: Text, images, audio in one file
- 📈 **SOTA performance**: +35% on LoCoMo benchmark

## Architecture

```
┌─────────────────────────────────────────┐
│           Agent Application             │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│       Single-File Memory (.mv2)        │
│  ┌─────────────────────────────────┐   │
│  │ Memory Frames (append-only)     │   │
│  │ - Text content                  │   │
│  │ - Embeddings (BM25 + HNSW)     │   │
│  │ - Metadata (title, tags)        │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

## Performance Comparison

| Metric | Memvid | Traditional RAG |
|--------|--------|-----------------|
| Latency P50 | 0.025ms | ~100ms |
| Latency P99 | 0.075ms | ~500ms |
| Throughput | 1,372× | Baseline |
| Infrastructure | Zero | Vector DB + servers |
| Portability | Single file | Multi-service |

## Monetization

- **Open-core**: Basic memory (free)
- **Pro ($29/mo)**: Timeline analytics, advanced search
- **Enterprise ($499/mo)**: Encrypted capsules, compliance
- **Cloud ($99/mo)**: Hosted memory service

## Files

- `src/lib.rs` - Rust core library
- `python/memvid_skill.py` - Python wrapper
- `skill.yaml` - OpenClaw skill configuration
- `BUSINESS_PLAN.md` - Detailed business plan

## License

Apache 2.0
