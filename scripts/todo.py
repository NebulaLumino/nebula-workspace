#!/usr/bin/env python3
"""
Project Todo Tracker
Manages todos for ongoing projects, stores in JSON for cron integration.
"""
import json
import os
import sys
from datetime import datetime
from pathlib import Path

TODO_FILE = Path("memory/project-todos.json")

def load_todos():
    if TODO_FILE.exists():
        with open(TODO_FILE) as f:
            return json.load(f)
    return {"todos": [], "completed": []}

def save_todos(data):
    TODO_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(TODO_FILE, "w") as f:
        json.dump(data, f, indent=2)

def list_todos():
    data = load_todos()
    print("📋 ACTIVE TODOS:")
    for i, todo in enumerate(data["todos"], 1):
        priority = todo.get("priority", "medium")
        emoji = {"high": "🔴", "medium": "🟡", "low": "🟢"}.get(priority, "🟡")
        print(f"  {i}. {emoji} {todo['title']}")
        if todo.get("description"):
            print(f"     → {todo['description']}")
    
    if data.get("completed"):
        print("\n✅ COMPLETED (recent):")
        for c in data["completed"][-5:]:
            print(f"  • {c['title']} ({c.get('completed_at', 'unknown')})")
    
    if not data["todos"]:
        print("  No active todos!")

def add_todo(title, description="", priority="medium"):
    data = load_todos()
    todo = {
        "title": title,
        "description": description,
        "priority": priority,
        "created_at": datetime.now().isoformat()
    }
    data["todos"].append(todo)
    save_todos(data)
    print(f"✓ Added: {title}")

def complete_todo(index):
    data = load_todos()
    try:
        todo = data["todos"].pop(index - 1)
        todo["completed_at"] = datetime.now().isoformat()
        data["completed"].append(todo)
        save_todos(data)
        print(f"✓ Completed: {todo['title']}")
    except IndexError:
        print(f"Error: No todo at index {index}")

def main():
    if len(sys.argv) < 2:
        list_todos()
        return
    
    cmd = sys.argv[1]
    
    if cmd == "list" or cmd == "ls":
        list_todos()
    elif cmd == "add" and len(sys.argv) >= 3:
        title = sys.argv[2]
        desc = sys.argv[3] if len(sys.argv) > 3 else ""
        prio = sys.argv[4] if len(sys.argv) > 4 else "medium"
        add_todo(title, desc, prio)
    elif cmd == "done" and len(sys.argv) >= 3:
        try:
            complete_todo(int(sys.argv[2]))
        except ValueError:
            print("Usage: todo done <index>")
    elif cmd == "help":
        print("""
Project Todo Tracker

Usage:
  python3 scripts/todo.py [command]

Commands:
  list / ls          Show all todos
  add <title> [desc] [priority]   Add new todo (priority: high/medium/low)
  done <index>       Mark todo as complete

Examples:
  python3 scripts/todo.py add "Test MixedCloud API" "Verify Seedream works" high
  python3 scripts/todo.py list
  python3 scripts/todo.py done 1
        """)
    else:
        print(f"Unknown command: {cmd}")
        print("Run: python3 scripts/todo.py help")

if __name__ == "__main__":
    main()
