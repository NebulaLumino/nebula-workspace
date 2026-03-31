#!/usr/bin/env python3
"""
Health Check Utility for Volcengine/MixedCloud Skills
Tests API connectivity and credentials for all MixedCloud-based skills.
"""

import os
import sys
import json
import argparse
from pathlib import Path

# Try to import requests, install if missing
try:
    import requests
except ImportError:
    print("Installing requests...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "requests"])
    import requests

MIXEDCLOUD_API_KEY = os.environ.get("MIXEDCLOUD_API_KEY", "")
API_BASE = "https://models.mixedcloud.cn/v1"

# Colors for output
GREEN = "\033[92m"
RED = "\033[91m"
YELLOW = "\033[93m"
RESET = "\033[0m"


def get_api_key():
    """Get API key from environment or prompt."""
    if MIXEDCLOUD_API_KEY:
        return MIXEDCLOUD_API_KEY
    print(f"{YELLOW}No MIXEDCLOUD_API_KEY found in environment.{RESET}")
    print("Please set it with: export MIXEDCLOUD_API_KEY='your-key-here'")
    return None


def check_llm_api(key):
    """Test LLM API connectivity."""
    print("\n📡 Testing LLM API...")
    url = f"{API_BASE}/chat/completions"
    headers = {
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json"
    }
    data = {
        "model": "doubao-1-5-pro-32k-250115",
        "messages": [{"role": "user", "content": "Hi"}],
        "max_tokens": 5
    }
    
    try:
        resp = requests.post(url, headers=headers, json=data, timeout=30)
        if resp.status_code == 200:
            print(f"{GREEN}✓ LLM API: OK{RESET}")
            return True
        else:
            print(f"{RED}✗ LLM API: {resp.status_code} - {resp.text[:100]}{RESET}")
            return False
    except Exception as e:
        print(f"{RED}✗ LLM API: {e}{RESET}")
        return False


def check_image_api(key):
    """Test Seedream image generation API."""
    print("\n🖼️ Testing Image Generation API...")
    url = f"{API_BASE}/images/generations"
    headers = {
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json"
    }
    data = {
        "model": "doubao-seedream-5-0-260128",
        "prompt": "test image",
        "size": "2048x2048",
        "num_images": 1
    }
    
    try:
        resp = requests.post(url, headers=headers, json=data, timeout=30)
        if resp.status_code == 200:
            result = resp.json()
            print(f"{GREEN}✓ Image API: OK{RESET}")
            if "data" in result and result["data"]:
                print(f"  → Generated image ID: {result['data'][0].get('id', 'N/A')}")
            return True
        else:
            print(f"{RED}✗ Image API: {resp.status_code} - {resp.text[:100]}{RESET}")
            return False
    except Exception as e:
        print(f"{RED}✗ Image API: {e}{RESET}")
        return False


def check_video_api(key):
    """Test Seedance video generation API."""
    print("\n🎬 Testing Video Generation API...")
    url = f"{API_BASE}/video/generations"
    headers = {
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json"
    }
    data = {
        "model": "doubao-seedance-1-5-pro-251215",
        "prompt": "test video",
        "duration": 5,
        "resolution": "720p"
    }
    
    try:
        resp = requests.post(url, headers=headers, json=data, timeout=30)
        if resp.status_code == 200:
            result = resp.json()
            print(f"{GREEN}✓ Video API: OK{RESET}")
            if "data" in result and result["data"]:
                print(f"  → Generated video ID: {result['data'][0].get('id', 'N/A')}")
            return True
        else:
            print(f"{RED}✗ Video API: {resp.status_code} - {resp.text[:100]}{RESET}")
            return False
    except Exception as e:
        print(f"{RED}✗ Video API: {e}{RESET}")
        return False


def main():
    parser = argparse.ArgumentParser(description="Health check for MixedCloud APIs")
    parser.add_argument("--all", "-a", action="store_true", help="Run all tests")
    parser.add_argument("--llm", action="store_true", help="Test LLM API")
    parser.add_argument("--image", action="store_true", help="Test Image API")
    parser.add_argument("--video", action="store_true", help="Test Video API")
    parser.add_argument("--key", type=str, help="API key (or set MIXEDCLOUD_API_KEY)")
    
    args = parser.parse_args()
    
    key = args.key or get_api_key()
    if not key:
        print(f"{YELLOW}No API key provided. Exiting.{RESET}")
        sys.exit(1)
    
    # Mask key for display
    masked = key[:8] + "..." + key[-4:] if len(key) > 12 else "***"
    print(f"🔑 Using API key: {masked}")
    
    # Determine what to test
    test_all = args.all or not (args.llm or args.image or args.video)
    
    results = []
    
    if test_all or args.llm:
        results.append(("LLM", check_llm_api(key)))
    if test_all or args.image:
        results.append(("Image", check_image_api(key)))
    if test_all or args.video:
        results.append(("Video", check_video_api(key)))
    
    # Summary
    print("\n" + "="*50)
    print("📊 Summary:")
    passed = sum(1 for _, ok in results if ok)
    total = len(results)
    for name, ok in results:
        status = f"{GREEN}✓ PASS{RESET}" if ok else f"{RED}✗ FAIL{RESET}"
        print(f"  {name}: {status}")
    print(f"\nTotal: {passed}/{total} passed")
    
    if passed == total:
        print(f"{GREEN}All systems operational!{RESET}")
        sys.exit(0)
    else:
        print(f"{RED}Some checks failed.{RESET}")
        sys.exit(1)


if __name__ == "__main__":
    main()
