#!/usr/bin/env python3
"""
Volcengine AI Unified CLI via MixedCloud API
Unified interface for Doubao LLM, Seedream image generation, and Seedance video generation
"""

import os
import sys
import json
import time
import argparse
import subprocess
from urllib.parse import urlparse

# Import requests - exit if not available
try:
    import requests
except ImportError:
    print("Error: 'requests' package required")
    print("Install with: pip install requests")
    sys.exit(1)

# Import skill logging if available
try:
    sys.path.insert(0, os.path.expanduser("~/.openclaw/workspace/scripts"))
    from skill_logging import get_logger, log_execution
    LOGGING_ENABLED = True
except ImportError:
    LOGGING_ENABLED = False

# Initialize logger
if LOGGING_ENABLED:
    logger = get_logger("volcengine-ai")
    logger.info("Volcengine AI unified skill initialized")

# ============== CONFIG ==============
# API endpoint
LLM_ENDPOINT = "https://models.mixedcloud.cn/v1/chat/completions"
IMAGE_ENDPOINT = "https://models.mixedcloud.cn/v1/images/generations"
VIDEO_ENDPOINT = "https://models.mixedcloud.cn/v1/video/generations"

# Default API key
DEFAULT_API_KEY = "sk-QUFw4BtmoziqWlpy6ZlUuTDC8IUgNS0uKb6LIXrFs7M1MVy7"

# Models
LLM_MODELS = {
    "doubao-seed-2-0-pro-260215": {"name": "Doubao Pro 2.0", "context": 200000},
    "doubao-seed-2-0-lite-260215": {"name": "Doubao Lite 2.0", "context": 200000},
    "doubao-seed-1-6-flash-250828": {"name": "Doubao 1.6 Flash", "context": 128000},
    "doubao-1-5-pro-32k-250115": {"name": "Doubao 1.5 Pro 32K", "context": 32000},
}

IMAGE_MODELS = {
    "doubao-seedream-5-0-260128": "Seedream 5.0",
    "doubao-seedream-4-5-251128": "Seedream 4.5",
}

VIDEO_MODELS = {
    "doubao-seedance-1-5-pro-251215": "Seedance 1.5 Pro",
    "doubao-seedance-1-0-pro-250528": "Seedance 1.0 Pro",
}

DEFAULT_LLM = "doubao-seed-2-0-pro-260215"
DEFAULT_IMAGE = "doubao-seedream-5-0-260128"
DEFAULT_VIDEO = "doubao-seedance-1-5-pro-251215"


# ============== UTILS ==============
def get_api_key():
    """Get API key from env or default."""
    return os.environ.get("MIXEDCLOUD_API_KEY") or DEFAULT_API_KEY


def download_file(url, filename=None):
    """Download a file from URL."""
    try:
        response = requests.get(url, timeout=60)
        if response.status_code != 200:
            print(f"Error: Failed to download (status {response.status_code})")
            return None
        
        # Extract filename from URL if not provided
        if not filename:
            parsed = urlparse(url)
            path = parsed.path
            filename = os.path.basename(path)
            if not filename or '.' not in filename:
                filename = "output.file"
        
        with open(filename, 'wb') as f:
            f.write(response.content)
        print(f"✅ Downloaded: {filename}")
        return filename
    except Exception as e:
        print(f"Error downloading: {e}")
        return None


# ============== LLM CHAT ==============
def chat(prompt, model=DEFAULT_LLM, system_prompt=None, temperature=0.7, max_tokens=4096, stream=False):
    """Send chat completion request."""
    api_key = get_api_key()
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    messages = []
    if system_prompt:
        messages.append({"role": "system", "content": system_prompt})
    messages.append({"role": "user", "content": prompt})
    
    payload = {
        "model": model,
        "messages": messages,
        "temperature": temperature,
        "max_tokens": max_tokens,
        "stream": stream
    }
    
    print(f"🤖 Model: {model}")
    print(f"📊 Temperature: {temperature}, Max tokens: {max_tokens}")
    print()
    
    try:
        response = requests.post(LLM_ENDPOINT, headers=headers, json=payload, timeout=120)
        
        if response.status_code != 200:
            print(f"Error: API returned {response.status_code}")
            print(response.text)
            return None
        
        result = response.json()
        
        if "choices" in result and len(result["choices"]) > 0:
            content = result["choices"][0].get("message", {}).get("content", "")
            usage = result.get("usage", {})
            
            print("=" * 50)
            print("Response:")
            print("=" * 50)
            print(content)
            print()
            print(f"📈 Tokens: {usage.get('total_tokens', 0)} "
                  f"(prompt: {usage.get('prompt_tokens', 0)}, "
                  f"completion: {usage.get('completion_tokens', 0)})")
            print("=" * 50)
            
            return content
        else:
            print("Error: Unexpected response")
            print(json.dumps(result, indent=2))
            return None
            
    except Exception as e:
        print(f"Error: {e}")
        return None


def interactive_chat(model, temperature, max_tokens):
    """Interactive chat mode."""
    api_key = get_api_key()
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    messages = [{"role": "system", "content": "You are a helpful AI assistant."}]
    
    print(f"🤖 Doubao Chat ({LLM_MODELS.get(model, {}).get('name', model)})")
    print("Type 'quit' or 'exit' to end. Type 'clear' to clear history.")
    print("=" * 50)
    
    while True:
        try:
            user_input = input("\nYou: ").strip()
            
            if user_input.lower() in ['quit', 'exit']:
                print("Goodbye!")
                break
            
            if user_input.lower() == 'clear':
                messages = [{"role": "system", "content": "You are a helpful AI assistant."}]
                print("Chat history cleared.")
                continue
            
            if not user_input:
                continue
            
            messages.append({"role": "user", "content": user_input})
            
            payload = {
                "model": model,
                "messages": messages,
                "temperature": temperature,
                "max_tokens": max_tokens,
                "stream": False
            }
            
            print()
            response = requests.post(LLM_ENDPOINT, headers=headers, json=payload, timeout=120)
            
            if response.status_code != 200:
                print(f"Error: {response.status_code}")
                continue
            
            result = response.json()
            if "choices" in result and len(result["choices"]) > 0:
                content = result["choices"][0].get("message", {}).get("content", "")
                if content:
                    print(f"🤖 Assistant: {content}")
                    messages.append({"role": "assistant", "content": content})
            
        except KeyboardInterrupt:
            print("\nGoodbye!")
            break
        except Exception as e:
            print(f"Error: {e}")


# ============== IMAGE GENERATION ==============
def generate_image(prompt, model=DEFAULT_IMAGE, aspect_ratio="1:1", size=None, download=False):
    """Generate image with Seedream."""
    api_key = get_api_key()
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    # Parse aspect ratio and calculate size (min 3,686,400 pixels required by API)
    width, height = map(int, aspect_ratio.split(":"))
    if size:
        width, height = map(int, size.split("x"))
    else:
        # Default sizes based on ratio - ensure minimum 3,686,400 pixels
        min_pixels = 3686400
        # Keep aspect ratio, find dimensions that meet minimum
        if width >= height:
            width = int((min_pixels / height) ** 0.5)
            height = int(width * height / width)  # Scale height by ratio
            # Adjust to meet minimum
            width = int((min_pixels) ** 0.5)
            height = int(min_pixels / width)
        else:
            height = int((min_pixels / width) ** 0.5)
            width = int(min_pixels / height)
    
    # Ensure minimum size
    if width * height < 3686400:
        width = 1920
        height = 1920
    
    payload = {
        "model": model,
        "prompt": prompt,
        "size": f"{width}x{height}",
        "response_format": "url",
        "max_images": 1
    }
    
    print(f"🖼️  Model: {model}")
    print(f"📐 Size: {width}x{height}")
    print(f"📝 Prompt: {prompt}")
    print()
    
    if LOGGING_ENABLED:
        logger.info(f"Generating image: {prompt[:50]}...")
    
    try:
        response = requests.post(IMAGE_ENDPOINT, headers=headers, json=payload, timeout=180)
        
        if response.status_code != 200:
            print(f"Error: API returned {response.status_code}")
            print(response.text)
            return None
        
        result = response.json()
        
        if "data" in result and len(result["data"]) > 0:
            image_url = result["data"][0].get("url")
            if image_url:
                print(f"✅ Image generated!")
                print(f"🔗 URL: {image_url}")
                
                if download:
                    filename = download_file(image_url)
                    if filename:
                        return filename
                
                return image_url
            else:
                print("Error: No image URL in response")
                print(json.dumps(result, indent=2))
                return None
        else:
            print("Error: Unexpected response")
            print(json.dumps(result, indent=2))
            return None
            
    except Exception as e:
        print(f"Error: {e}")
        return None


# ============== VIDEO GENERATION ==============
def generate_video(prompt, model=DEFAULT_VIDEO, duration=5, download=False):
    """Generate video with Seedance."""
    api_key = get_api_key()
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": model,
        "prompt": prompt,
        "duration": duration
    }
    
    print(f"🎬 Model: {model}")
    print(f"⏱️  Duration: {duration}s")
    print(f"📝 Prompt: {prompt}")
    print()
    
    if LOGGING_ENABLED:
        logger.info(f"Generating video: {prompt[:50]}...")
    
    try:
        response = requests.post(VIDEO_ENDPOINT, headers=headers, json=payload, timeout=300)
        
        if response.status_code != 200:
            print(f"Error: API returned {response.status_code}")
            print(response.text)
            return None
        
        result = response.json()
        
        # Handle async response
        if "task_id" in result:
            task_id = result["task_id"]
            print(f"📋 Task ID: {task_id}")
            print("⏳ Waiting for video generation...")
            return wait_for_video(task_id, api_key, download)
        
        # Handle direct response
        if "data" in result and len(result["data"]) > 0:
            video_url = result["data"][0].get("url")
            if video_url:
                print(f"✅ Video generated!")
                print(f"🔗 URL: {video_url}")
                
                if download:
                    filename = download_file(video_url)
                    if filename:
                        return filename
                
                return video_url
        
        print("Response:")
        print(json.dumps(result, indent=2))
        return None
            
    except Exception as e:
        print(f"Error: {e}")
        return None


def wait_for_video(task_id, api_key, download=False, max_wait=300):
    """Wait for async video generation to complete."""
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    status_url = VIDEO_ENDPOINT.replace("/video/generations", f"/video/tasks/{task_id}")
    
    for i in range(max_wait // 5):
        time.sleep(5)
        try:
            response = requests.get(status_url, headers=headers, timeout=30)
            if response.status_code != 200:
                continue
            
            result = response.json()
            status = result.get("status")
            
            print(f"Status: {status}")
            
            if status == "completed":
                video_url = result.get("data", [{}])[0].get("url")
                if video_url:
                    print(f"✅ Video ready!")
                    print(f"🔗 URL: {video_url}")
                    
                    if download:
                        return download_file(video_url)
                    return video_url
            
            elif status == "failed":
                print(f"❌ Video generation failed")
                print(json.dumps(result, indent=2))
                return None
                
        except Exception as e:
            print(f"Error checking status: {e}")
    
    print("Timeout waiting for video")
    return None


# ============== HEALTH CHECK ==============
def health_check():
    """Test all API connections."""
    api_key = get_api_key()
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    results = {}
    
    # Test LLM
    print("Testing LLM API...")
    try:
        payload = {
            "model": DEFAULT_LLM,
            "messages": [{"role": "user", "content": "Hi"}],
            "max_tokens": 10
        }
        response = requests.post(LLM_ENDPOINT, headers=headers, json=payload, timeout=30)
        results["LLM"] = "✅ PASS" if response.status_code == 200 else f"❌ FAIL ({response.status_code})"
    except Exception as e:
        results["LLM"] = f"❌ FAIL: {e}"
    
    # Test Image
    print("Testing Image API (Seedream)...")
    try:
        payload = {
            "model": DEFAULT_IMAGE,
            "prompt": "test",
            "size": "1920x1920",
            "n": 1
        }
        response = requests.post(IMAGE_ENDPOINT, headers=headers, json=payload, timeout=30)
        results["Image"] = "✅ PASS" if response.status_code == 200 else f"❌ FAIL ({response.status_code})"
    except Exception as e:
        results["Image"] = f"❌ FAIL: {e}"
    
    # Test Video
    print("Testing Video API (Seedance)...")
    try:
        payload = {
            "model": DEFAULT_VIDEO,
            "prompt": "test",
            "duration": 5
        }
        response = requests.post(VIDEO_ENDPOINT, headers=headers, json=payload, timeout=30)
        results["Video"] = "✅ PASS" if response.status_code == 200 else f"❌ FAIL ({response.status_code})"
    except Exception as e:
        results["Video"] = f"❌ FAIL: {e}"
    
    print()
    print("=" * 40)
    print("HEALTH CHECK RESULTS")
    print("=" * 40)
    for service, status in results.items():
        print(f"{service:10} {status}")
    print("=" * 40)
    
    return all("PASS" in s for s in results.values())


def list_models():
    """List all available models."""
    print("=" * 50)
    print("Available Models")
    print("=" * 50)
    
    print("\n📚 LLM (Doubao):")
    print("-" * 50)
    for model_id, info in LLM_MODELS.items():
        print(f"  {model_id}")
        print(f"    Context: {info['context']:,} tokens")
    
    print("\n🖼️  Image (Seedream):")
    print("-" * 50)
    for model_id, name in IMAGE_MODELS.items():
        print(f"  {model_id} - {name}")
    
    print("\n🎬 Video (Seedance):")
    print("-" * 50)
    for model_id, name in VIDEO_MODELS.items():
        print(f"  {model_id} - {name}")
    
    print("=" * 50)


# ============== MAIN ==============
def main():
    parser = argparse.ArgumentParser(
        description="Volcengine AI Unified CLI - Doubao LLM, Seedream, Seedance",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  ai.py chat "What is AI?"
  ai.py chat -i
  ai.py image "A cat"
  ai.py image "A sunset" --download
  ai.py video "A wave" --duration 5
  ai.py health
  ai.py models
        """
    )
    
    subparsers = parser.add_subparsers(dest="command", help="Commands")
    
    # Chat command
    chat_parser = subparsers.add_parser("chat", help="Chat with Doubao LLM")
    chat_parser.add_argument("prompt", nargs="?", help="Prompt to send")
    chat_parser.add_argument("--model", "-m", default=DEFAULT_LLM, help="Model")
    chat_parser.add_argument("--system", "-s", help="System prompt")
    chat_parser.add_argument("--temperature", "-t", type=float, default=0.7)
    chat_parser.add_argument("--max-tokens", type=int, default=4096)
    chat_parser.add_argument("--stream", action="store_true")
    chat_parser.add_argument("--interactive", "-i", action="store_true")
    
    # Image command
    image_parser = subparsers.add_parser("image", help="Generate image with Seedream")
    image_parser.add_argument("prompt", nargs="?", help="Image prompt")
    image_parser.add_argument("--model", default=DEFAULT_IMAGE)
    image_parser.add_argument("--aspect-ratio", default="1:1")
    image_parser.add_argument("--size")
    image_parser.add_argument("--download", action="store_true")
    
    # Video command
    video_parser = subparsers.add_parser("video", help="Generate video with Seedance")
    video_parser.add_argument("prompt", nargs="?", help="Video prompt")
    video_parser.add_argument("--model", default=DEFAULT_VIDEO)
    video_parser.add_argument("--duration", type=int, default=5)
    video_parser.add_argument("--download", action="store_true")
    
    # Health check
    subparsers.add_parser("health", help="Test all API connections")
    
    # List models
    subparsers.add_parser("models", help="List available models")
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        sys.exit(1)
    
    if args.command == "chat":
        if args.interactive:
            interactive_chat(args.model, args.temperature, args.max_tokens)
        elif args.prompt:
            chat(args.prompt, args.model, args.system, args.temperature, args.max_tokens, args.stream)
        else:
            print("Error: Provide prompt or use --interactive")
            sys.exit(1)
    
    elif args.command == "image":
        if args.prompt:
            generate_image(args.prompt, args.model, args.aspect_ratio, args.size, args.download)
        else:
            print("Error: Provide prompt")
            sys.exit(1)
    
    elif args.command == "video":
        if args.prompt:
            generate_video(args.prompt, args.model, args.duration, args.download)
        else:
            print("Error: Provide prompt")
            sys.exit(1)
    
    elif args.command == "health":
        health_check()
    
    elif args.command == "models":
        list_models()


if __name__ == "__main__":
    main()