# Examples for Single-File Agent Memory Skill

## Basic Usage

### Create and Use Memory

```bash
# Create a new memory file
memvid create agent-memory.mv2

# Add documents
memvid put agent-memory.mv2 --input ./docs/

# Search
memvid find agent-memory.mv2 --query "project requirements"

# Ask questions
memvid ask agent-memory.mv2 --query "What does the user want?"
```

## Python Integration

```python
from memvid_skill import MemvidSkill

# Initialize
skill = MemvidSkill()
filename = "my-agent.mv2"

# Create memory
skill.create_memory(filename)

# Add content
skill.add_content(
    filename,
    "User prefers Python over JavaScript",
    "Preference",
    ["python", "preferences"]
)

# Search
results = skill.search(filename, "python programming")
for r in results:
    print(r['content'])

# Timeline
timeline = skill.timeline(filename)
```

## OpenClaw Integration

```yaml
# skill.yaml
commands:
  - name: "memvid create"
    handler: "python memvid_skill.py create"
  - name: "memvid add"
    handler: "python memvid_skill.py add"
  - name: "memvid search"
    handler: "python memvid_skill.py search"
```

## Use Cases

### 1. Long-running Agent Memory

```bash
# Create persistent memory
memvid create session.mv2

# After each task
memvid put session.mv2 --input ./task-summary.txt --title "Task Complete"

# Next session - search past
memvid find session.mv2 --query "previous tasks"
```

### 2. Codebase Understanding

```bash
# Index codebase
memvid create codebase.mv2
memvid put-many codebase.mv2 --glob "**/*.py"

# Ask about code
memvid ask codebase.mv2 --query "How does authentication work?"
```

### 3. Knowledge Base

```bash
# Create knowledge base
memvid create kb.mv2
memvid put kb.mv2 --input ./docs/*.md

# Search
memvid find kb.mv2 --query "installation guide"
```

## Performance Tips

1. **Batch adding**: Use `memvid put-many` for multiple files
2. **Choose right embedding**: Use `bge-small` for speed, `nomic` for accuracy
3. **Use timeline**: Track knowledge evolution over time
4. **Encrypted capsules**: Use `.mv2e` for sensitive data
