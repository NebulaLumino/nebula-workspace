# CLI to OpenClaw Skill Converter

Automatically convert existing CLI tools into OpenClaw/Agent Skills with proper schema introspection, input validation, and context optimization.

## Why This Tool?

Thousands of CLI tools exist that weren't built for AI agents. This converter retrofits them for OpenClaw consumption without rewriting the CLI itself.

## Features

- **Automatic Parsing**: Extract arguments and options from `--help` output
- **SKILL.yaml Generation**: Create proper OpenClaw skill metadata
- **SKILL.md Documentation**: Generate usage documentation
- **Multi-command Support**: Works with any CLI that has `--help`

## Installation

```bash
# Clone or download this tool
pip install pyyaml
```

## Usage

```bash
# Convert a CLI tool
python cli_to_skill.py <command>

# Example
python cli_to_skill.py memvid
python cli_to_skill.py gh
python cli_to_skill.py docker

# Output to custom directory
python cli_to_skill.py docker -o ./my-skills/
```

## Example Output

```bash
$ python cli_to_skill.py memvid
Converting 'memvid' to OpenClaw skill...
Found 30 arguments and 5 options
✓ Created skill in memvid/
```

## Generated Files

Each conversion creates:
- `SKILL.yaml` - OpenClaw skill metadata
- `SKILL.md` - Auto-generated documentation

## Supported CLI Tools

Tested with:
- memvid (memory)
- gh (GitHub CLI)
- git (with git-extras)
- docker (with docker CLI)

## Requirements

- Python 3.8+
- pyyaml
- CLI tool with `--help` support

## License

MIT
