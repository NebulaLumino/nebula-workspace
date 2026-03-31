---
name: volcengine-seedream
description: Generate images using ByteDance Seedream models via MixedCloud API
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

# Volcengine Seedream Image Generation (MixedCloud)

Generate images using ByteDance's Seedream models via MixedCloud API.

## Setup

1. API key is stored in 1Password: **"MixedCloud API - Seedream/Seedance"**
2. Or set environment variable:
   ```bash
   export MIXEDCLOUD_API_KEY="sk-QUFw4BtmoziqWlpy6ZlUuTDC8IUgNS0uKb6LIXrFs7M1MVy7"
   ```

## Usage

### Text-to-Image (Single)

Generate an image from a text prompt:
```
生图：一只可爱的小猫
```

Or in English:
```
Generate an image: a cute kitten sitting on a grass field
```

### Batch Generation

Generate multiple images at once:
```bash
python seedream.py "a cat" --count 4
python seedream.py "landscape" --count 9 --download
```

### Auto-Download

Automatically download generated images:
```bash
python seedream.py "sunset" --download
```

### Parameters

- **Size**: 2048x2048, 2048x1024, 1024x2048 (minimum 3686400 pixels)
- **Model**: doubao-seedream-5-0-260128, doubao-seedream-4-5-251128
- **Count**: 1-15 images per request
- **Seed**: Optional seed for reproducible results

### Examples

```bash
# Basic
python seedream.py "一只可爱的小猫"

# With size
python seedream.py "赛博朋克城市，尺寸：2048x2048"

# Batch with download
python seedream.py "cat" --count 4 --download

# With seed for reproducibility
python seedream.py "landscape" --count 9 --seed 42
```

## Supported Models

- **doubao-seedream-5-0-260128** (default) - Latest version, best quality
- **doubao-seedream-4-5-251128** - Previous version

## Features

- [x] Basic image generation
- [x] Batch generation (up to 15 images)
- [x] Auto-download
- [x] Seed parameter for reproducibility
- [ ] Image-to-image editing
- [ ] Progress tracking

## Note

- Minimum image size is 3,686,400 pixels (e.g., 2048x2048)
- API key is configured for 火山折扣渠道 (Volcengine Discount Channel)
- Key stored in 1Password - only use for Seedream/Seedance
