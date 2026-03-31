#!/usr/bin/env python3
"""
Volcengine Seedance Video Generation via MixedCloud API
Generates videos using ByteDance Seedance models
"""

import os
import sys
import json
import time
import requests
import argparse
import re
import signal
import urllib.parse

# MixedCloud API endpoints (Volcengine Discount Channel - 火山折扣渠道)
CREATE_TASK_ENDPOINT = "https://models.mixedcloud.cn/v1/video/generations"
POLL_TASK_ENDPOINT = "https://models.mixedcloud.cn/v1/video/generations"

# Default API key - set via environment variable or use the one from 1Password
# Get from 1Password: op item get "MixedCloud API - Seedream/Seedance" --reveal
DEFAULT_API_KEY = "sk-QUFw4BtmoziqWlpy6ZlUuTDC8IUgNS0uKb6LIXrFs7M1MVy7"

# Global flag for graceful shutdown
running = True

def signal_handler(signum, frame):
    """Handle termination signals gracefully."""
    global running
    print("\n⚠️ Received termination signal. Finishing current poll...")
    running = False

# Register signal handlers
signal.signal(signal.SIGTERM, signal_handler)
signal.signal(signal.SIGINT, signal_handler)

def parse_prompt(text):
    """Parse the user's prompt and extract parameters."""
    # Remove common prefixes
    text = re.sub(r'^(生成视频：|Generate video：|Generate video:)\s*', '', text.strip(), flags=re.IGNORECASE)
    text = re.sub(r'^(Animate image：|Animate image:)\s*', '', text.strip(), flags=re.IGNORECASE)
    
    # Extract duration if present
    duration = 5  # default
    duration_match = re.search(r'时长[：:]?\s*(\d+)', text)
    if duration_match:
        duration = int(duration_match.group(1))
        duration = max(5, min(12, duration))  # clamp to 5-12
        text = re.sub(r'时长[：:]?\s*\d+', '', text)
    
    # Extract resolution if present
    resolution = "720p"  # default
    res_match = re.search(r'分辨率[：:]?\s*(\d+p)', text)
    if res_match:
        resolution = res_match.group(1)
        text = re.sub(r'分辨率[：:]?\s*\d+p', '', text)
    
    # Extract model if present
    model = "doubao-seedance-1-5-pro-251215"  # default
    model_match = re.search(r'模型[：:]?\s*([\w-]+)', text)
    if model_match:
        model = model_match.group(1)
        text = re.sub(r'模型[：:]?\s*[\w-]+', '', text)
    
    # Check for reference image
    reference = None
    ref_match = re.search(r'Reference[：:]?\s*(https?://\S+)', text, re.IGNORECASE)
    if ref_match:
        reference = ref_match.group(1)
        text = re.sub(r'Reference[：:]?\s*https?://\S+', '', text)
    
    # Clean up the prompt
    prompt = text.strip()
    
    return prompt, model, duration, resolution, reference

def create_video_task(prompt, model="doubao-seedance-1-5-pro-251215", duration=5, resolution="720p", reference=None):
    """Create a video generation task."""
    
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
    
    # Build payload based on whether it's text-to-video or image-to-video
    if reference:
        payload = {
            "model": model,
            "prompt": prompt,
            "image_url": reference,
            "duration": duration,
            "resolution": resolution
        }
    else:
        payload = {
            "model": model,
            "prompt": prompt,
            "duration": duration,
            "resolution": resolution
        }
    
    print(f"Creating video generation task...")
    print(f"Prompt: {prompt}")
    print(f"Model: {model}")
    print(f"Duration: {duration}s")
    print(f"Resolution: {resolution}")
    if reference:
        print(f"Reference image: {reference}")
    print()
    
    try:
        response = requests.post(CREATE_TASK_ENDPOINT, headers=headers, json=payload, timeout=60)
        
        if response.status_code != 200:
            print(f"Error: API returned status {response.status_code}")
            print(f"Response: {response.text}")
            sys.exit(1)
        
        result = response.json()
        
        # Try different response formats
        task_id = result.get("id") or result.get("task_id") or result.get("generation_id")
        
        if not task_id:
            # Check if it's synchronous (immediate result)
            if "output" in result and "video_url" in result["output"]:
                video_url = result["output"]["video_url"]
                print(f"✅ Video generated successfully!")
                print(f"Video URL: {video_url}")
                print()
                print("You can download it with:")
                print(f"curl -L -o video.mp4 '{video_url}'")
                return None
            
            print("Error: No task ID in response")
            print(json.dumps(result, indent=2))
            sys.exit(1)
        
        print(f"✅ Task created successfully!")
        print(f"Task ID: {task_id}")
        print()
        print("Polling for completion...")
        
        return task_id
        
    except requests.exceptions.Timeout:
        print("Error: Request timed out")
        sys.exit(1)
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        sys.exit(1)

def download_video(url, filename=None):
    """Download video from URL to file."""
    try:
        response = requests.get(url, timeout=120, stream=True)
        if response.status_code == 200:
            # Generate filename from URL if not provided
            if not filename:
                parsed = urllib.parse.urlparse(url)
                path = parsed.path
                filename = os.path.basename(path)
                if not filename or '.' not in filename:
                    filename = "video.mp4"
            
            total_size = int(response.headers.get('content-length', 0))
            downloaded = 0
            
            with open(filename, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    if chunk:
                        f.write(chunk)
                        downloaded += len(chunk)
                        if total_size > 0:
                            percent = (downloaded / total_size) * 100
                            print(f"\rDownloading... {percent:.1f}%", end='', flush=True)
            
            print(f"\n✅ Downloaded: {filename}")
            return filename
        else:
            print(f"\n⚠️ Download failed: HTTP {response.status_code}")
            return None
    except Exception as e:
        print(f"\n⚠️ Download error: {e}")
        return None


def poll_for_result(task_id, max_wait=180, download=False):
    """Poll for video generation result."""
    
    api_key = os.environ.get("MIXEDCLOUD_API_KEY") or DEFAULT_API_KEY
    
    if not api_key:
        print("Error: No API key available")
        sys.exit(1)
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    start_time = time.time()
    poll_count = 0
    
    while running and time.time() - start_time < max_wait:
        poll_count += 1
        print(f"Polling... ({poll_count})")
        
        try:
            # Check task status - MixedCloud format
            response = requests.get(f"{POLL_TASK_ENDPOINT}/{task_id}", headers=headers, timeout=30)
            
            if response.status_code != 200:
                print(f"Error: API returned status {response.status_code}")
                time.sleep(5)
                continue
            
            result = response.json()
            
            # Handle MixedCloud response format
            # Check if it's in data.status (MixedCloud format)
            if "data" in result and isinstance(result["data"], dict):
                status = result["data"].get("status", "")
                # Video URL can be in data.data.content.video_url or data.status (for success)
                if status == "SUCCESS":
                    video_url = result["data"].get("data", {}).get("content", {}).get("video_url")
                    if not video_url:
                        # Sometimes it's directly in status field
                        video_url = result["data"].get("status")
                        if video_url and not video_url.startswith("http"):
                            video_url = None
                    if video_url:
                        print()
                        print(f"✅ Video generated successfully!")
                        print(f"Video URL: {video_url}")
                        
                        # Auto-download if requested
                        if download:
                            print()
                            filename = download_video(video_url)
                            if filename:
                                return filename
                        
                        print()
                        print("You can download it with:")
                        print(f"curl -L -o video.mp4 '{video_url}'")
                        return video_url
                    else:
                        print("Error: No video URL in completed response")
                        print(json.dumps(result, indent=2))
                        sys.exit(1)
                elif status == "FAILED" or status == "FAIL":
                    error_msg = result["data"].get("fail_reason", "Unknown error")
                    print(f"❌ Video generation failed: {error_msg}")
                    sys.exit(1)
                elif status in ["IN_PROGRESS", "PENDING", "RUNNING"]:
                    progress = result["data"].get("progress", "0%")
                    print(f"Status: {status}, progress: {progress}, waiting...")
                    time.sleep(5)
                else:
                    print(f"Status: {status}, waiting...")
                    time.sleep(5)
            else:
                # Try alternative format
                status = result.get("status", "")
                if status == "succeeded":
                    video_url = result.get("output", {}).get("video_url")
                    if video_url:
                        print(f"✅ Video generated!")
                        if download:
                            return download_video(video_url)
                        return video_url
                print(f"Status: {status}, waiting...")
                time.sleep(5)
                
        except requests.exceptions.RequestException as e:
            print(f"Polling error: {e}")
            time.sleep(5)
    
    if not running:
        print(f"\n⚠️ Interrupted but can resume with task ID: {task_id}")
        print("Use this ID to check status later.")
    
    print(f"Timeout: Video generation took longer than {max_wait}s")
    print(f"Task ID: {task_id}")
    print("Please check the API console for status.")
    sys.exit(1)

def generate_video(prompt, model="doubao-seedance-1-5-pro-251215", duration=5, resolution="720p", reference=None, download=False, timeout=180):
    """Generate a video using the MixedCloud Seedance API."""
    task_id = create_video_task(prompt, model, duration, resolution, reference)
    if task_id:
        return poll_for_result(task_id, max_wait=timeout, download=download)

def main():
    parser = argparse.ArgumentParser(description="Seedance Video Generation (MixedCloud)")
    parser.add_argument("prompt", nargs="?", help="Video generation prompt")
    parser.add_argument("--model", default="doubao-seedance-1-5-pro-251215", help="Model to use")
    parser.add_argument("--duration", type=int, default=5, help="Video duration in seconds (5-12)")
    parser.add_argument("--resolution", default="720p", help="Resolution (480p, 720p)")
    parser.add_argument("--reference", help="Reference image URL for image-to-video")
    parser.add_argument("--download", "-d", action="store_true", help="Download video automatically when ready")
    parser.add_argument("--timeout", type=int, default=180, help="Max wait time in seconds")
    
    args = parser.parse_args()
    
    if not args.prompt:
        print("Usage: python seedance.py <prompt> [options]")
        print()
        print("Examples:")
        print("  python seedance.py '一只猫在草地上奔跑'")
        print("  python seedance.py 'a cat running' --duration 10 --resolution 720p")
        print("  python seedance.py 'landscape' --download")
        print("  python seedance.py 'animate' --reference https://example.com/image.jpg")
        print()
        print("Options:")
        print("  --model MODEL        Model to use (default: doubao-seedance-1-5-pro-251215)")
        print("  --duration N        Video duration 5-12 seconds (default: 5)")
        print("  --resolution RES    Resolution: 480p or 720p (default: 720p)")
        print("  --reference URL     Reference image URL for image-to-video")
        print("  --download, -d      Download video automatically")
        print("  --timeout N         Max wait time in seconds (default: 180)")
        print()
        print("Supported models: doubao-seedance-1-5-pro-251215, doubao-seedance-1-0-pro-250528")
        sys.exit(1)
    
    generate_video(args.prompt, args.model, args.duration, args.resolution, args.reference, args.download, args.timeout)

if __name__ == "__main__":
    main()
