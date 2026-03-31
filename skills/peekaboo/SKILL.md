# Peekaboo Skill

macOS UI automation - capture screens, click elements, navigate, take screenshots.

## Status

**⚠️ Permissions Required**

Before use, grant permissions in **System Settings > Privacy & Security**:
- **Screen Recording** - Required
- **Accessibility** - Required

## Capabilities

- **Capture**: Screenshots, live capture, video frame extraction
- **Inspect**: List apps, windows, menus, UI elements
- **Interact**: Click, drag, scroll, type, hotkeys
- **Window Management**: Move, resize, focus, switch spaces
- **Vision**: Annotated UI maps, element detection

## Commands

### Screenshot
```bash
peekaboo image --mode screen --path /tmp/screen.png
peekaboo image --app Safari --analyze "Describe this page"
```

### See (Inspect UI)
```bash
peekaboo see --annotate --path /tmp/ui.png
peekaboo see --app Safari
```

### Click
```bash
peekaboo click --on B3 --app Safari
peekaboo click --coords 500,300
```

### Type
```bash
peekaboo type "Hello World" --return
peekaboo press tab
```

### Window Management
```bash
peekaboo app launch "Safari"
peekaboo window move --app Safari --x 100 --y 100
peekaboo window set-size --app Safari --width 1200 --height 800
```

### List Elements
```bash
peekaboo list apps --json
peekaboo list windows --json
peekaboo menubar list --json
```

## Quick Test (Once Permissions Granted)

```bash
peekaboo permissions
peekaboo list apps --json
peekaboo see --annotate --path /tmp/screen.png
```

## Installation

Already installed at `/opt/homebrew/bin/peekaboo`

Grant permissions:
1. Open **System Settings**
2. Go to **Privacy & Security**
3. Enable **Screen Recording** for Terminal/OpenClaw
4. Enable **Accessibility** for Terminal/OpenClaw
