---
name: volcengine-llm
description: Chat with ByteDance Doubao LLM models via MixedCloud API
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

# Volcengine Doubao LLM Chat (MixedCloud)

Chat with ByteDance's Doubao LLM models via MixedCloud API.

## Setup

1. API key is stored in 1Password: **"MixedCloud API - Seedream/Seedance"**
2. Or set environment variable:
   ```bash
   export MIXEDCLOUD_API_KEY="sk-QUFw4BtmoziqWlpy6ZlUuTDC8IUgNS0uKb6LIXrFs7M1MVy7"
   ```

## Usage

### Single Prompt

```bash
python chat.py "What is artificial intelligence?"
python chat.py "Explain quantum computing" --model doubao-seed-2-0-lite-260215
```

### Interactive Mode

```bash
python chat.py -i
```

### Options

| Flag | Description | Default |
|------|-------------|---------|
| `--model`, `-m` | Model to use | doubao-seed-2-0-pro-260215 |
| `--system`, `-s` | System prompt | - |
| `--temperature`, `-t` | Temperature (0-2) | 0.7 |
| `--max-tokens` | Max tokens | 4096 |
| `--stream` | Enable streaming | false |
| `--interactive`, `-i` | Interactive chat mode | false |
| `--list-models` | List available models | false |

## Available Models

| Model | Context | Description |
|-------|---------|-------------|
| `doubao-seed-2-0-pro-260215` | 200K | Latest flagship, best quality |
| `doubao-seed-2-0-lite-260215` | 200K | Fast version, lower cost |
| `doubao-seed-1-6-flash-250828` | 128K | Fast and efficient |
| `doubao-1-5-pro-32k-250115` | 32K | Pro version with 32K context |

## Features

- [x] Chat completion
- [x] Streaming support
- [x] Interactive mode
- [x] Multiple model support
- [x] System prompt support
- [x] Token usage tracking

## Note

- Uses same API key as Seedream/Seedance
- API key is configured for 火山折扣渠道 (Volcengine Discount Channel)
- Key stored in 1Password - only use for Seedream/Seedance/Doubao
