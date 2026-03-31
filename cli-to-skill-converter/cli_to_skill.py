#!/usr/bin/env python3
"""
CLI to OpenClaw Skill Converter

Automatically converts existing CLI tools into OpenClaw/Agent Skills
with proper schema introspection, input validation, and context optimization.
"""

import subprocess
import argparse
import re
import os
import sys
import yaml
from pathlib import Path

def get_help_text(command):
    """Get --help output from a CLI command."""
    try:
        result = subprocess.run(
            [command, '--help'],
            capture_output=True,
            text=True,
            timeout=30
        )
        return result.stdout + result.stderr
    except subprocess.TimeoutExpired:
        return None
    except FileNotFoundError:
        return None

def parse_arguments(help_text):
    """Parse argument patterns from --help output."""
    seen = set()
    arguments = []
    
    # Common noise words to skip (very common/ambiguous)
    skip_words = {'h', 'help', 'v', 'version', 'verbose', 'd', 'debug', 
                  'y', 'yes', 'n', 'no', 'q', 'quiet', 'f', 'force',
                  'l', 'list', 'o', 'output', 'i', 'input', 'e', 'error',
                  'w', 'warn', 'color', 'ansi', 'json', 'yaml', 'toml',
                  'foo', 'bar', 'baz', 'value', 'key', 'term',
                  'file', 'dir', 'name', 'type', 'url', 'host', 'port',
                  'user', 'pass', 'env', 'var', 'arg', 'cmd', 'command',
                  'search', 'test', 'ci-test', 'dupes', 'formatted', 'tag',
                  'C', 'c', 'exec-path', 'html-path', 'man-path', 'info-path',
                  'p', 'paginate', 'P', 'no-pager', 'no-replace-objects',
                  'no-lazy-fetch', 'no-optional-locks', 'no-advice', 'bare',
                  'git-dir', 'work-tree', 'namespace', 'config-env', 'a', 'g',
                  'envvar', 'args', 'concept', 'all', 'any', 'none', 'auto',
                  'string', 'bool', 'int', 'boolean', 'path'}
    
    # Pattern for arguments: -s, --long, <arg>
    arg_pattern = r'(-{1,2})([a-zA-Z0-9\-]+)(?:[=\s]<([^>]+)>)?'
    
    # Pattern for positional arguments (after subcommand-like words)
    positional_pattern = r'(?:Usage:|command:|<)([a-zA-Z0-9\-_]+)(?:[>:\s]|$)'
    
    # Find all arguments
    for match in re.finditer(arg_pattern, help_text):
        short, long_name, arg_type = match.groups()
        # Skip noise
        if long_name in skip_words:
            continue
        if long_name in seen:
            continue
        seen.add(long_name)
        arguments.append({
            'name': long_name,
            'type': arg_type or 'string',
            'required': False,
            'description': ''
        })
    
    # Find subcommands (lines that look like commands)
    subcommands = set()
    usage_match = re.search(r'Usage:\s*(\w+)\s+(\w+)', help_text)
    if usage_match:
        subcommands.add(usage_match.group(2))
    
    # Look for Commands: section
    cmd_section = re.search(r'Commands:(.+?)(?:\n\n|\n[A-Z])', help_text, re.DOTALL)
    if cmd_section:
        cmd_text = cmd_section.group(1)
        for line in cmd_text.strip().split('\n'):
            # Extract command names
            cmd_match = re.match(r'\s+(\w+)', line)
            if cmd_match:
                subcommands.add(cmd_match.group(1))
    
    # Find positional arguments (filter out noise and subcommands)
    for match in re.finditer(positional_pattern, help_text):
        arg_name = match.group(1)
        # Skip if already captured, noise, or is a subcommand
        if arg_name in seen or arg_name in skip_words or arg_name in subcommands:
            continue
        if len(arg_name) < 2:  # Skip single letters
            continue
        seen.add(arg_name)
        arguments.append({
            'name': arg_name,
            'type': 'string',
            'required': True,
            'description': ''
        })
    
    return arguments, list(subcommands)

def parse_description(help_text):
    """Extract command description from help text."""
    lines = help_text.split('\n')
    
    # First non-empty line is usually the description
    for line in lines:
        line = line.strip()
        if line and not line.startswith('-') and not line.startswith('<'):
            # Clean up the line
            line = re.sub(r'\s+', ' ', line)
            return line[:200]  # Limit length
    
    return "CLI tool converted to OpenClaw skill"

def parse_options(help_text):
    """Parse options/flags from help text."""
    options = {}
    
    # Look for option descriptions
    lines = help_text.split('\n')
    for i, line in enumerate(lines):
        # Match lines like: -v, --verbose   Increase verbosity
        match = re.match(r'\s*(-[a-z],?\s+)?--([a-zA-Z0-9\-]+)\s+(.+)$', line)
        if match:
            short, long_name, desc = match.groups()
            desc = desc.strip()
            # Get next line as description if available
            if i + 1 < len(lines):
                next_line = lines[i + 1].strip()
                if next_line and not next_line.startswith('-'):
                    desc = next_line[:100]
            options[long_name] = desc
    
    return options

def generate_skill_yaml(command, description, arguments, options):
    """Generate SKILL.yaml content."""
    skill = {
        'name': command.replace('-', ' ').title().replace(' ', ''),
        'description': description,
        'version': '0.1.0',
        'author': 'cli-to-skill-converter',
        'capabilities': ['cli', 'automation'],
        'commands': [],
        'dependencies': {
            'command': command
        },
        'tags': ['cli', 'converted', 'automation']
    }
    
    # Add main command
    skill['commands'].append({
        'name': command,
        'description': description,
        'usage': f'{command} ' + ' '.join([f'--{a["name"]}' for a in arguments[:3]]),
        'handler': f'shell:{command}'
    })
    
    return skill

def generate_skill_md(command, arguments, options, description, subcommands=None):
    """Generate SKILL.md documentation."""
    if subcommands is None:
        subcommands = []
    
    md = f"""# {command}

{description}

## Commands

### {command}

```
{command} [options] [command]
```
"""
    
    if subcommands:
        md += """## Available Commands

| Command | Description |
|---------|-------------|
"""
        for cmd in subcommands:
            md += f"| `{cmd}` | Run {command} {cmd} |\n"
        md += "\n"
    
    md += """## Arguments

| Argument | Type | Description |
|----------|------|-------------|
"""
    
    for arg in arguments:
        md += f"| `{arg['name']}` | {arg['type']} | {arg.get('description', '')} |\n"
    
    md += """
## Options

"""
    
    for opt, desc in options.items():
        md += f"- `--{opt}`: {desc}\n"
    
    example_arg = arguments[0]['name'] if arguments else 'help'
    example_cmd = subcommands[0] if subcommands else ''
    
    md += f"""
## Example Usage

```bash
# Basic usage
{command}

"""
    if subcommands:
        md += f"""# Run a subcommand
{command} {example_cmd}

"""
    md += f"""# With arguments
{command} --{example_arg} value
```

## Conversion Notes

Generated by CLI-to-Skill Converter
"""
    
    return md

def generate_handler_script(command, arguments, subcommands=None):
    """Generate a shell script handler for the skill."""
    if subcommands is None:
        subcommands = []
    
    script = f"""#!/bin/bash
# Handler script for {command} CLI
# Generated by CLI-to-Skill Converter

COMMAND="{command}"

# Build command arguments
ARGS=()

while [[ $# -gt 0 ]]; do
    case $1 in
"""
    
    # Add argument handling
    for arg in arguments:
        script += f"""        --{arg['name']})
            ARGS+=("--{arg['name']}" "$2")
            shift 2
            ;;
"""
    
    script += """        -*)
            echo "Unknown option: $1"
            exit 1
            ;;
        *)
            ARGS+=("$1")
            shift
            ;;
    esac
done

# Execute command
exec "$COMMAND" "${ARGS[@]}"
"""
    return script

def convert_cli(command, output_dir='.'):
    """Convert a CLI tool to an OpenClaw skill."""
    print(f"Converting '{command}' to OpenClaw skill...")
    
    # Get help text
    help_text = get_help_text(command)
    if not help_text:
        print(f"Error: Could not get help for '{command}'")
        return False
    
    # Parse help text
    description = parse_description(help_text)
    arguments, subcommands = parse_arguments(help_text)
    options = parse_options(help_text)
    
    print(f"Found {len(arguments)} arguments, {len(options)} options, and {len(subcommands)} subcommands")
    
    # Create output directory
    skill_dir = Path(output_dir) / command
    skill_dir.mkdir(parents=True, exist_ok=True)
    
    # Generate SKILL.yaml
    skill_yaml = generate_skill_yaml(command, description, arguments, options)
    with open(skill_dir / 'SKILL.yaml', 'w') as f:
        yaml.dump(skill_yaml, f, default_flow_style=False)
    
    # Generate SKILL.md
    skill_md = generate_skill_md(command, arguments, options, description, subcommands)
    with open(skill_dir / 'SKILL.md', 'w') as f:
        f.write(skill_md)
    
    # Generate handler script
    handler_script = generate_handler_script(command, arguments, subcommands)
    with open(skill_dir / 'handler.sh', 'w') as f:
        f.write(handler_script)
    os.chmod(skill_dir / 'handler.sh', 0o755)
    
    print(f"✓ Created skill in {skill_dir}/")
    return True

def main():
    parser = argparse.ArgumentParser(
        description='Convert CLI tools to OpenClaw Skills'
    )
    parser.add_argument('command', help='CLI command to convert')
    parser.add_argument('-o', '--output', default='.', help='Output directory')
    
    args = parser.parse_args()
    
    success = convert_cli(args.command, args.output)
    sys.exit(0 if success else 1)

if __name__ == '__main__':
    main()
