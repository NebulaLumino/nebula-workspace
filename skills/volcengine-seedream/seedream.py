#!/usr/bin/env python3
"""
Volcengine Seedream Image Generation via MixedCloud API
Generates images using ByteDance Seedream models
"""

import os
import sys
import json
import requests
import argparse
import re
import urllib.parse
from datetime import datetime

# Import skill logging if available
try:
    sys.path.insert(0, os.path.expanduser("~/.openclaw/workspace/scripts"))
    from skill_logging import get_logger, log_execution
    LOGGING_ENABLED = True
except ImportError:
    LOGGING_ENABLED = False

# Initialize logger if available
if LOGGING_ENABLED:
    logger = get_logger("volcengine-seedream")
    logger.info("Seedream skill initialized")

# MixedCloud API endpoint (Volcengine Discount Channel - 火山折扣渠道)
API_ENDPOINT = "https://models.mixedcloud.cn/v1/images/generations"

# Default API key - set via environment variable or use the one from 1Password
# Get from 1Password: op item get "MixedCloud API - Seedream/Seedance" --reveal
DEFAULT_API_KEY = "sk-QUFw4BtmoziqWlpy6ZlUuTDC8IUgNS0uKb6LIXrFs7M1MVy7"

def parse_prompt(text):
    """Parse the user's prompt and extract parameters."""
    # Remove common prefixes
    text = re.sub(r'^(生图：|Generate an image：|Generate an image:)\s*', '', text.strip(), flags=re.IGNORECASE)
    
    # Extract size if present
    size = "2048x2048"  # default (minimum for this API is 3686400 pixels)
    size_match = re.search(r'尺寸[：:]?\s*(\d+x\d+)', text)
    if size_match:
        size = size_match.group(1)
        text = re.sub(r'尺寸[：:]?\s*\d+x\d+', '', text)
    
    # Extract model if present
    model = "doubao-seedream-5-0-260128"  # default
    model_match = re.search(r'模型[：:]?\s*([\w-]+)', text)
    if model_match:
        model = model_match.group(1)
        text = re.sub(r'模型[：:]?\s*[\w-]+', '', text)
    
    # Clean up the prompt
    prompt = text.strip()
    
    return prompt, model, size

def download_image(url, filename=None):
    """Download image from URL to file."""
    try:
        response = requests.get(url, timeout=60)
        if response.status_code == 200:
            # Generate filename from URL if not provided
            if not filename:
                parsed = urllib.parse.urlparse(url)
                path = parsed.path
                filename = os.path.basename(path)
                if not filename or '.' not in filename:
                    filename = "image.png"
            
            with open(filename, 'wb') as f:
                f.write(response.content)
            print(f"✅ Downloaded: {filename}")
            return filename
        else:
            print(f"⚠️ Download failed: HTTP {response.status_code}")
            return None
    except Exception as e:
        print(f"⚠️ Download error: {e}")
        return None


def encode_image(image_path):
    """Encode image file to base64."""
    import base64
    with open(image_path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")


def edit_image(source_image, prompt, model="doubao-seedream-5-0-260128", size="2048x2048", count=1, download=False, strength=0.7):
    """
    Edit an image using Seedream API (image-to-image).
    
    Args:
        source_image: Path to source image file
        prompt: Text prompt describing desired edits
        model: Model to use
        size: Output image size
        count: Number of images to generate
        download: Whether to download result
        strength: Transformation strength (0.0-1.0)
    """
    import base64
    
    api_key = os.environ.get("MIXEDCLOUD_API_KEY", DEFAULT_API_KEY)
    
    # Encode source image
    try:
        source_b64 = encode_image(source_image)
    except Exception as e:
        print(f"Error reading source image: {e}")
        sys.exit(1)
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    # Build request - Seedream API uses "image" parameter for source
    payload = {
        "model": model,
        "prompt": prompt,
        "image": source_b64,  # Base64 encoded source image
        "strength": strength,  # Control transformation amount
        "num_images": min(count, 15),
    }
    
    # Add size if specified
    if size:
        width, height = size.split("x")
        payload["width"] = int(width)
        payload["height"] = int(height)
    
    print(f"🎨 Editing image: {source_image}")
    print(f"   Prompt: {prompt}")
    print(f"   Model: {model}")
    print(f"   Strength: {strength}")
    
    try:
        response = requests.post(API_ENDPOINT, headers=headers, json=payload, timeout=120)
        result = response.json()
        
        if "data" in result and result["data"]:
            image_urls = []
            for i, img_data in enumerate(result["data"]):
                image_url = img_data.get("url")
                if image_url:
                    print(f"✅ Image {i+1}: {image_url}")
                    if download:
                        filename = f"edited_image_{i+1}.png"
                        downloaded = download_image(image_url, filename)
                        if downloaded:
                            print(f"   Saved: {downloaded}")
                    image_urls.append(image_url)
            return image_urls
        else:
            print(f"Error: {result.get('error', {}).get('message', 'Unknown error')}")
            return []
    
    except Exception as e:
        print(f"Error: {e}")
        return []


def generate_images(prompt, model="doubao-seedream-5-0-260128", size="2048x2048", count=1, download=False, seed=None):
    """Generate one or more images using the MixedCloud Seedream API."""
    
    # API key from environment or default (1Password: "MixedCloud API - Seedream/Seedance")
    api_key = os.environ.get("MIXEDCLOUD_API_KEY") or DEFAULT_API_KEY
    
    if not api_key:
        print("Error: MIXEDCLOUD_API_KEY environment variable not set")
        print("Please set it with: export MIXEDCLOUD_API_KEY='your-api-key'")
        sys.exit(1)
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    # Build payload
    payload = {
        "model": model,
        "prompt": prompt,
        "size": size,
        "response_format": "url",
        "max_images": min(count, 15)  # API limit is 15
    }
    
    # Add seed if provided for reproducible results
    if seed is not None:
        payload["seed"] = seed
    
    print(f"Generating {count} image(s)...")
    print(f"Prompt: {prompt}")
    print(f"Model: {model}")
    print(f"Size: {size}")
    if seed is not None:
        print(f"Seed: {seed}")
    print()
    
    try:
        response = requests.post(API_ENDPOINT, headers=headers, json=payload, timeout=120)
        
        if response.status_code != 200:
            print(f"Error: API returned status {response.status_code}")
            print(f"Response: {response.text}")
            sys.exit(1)
        
        result = response.json()
        
        # Parse the response (MixedCloud format)
        if "data" in result and len(result["data"]) > 0:
            image_urls = []
            for i, img_data in enumerate(result["data"]):
                image_url = img_data.get("url")
                if image_url:
                    image_urls.append(image_url)
                    print(f"✅ Image {i+1} generated!")
                    print(f"   URL: {image_url}")
                    
                    # Download if requested
                    if download:
                        filename = f"image_{i+1}.png"
                        downloaded = download_image(image_url, filename)
                        if downloaded:
                            print(f"   Saved: {downloaded}")
                    print()
                else:
                    # Try alternative format
                    b64_json = img_data.get("b64_json")
                    if b64_json:
                        import base64
                        img_data_decoded = base64.b64decode(b64_json)
                        filename = f"image_{i+1}.png"
                        with open(filename, "wb") as f:
                            f.write(img_data_decoded)
                        print(f"✅ Image {i+1} generated and saved to {filename}")
                        image_urls.append(filename)
            
            return image_urls
        else:
            print("Error: Unexpected response format")
            print(json.dumps(result, indent=2))
            sys.exit(1)
            
    except requests.exceptions.Timeout:
        print("Error: Request timed out")
        sys.exit(1)
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        sys.exit(1)


# Keep backwards compatibility with single image function
def generate_image(prompt, model="doubao-seedream-5-0-260128", size="2048x2048"):
    """Generate an image using the MixedCloud Seedream API. (Legacy single-image function)"""
    urls = generate_images(prompt, model, size, count=1)
    return urls[0] if urls else None

def main():
    parser = argparse.ArgumentParser(description="Seedream Image Generation/Editing (MixedCloud)")
    parser.add_argument("prompt", nargs="?", help="Image generation or editing prompt")
    parser.add_argument("--model", default="doubao-seedream-5-0-260128", help="Model to use")
    parser.add_argument("--size", default="2048x2048", help="Image size (min 3686400 pixels)")
    parser.add_argument("--count", "-c", type=int, default=1, help="Number of images to generate (1-15)")
    parser.add_argument("--download", "-d", action="store_true", help="Download images automatically")
    parser.add_argument("--seed", type=int, help="Seed for reproducible results")
    # Image editing options
    parser.add_argument("--image", "-i", help="Source image for editing (image-to-image)")
    parser.add_argument("--edit", "-e", action="store_true", help="Enable image editing mode")
    parser.add_argument("--strength", "-s", type=float, default=0.7, help="Edit strength 0.0-1.0 (default: 0.7)")
    
    args = parser.parse_args()
    
    # Image editing mode
    if args.edit or args.image:
        if not args.image:
            print("Error: --image required for editing mode")
            sys.exit(1)
        if not args.prompt:
            print("Error: Prompt required for editing")
            sys.exit(1)
        
        edit_image(
            source_image=args.image,
            prompt=args.prompt,
            model=args.model,
            size=args.size,
            count=args.count,
            download=args.download,
            strength=args.strength
        )
        return
    
    if not args.prompt:
        print("Usage: python seedream.py <prompt> [options]")
        print()
        print("Examples:")
        print("  # Text-to-image generation")
        print("  python seedream.py '一只可爱的小猫'")
        print("  python seedream.py 'a cute kitten' --size 2048x2048")
        print("  python seedream.py 'cat' --count 4 --download")
        print("  python seedream.py 'landscape' --count 9 --seed 42")
        print()
        print("  # Image-to-image editing")
        print("  python seedream.py 'make it sunny' --image photo.jpg --edit")
        print("  python seedream.py 'add flowers' -i input.png -e --strength 0.8")
        print()
        print("Options:")
        print("  --model MODEL        Model to use (default: doubao-seedream-5-0-260128)")
        print("  --size SIZE         Image size (default: 2048x2048)")
        print("  --count, -c N       Number of images (1-15, default: 1)")
        print("  --download, -d      Download images automatically")
        print("  --seed N            Seed for reproducible results")
        print("  --image, -i FILE    Source image for editing")
        print("  --edit, -e          Enable editing mode (requires --image)")
        print("  --strength, -s N   Edit strength 0.0-1.0 (default: 0.7)")
        print()
        print("Supported models: doubao-seedream-5-0-260128, doubao-seedream-4-5-251128")
        print("Supported sizes: 2048x2048, 2048x1024, 1024x2048 (min 3686400 pixels)")
        sys.exit(1)
    
    generate_images(args.prompt, args.model, args.size, args.count, args.download, args.seed)

if __name__ == "__main__":
    main()
