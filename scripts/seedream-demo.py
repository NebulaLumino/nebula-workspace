#!/usr/bin/env python3
"""
Simple demo script for Seedream image generation.
Generates a test image using the MixedCloud API.
"""

import os
import sys
import requests
import json

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

API_ENDPOINT = "https://models.mixedcloud.cn/v1/images/generations"
API_KEY = "sk-QUFw4BtmoziqWlpy6ZlUuTDC8IUgNS0uKb6LIXrFs7M1MVy7"

def generate_image(prompt, model="doubao-seedream-5-0-260128", size="1920x1920"):
    """Generate an image using Seedream API."""
    
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": model,
        "prompt": prompt,
        "size": size,
        "n": 1
    }
    
    print(f"🎨 Generating image: '{prompt}'")
    print(f"   Model: {model}")
    print(f"   Size: {size}")
    
    response = requests.post(API_ENDPOINT, headers=headers, json=payload, timeout=120)
    
    if response.status_code == 200:
        data = response.json()
        if "data" in data and len(data["data"]) > 0:
            image_url = data["data"][0].get("url")
            print(f"✅ Success! Image URL: {image_url}")
            return image_url
        else:
            print(f"⚠️ No image in response: {data}")
            return None
    else:
        print(f"❌ Error {response.status_code}: {response.text}")
        return None


def download_image(url, filename="demo-image.png"):
    """Download image from URL."""
    try:
        response = requests.get(url, timeout=60)
        if response.status_code == 200:
            with open(filename, 'wb') as f:
                f.write(response.content)
            print(f"💾 Saved to: {filename}")
            return filename
    except Exception as e:
        print(f"⚠️ Download error: {e}")
    return None


if __name__ == "__main__":
    # Generate a simple test image
    prompt = "A cute orange cat sitting on a windowsill, sunny day, photorealistic"
    
    print("=" * 50)
    print("🌸 Seedream Image Generation Demo")
    print("=" * 50)
    
    image_url = generate_image(prompt)
    
    if image_url:
        print("\n📥 Downloading image...")
        download_image(image_url)
        print("\n✨ Demo complete!")
    else:
        print("\n❌ Demo failed!")
        sys.exit(1)
