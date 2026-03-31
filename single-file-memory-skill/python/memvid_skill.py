#!/usr/bin/env python3
"""
Single-File Agent Memory Skill for OpenClaw

Ultra-low latency, zero-infrastructure memory for AI agents using memvid.
"""

import subprocess
import json
import os
import sys
import argparse
from pathlib import Path

MEMVID_BIN = os.path.expanduser("~/.cargo/bin/memvid")

def run_memvid(args):
    """Run memvid command and return output."""
    cmd = [MEMVID_BIN] + args
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"Error: {result.stderr}", file=sys.stderr)
        sys.exit(1)
    return result.stdout

def cmd_create(args):
    """Create a new memory file."""
    filename = args.filename
    run_memvid(["create", filename])
    print(f"✓ Created memory: {filename}")

def cmd_put(args):
    """Add content to memory."""
    filename = args.memory
    input_file = args.input
    
    cmd = ["put", filename, "--input", input_file]
    if args.title:
        cmd.extend(["--title", args.title])
    if args.tag:
        for tag in args.tag:
            cmd.extend(["--tag", tag])
    
    run_memvid(cmd)
    print(f"✓ Added content to: {filename}")

def cmd_find(args):
    """Search memory."""
    filename = args.memory
    query = args.query
    
    output = run_memvid(["find", filename, "--query", query])
    print(output)

def cmd_ask(args):
    """Ask questions about memory."""
    filename = args.memory
    query = args.query
    
    output = run_memvid(["ask", filename, "--question", query, "--no-llm"])
    print(output)

def cmd_stats(args):
    """Show memory statistics."""
    filename = args.memory
    output = run_memvid(["stats", filename])
    print(output)

def cmd_timeline(args):
    """Show memory timeline."""
    filename = args.memory
    output = run_memvid(["timeline", filename])
    print(output)

def main():
    parser = argparse.ArgumentParser(
        description="Single-File Agent Memory Skill - Ultra-low latency memory for AI agents"
    )
    subparsers = parser.add_subparsers(dest="command", help="Commands")
    
    # create
    create_parser = subparsers.add_parser("create", help="Create a new memory file")
    create_parser.add_argument("filename", help="Memory file name")
    create_parser.set_defaults(func=cmd_create)
    
    # put
    put_parser = subparsers.add_parser("put", help="Add content to memory")
    put_parser.add_argument("memory", help="Memory file")
    put_parser.add_argument("--input", "-i", required=True, help="Input file")
    put_parser.add_argument("--title", "-t", help="Content title")
    put_parser.add_argument("--tag", action="append", help="Tags")
    put_parser.set_defaults(func=cmd_put)
    
    # find
    find_parser = subparsers.add_parser("find", help="Search memory")
    find_parser.add_argument("memory", help="Memory file")
    find_parser.add_argument("--query", "-q", required=True, help="Search query")
    find_parser.set_defaults(func=cmd_find)
    
    # ask
    ask_parser = subparsers.add_parser("ask", help="Ask questions about memory")
    ask_parser.add_argument("memory", help="Memory file")
    ask_parser.add_argument("--query", "-q", required=True, help="Question")
    ask_parser.set_defaults(func=cmd_ask)
    
    # stats
    stats_parser = subparsers.add_parser("stats", help="Show memory statistics")
    stats_parser.add_argument("memory", help="Memory file")
    stats_parser.set_defaults(func=cmd_stats)
    
    # timeline
    timeline_parser = subparsers.add_parser("timeline", help="Show memory timeline")
    timeline_parser.add_argument("memory", help="Memory file")
    timeline_parser.set_defaults(func=cmd_timeline)
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        return
    
    args.func(args)

if __name__ == "__main__":
    main()
