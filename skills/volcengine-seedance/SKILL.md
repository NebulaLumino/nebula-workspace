---
name: volcengine-seedance
description: Generate videos using ByteDance Seedance models via MixedCloud API
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

# Volcengine Seedance Video Generation (MixedCloud)

Generate videos using ByteDance's Seedance models via MixedCloud API.

## Setup

1. API key is stored in 1Password: **"MixedCloud API - Seedream/Seedance"**
2. Or set environment variable:
   ```bash
   export MIXEDCLOUD_API_KEY="sk-QUFw4BtmoziqWlpy6ZlUuTDC8IUgNS0uKb6LIXrFs7M1MVy7"
   ```

## Usage

### Text-to-Video

Generate a video from a text prompt:
```bash
python seedance.py "一只猫在草地上奔跑"
python seedance.py "a cat running on grass field" --duration 10
```

### Image-to-Video

Animate an image:
```bash
python seedance.py "waves crashing" --reference https://example.com/image.jpg
```

### Auto-Download

Automatically download completed video:
```bash
python seedance.py "landscape" --download
```

## Options

| Flag | Description | Default |
|------|-------------|---------|
| `--model` | Model to use | doubao-seedance-1-5-pro-251215 |
| `--duration` | Duration (5-12 seconds) | 5 |
| `--resolution` | Resolution (480p, 720p) | 720p |
| `--reference` | Reference image URL | - |
| `--download, -d` | Auto-download video | false |
| `--timeout` | Max wait time (seconds) | 180 |

## Supported Models

- **doubao-seedance-1-5-pro-251215** (default) - High quality, up to 720p
- **doubao-seedance-1-0-pro-250528** - Previous version

## Features

- [x] Basic video generation
- [x] Image-to-video (--reference)
- [x] Auto-download (--download)
- [x] Graceful shutdown handling
- [x] Progress tracking during polling
- [x] Customizable timeout

## Note

- Video generation is asynchronous - script polls for completion
- API key is configured for 火山折扣渠道 (Volcengine Discount Channel)
- Key stored in 1Password - only use for Seedream/Seedance
