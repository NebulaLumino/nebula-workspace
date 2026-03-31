# TTS/Voice Research

## Options for Voice/TTS Integration

### 1. ElevenLabs (Recommended for quality)
- **Website**: elevenlabs.io
- **CLI Options**:
  - Official: `@elevenlabs/cli` (npm install)
  - Community: `elevenlabs-cli` (hongkongkiwi)
- **Models**: v3 (emotion-rich), v2
- **Voices**: 70+ languages, custom voice cloning
- **Pros**: Highest quality, expressive voices
- **Cons**: Paid (free tier limited)

### 2. OpenAI TTS
- **Website**: developers.openai.com/docs/guides/text-to-speech
- **CLI Options**:
  - `tts-cli` (Go)
  - `ospeak` (Python)
  - Custom wrapper
- **Models**: `tts-1`, `tts-1-hd`, `gpt-4o-mini-tts`
- **Pros**: Fast, cheap, integrated with OpenAI ecosystem
- **Cons**: Less expressive than ElevenLabs

### 3. Cloudflare TexttoSpeech
- **Website**: developers.cloudflare.com
- **Pricing**: Very competitive
- **Models**: Multiple voices

### 4. Coqui TTS (Open Source)
- **Website**: coqui.ai
- **Pros**: Free, self-hostable
- **Cons**: Quality varies, requires local compute

## Installation Options

### ElevenLabs CLI (Official)
```bash
npm install -g @elevenlabs/cli
elevenlabs authenticate
```

### ElevenLabs CLI (Community)
```bash
brew install hongkongkiwi/tap/elevenlabs-cli
```

### OpenAI TTS Wrapper
```bash
# Using ospeak (Python)
pip install ospeak

# Or tts-cli (Go)
go install github.com/perbu/tts-cli@latest
```

## Usage Examples

### ElevenLabs
```bash
elevenlabs tts --text "Hello world" --voice Rachel --output hello.mp3
```

### OpenAI (ospeak)
```bash
ospeak "Hello world" -o hello.mp3 -v alloy
```

## Skill Ideas

1. **Storytelling Skill**: Use TTS to read articles/summaries aloud
2. **Voice Notification**: Notify via TTS for important events
3. **Audio Book**: Convert long-form content to audio
4. **Voice Commands**: Combined with Whisper for voice input

## Integration with OpenClaw

Can be called via exec in skills:
```python
import subprocess
subprocess.run(["elevenlabs", "tts", "--text", text, "--output", "output.mp3"])
```

## To Install Next Steps

1. Get ElevenLabs API key from elevenlabs.io
2. Install CLI: `npm install -g @elevenlabs/cli`
3. Add key to 1Password
4. Create TTS skill wrapper
