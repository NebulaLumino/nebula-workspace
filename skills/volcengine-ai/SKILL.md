---
name: volcengine-ai
description: Unified ByteDance AI services via MixedCloud - LLM chat, image generation (Seedream), and video generation (Seedance)
metadata:
  {
    "openclaw":
      {
        "requires":
          {
            "env": ["MIXEDCLOUD_API_KEY"],
            "bins": ["python3"],
            "pip": ["requests"],
          },
        "install": [],
      },
  }
---

# Volcengine AI Unified (MixedCloud)

Unified interface for ByteDance's AI services via MixedCloud API: Doubao LLM, Seedream image generation, and Seedance video generation.

## Setup

1. API key stored in 1Password: **"MixedCloud API - Seedream/Seedance"**
2. Or set environment variable:
   ```bash
   export MIXEDCLOUD_API_KEY="sk-QUFw4BtmoziqWlpy6ZlUuTDC8IUgNS0uKb6LIXrFs7M1MVy7"
   ```

## Usage

### Chat with Doubao LLM

```bash
python ai.py chat "What is artificial intelligence?"
python ai.py chat "Explain quantum computing" --model doubao-seed-2-0-pro-260215
python ai.py chat -i  # Interactive mode
```

### Generate Image (Seedream)

```bash
python ai.py image "A cute orange cat sitting on a windowsill"
python ai.py image "A futuristic city at sunset" --aspect-ratio 16:9 --download
```

### Generate Video (Seedance)

```bash
python ai.py video "A wave crashing on the beach"
python ai.py video "Drone view of mountains" --duration 5 --download
```

### Health Check

```bash
python ai.py health
```

### List Models

```bash
python ai.py models
```

## Commands

| Command | Description |
|---------|-------------|
| `chat` | Chat with Doubao LLM |
| `image` | Generate image with Seedream |
| `video` | Generate video with Seedance |
| `health` | Test all API connections |
| `models` | List available models |

## Options

### Chat Options

| Flag | Description | Default |
|------|-------------|---------|
| `--model`, `-m` | LLM model to use | doubao-seed-2-0-pro-260215 |
| `--system`, `-s` | System prompt | - |
| `--temperature`, `-t` | Temperature (0-2) | 0.7 |
| `--max-tokens` | Max tokens | 4096 |
| `--stream` | Enable streaming | false |
| `--interactive`, `-i` | Interactive chat mode | false |

### Image Options

| Flag | Description | Default |
|------|-------------|---------|
| `--model` | Seedream model | doubao-seedream-5-0-260128 |
| `--aspect-ratio` | Image ratio | 1:1 |
| `--size` | Image size | 1920x1920 |
| `--download` | Auto-download image | false |

### Video Options

| Flag | Description | Default |
|------|-------------|---------|
| `--model` | Seedance model | doubao-seedance-1-5-pro-251215 |
| `--duration` | Duration in seconds | 5 |
| `--download` | Auto-download video | false |

## Available Models

### LLM (Doubao)

| Model | Context | Description |
|-------|---------|-------------|
| `doubao-seed-2-0-pro-260215` | 200K | Latest flagship, best quality |
| `doubao-seed-2-0-lite-260215` | 200K | Fast version, lower cost |
| `doubao-seed-1-6-flash-250828` | 128K | Fast and efficient |
| `doubao-1-5-pro-32k-250115` | 32K | Pro version with 32K context |

### Image (Seedream)

| Model | Description |
|-------|-------------|
| `doubao-seedream-5-0-260128` | Latest Seedream 5.0 |
| `doubao-seedream-4-5-251128` | Seedream 4.5 |

### Video (Seedance)

| Model | Description |
|-------|-------------|
| `doubao-seedance-1-5-pro-251215` | Seedance 1.5 Pro |
| `doubao-seedance-1-0-pro-250528` | Seedance 1.0 Pro |

## Features

- [x] Unified CLI for all ByteDance AI services
- [x] LLM chat completion with streaming
- [x] Image generation (Seedream)
- [x] Video generation (Seedance)
- [x] Health check for all APIs
- [x] Interactive chat mode
- [x] Model listing
- [x] Auto-download media files
- [x] Skill logging integration

## Note

- Uses same API key as Seedream/Seedance
- API key is configured for 火山折扣渠道 (Volcengine Discount Channel)
- Key stored in 1Password - only use for ByteDance AI services