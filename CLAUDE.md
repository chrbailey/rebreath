# ReBreath — AI Music Reimaginer

## Overview

Upload your own music and AI reimagines it — stem separation, lyrics transcription, mood analysis, and genre transformation. Rights-clear by design.

**Stanford TECH-41 project** (Ata Tahiroglu's "Building AI Products Through Rapid Prototyping")

## Stack

| Layer | Tool |
|-------|------|
| Frontend | Next.js 16 + shadcn/ui + Wavesurfer.js |
| Backend | FastAPI (Python 3.9) |
| Stem separation | Demucs v4 (local, MIT) |
| Transcription | OpenAI Whisper (local) |
| Analysis | Claude API (Haiku) |
| Generation | TBD — MusicGen or ACE-Step |

## Running

```bash
./run.sh
# Or separately:
cd backend && source venv/bin/activate && uvicorn app.main:app --reload --port 8000
cd frontend && npm run dev
```

## Verification

```bash
# Frontend builds
cd frontend && npx next build

# Backend starts
cd backend && source venv/bin/activate && python3 -c "from app.main import app; print('OK')"
```

## Architecture

```
frontend/           Next.js app (port 3000)
  src/app/          App Router pages
  src/components/   UI components (upload, waveform, stems, analysis)
  src/lib/          API client, utilities

backend/            FastAPI app (port 8000)
  app/main.py       App entry, CORS, static file serving
  app/routers/      API routes (audio, analysis, generation)
  app/services/     AI pipeline (stems, transcription, analyzer)
  data/             uploads/, stems/, generated/
```

## Pipeline

1. **Upload** → save to `data/uploads/`
2. **Stem Separation** → Demucs → `data/stems/{model}/{track}/`
3. **Transcription** → Whisper → lyrics text + timestamps
4. **Analysis** → Claude Haiku → mood, energy, genres, themes
5. **Generation** → (Week 2) → reimagined versions

## Rules

- Python 3.9 compat: `Optional[str]` not `str | None`, `List[str]` not `list[str]`
- All audio processing runs locally. Zero external API costs except Claude analysis.
- Don't add cloud dependencies. The "zero cost" pitch is the differentiator.
