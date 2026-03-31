#!/usr/bin/env python3
"""
Volcengine Doubao LLM Chat via MixedCloud API
Chat completion using ByteDance Doubao models
"""

import os
import sys
import json
import requests
import argparse

# MixedCloud API endpoint
API_ENDPOINT = "https://models.mixedcloud.cn/v1/chat/completions"

# Default API key - set via environment variable or use the one from 1Password
# Get from 1Password: op item get "MixedCloud API - Seedream/Seedance" --reveal
DEFAULT_API_KEY = "sk-QUFw4BtmoziqWlpy6ZlUuTDC8IUgNS0uKb6LIXrFs7M1MVy7"

# Default models
DEFAULT_MODEL = "doubao-seed-2-0-pro-260215"

# Available models
AVAILABLE_MODELS = {
    "doubao-seed-2-0-pro-260215": {
        "name": "Doubao Pro 2.0",
        "context": 200000,
        "description": "Latest flagship model, best quality"
    },
    "doubao-seed-2-0-lite-260215": {
        "name": "Doubao Lite 2.0",
        "context": 200000,
        "description": "Fast version, lower cost"
    },
    "doubao-seed-1-6-flash-250828": {
        "name": "Doubao 1.6 Flash",
        "context": 128000,
        "description": "Fast and efficient"
    },
    "doubao-1-5-pro-32k-250115": {
        "name": "Doubao 1.5 Pro 32K",
        "context": 32000,
        "description": "Pro version with 32K context"
    },
}


def chat(prompt, model=DEFAULT_MODEL, system_prompt=None, temperature=0.7, max_tokens=4096, stream=False):
    """Send a chat completion request to Doubao via MixedCloud API."""
    
    # API key from environment or default
    api_key = os.environ.get("MIXEDCLOUD_API_KEY") or DEFAULT_API_KEY
    
    if not api_key:
        print("Error: MIXEDCLOUD_API_KEY environment variable not set")
        print("Please set it with: export MIXEDCLOUD_API_KEY='your-api-key'")
        sys.exit(1)
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    # Build messages
    messages = []
    if system_prompt:
        messages.append({"role": "system", "content": system_prompt})
    messages.append({"role": "user", "content": prompt})
    
    # Build payload
    payload = {
        "model": model,
        "messages": messages,
        "temperature": temperature,
        "max_tokens": max_tokens,
        "stream": stream
    }
    
    print(f"Model: {model}")
    print(f"Temperature: {temperature}")
    print(f"Max tokens: {max_tokens}")
    print()
    
    if stream:
        return stream_chat(API_ENDPOINT, headers, payload)
    else:
        return non_stream_chat(API_ENDPOINT, headers, payload)


def non_stream_chat(endpoint, headers, payload):
    """Non-streaming chat completion."""
    try:
        response = requests.post(endpoint, headers=headers, json=payload, timeout=120)
        
        if response.status_code != 200:
            print(f"Error: API returned status {response.status_code}")
            print(f"Response: {response.text}")
            sys.exit(1)
        
        result = response.json()
        
        # Extract response
        if "choices" in result and len(result["choices"]) > 0:
            content = result["choices"][0].get("message", {}).get("content", "")
            usage = result.get("usage", {})
            
            print("=" * 50)
            print("Response:")
            print("=" * 50)
            print(content)
            print()
            print("=" * 50)
            print(f"Usage: {usage.get('total_tokens', 0)} tokens "
                  f"(prompt: {usage.get('prompt_tokens', 0)}, "
                  f"completion: {usage.get('completion_tokens', 0)})")
            print("=" * 50)
            
            return content
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


def stream_chat(endpoint, headers, payload):
    """Streaming chat completion."""
    try:
        response = requests.post(endpoint, headers=headers, json=payload, stream=True, timeout=120)
        
        if response.status_code != 200:
            print(f"Error: API returned status {response.status_code}")
            sys.exit(1)
        
        print("Response (streaming):")
        print("-" * 50)
        
        full_content = ""
        for line in response.iter_lines():
            if line:
                line = line.decode('utf-8')
                if line.startswith('data: '):
                    data = line[6:]
                    if data.strip() == '[DONE]':
                        break
                    try:
                        chunk = json.loads(data)
                        if "choices" in chunk and len(chunk["choices"]) > 0:
                            delta = chunk["choices"][0].get("delta", {})
                            content = delta.get("content", "")
                            if content:
                                print(content, end='', flush=True)
                                full_content += content
                    except json.JSONDecodeError:
                        continue
        
        print()
        print("-" * 50)
        
        return full_content
        
    except requests.exceptions.Timeout:
        print("\nError: Request timed out")
        sys.exit(1)
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        sys.exit(1)


def interactive_mode(model, temperature, max_tokens):
    """Interactive chat mode."""
    api_key = os.environ.get("MIXEDCLOUD_API_KEY") or DEFAULT_API_KEY
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    messages = []
    
    # Add system prompt if provided
    system_prompt = "You are a helpful AI assistant."
    messages.append({"role": "system", "content": system_prompt})
    
    print(f"🤖 Doubao Chat ({AVAILABLE_MODELS.get(model, {}).get('name', model)})")
    print("Type 'quit' or 'exit' to end the conversation.")
    print("Type 'clear' to clear chat history.")
    print("=" * 50)
    
    while True:
        try:
            user_input = input("\nYou: ").strip()
            
            if user_input.lower() in ['quit', 'exit']:
                print("Goodbye!")
                break
            
            if user_input.lower() == 'clear':
                messages = [{"role": "system", "content": system_prompt}]
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
            response = non_stream_chat(API_ENDPOINT, headers, payload)
            
            if response:
                messages.append({"role": "assistant", "content": response})
                
        except KeyboardInterrupt:
            print("\nGoodbye!")
            break
        except Exception as e:
            print(f"Error: {e}")


def main():
    parser = argparse.ArgumentParser(description="Doubao LLM Chat (MixedCloud)")
    parser.add_argument("prompt", nargs="?", help="Single prompt to send")
    parser.add_argument("--model", "-m", default=DEFAULT_MODEL, help="Model to use")
    parser.add_argument("--system", "-s", help="System prompt")
    parser.add_argument("--temperature", "-t", type=float, default=0.7, help="Temperature (0-2)")
    parser.add_argument("--max-tokens", type=int, default=4096, help="Max tokens to generate")
    parser.add_argument("--stream", action="store_true", help="Enable streaming")
    parser.add_argument("--interactive", "-i", action="store_true", help="Interactive chat mode")
    parser.add_argument("--list-models", action="store_true", help="List available models")
    
    args = parser.parse_args()
    
    if args.list_models:
        print("Available Doubao Models:")
        print("=" * 50)
        for model_id, info in AVAILABLE_MODELS.items():
            print(f"\n{model_id}")
            print(f"  Name: {info['name']}")
            print(f"  Context: {info['context']:,} tokens")
            print(f"  Description: {info['description']}")
        print()
        return
    
    if not args.prompt and not args.interactive:
        print("Usage: python chat.py <prompt> [options]")
        print("   or: python chat.py -i (interactive mode)")
        print("   or: python chat.py --list-models")
        print()
        print("Examples:")
        print("  python chat.py 'What is AI?'")
        print("  python chat.py 'Explain quantum computing' --model doubao-seed-2-0-lite-260215")
        print("  python chat.py -i")
        print()
        print("Available models:")
        for model_id in AVAILABLE_MODELS.keys():
            print(f"  - {model_id}")
        sys.exit(1)
    
    if args.interactive:
        interactive_mode(args.model, args.temperature, args.max_tokens)
    else:
        chat(args.prompt, args.model, args.system, args.temperature, args.max_tokens, args.stream)


if __name__ == "__main__":
    main()
