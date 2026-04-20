# ReBreath

> AI Music Reimaginer. Upload a track, separate stems, transcribe lyrics, analyze mood, and (in progress) regenerate it in a new genre. Built as a Stanford Continuing Studies class project.

## What this is

A class project for **Stanford TECH-41: "Building AI Products Through Rapid Prototyping"** (Ata Tahiroglu). Two-service app:

- **Backend** — FastAPI (Python 3.9) on port 8000. Runs Demucs v4 for stem separation, OpenAI Whisper for transcription, and calls the Claude API (Haiku) for mood/energy/genre analysis. All audio models run locally.
- **Frontend** — Next.js 16 + React 19 + shadcn/ui + Wavesurfer.js on port 3000. Upload, waveform view, stems, analysis UI.

The pitch: upload your own music, AI reimagines it. Rights-clear by design because all audio processing is local. The only external API call is Claude for text analysis.

## What this is NOT

- **Not actively maintained.** This is a class-project archive.
- **Not a product.** There is no hosted version, no user accounts, no payment flow.
- **Not feature-complete.** The generation step (MusicGen or ACE-Step) was "Week 2" work and the repo does not include a working generator — analysis and stem/lyrics extraction work; regeneration is TBD.
- **Not a library.** It is a full-stack app, not a reusable package.

## Pipeline (what works)

1. Upload WAV/MP3 → `backend/data/uploads/`
2. Stem separation via Demucs → `backend/data/stems/{model}/{track}/`
3. Transcription via Whisper → lyrics text + word-level timestamps
4. Analysis via Claude Haiku → mood, energy, genre tags, themes
5. Generation → **not implemented in this repo**

## Running

Requires Python 3.9+ with a working PyTorch install (the repo uses `torch==2.8.0`, `torchaudio==2.8.0`) and Node.js for the frontend.

```bash
# First-time setup
cd backend
python3.9 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env      # add ANTHROPIC_API_KEY

cd ../frontend
npm install

# Run both services
cd ..
./run.sh
# Frontend: http://localhost:3000
# Backend:  http://localhost:8000
# API docs: http://localhost:8000/docs
```

## Stack

| Layer            | Choice                                |
|------------------|---------------------------------------|
| Stem separation  | Demucs v4 (local, MIT)                |
| Transcription    | OpenAI Whisper (local)                |
| Analysis         | Claude Haiku (`anthropic` SDK)        |
| Generation       | TBD — MusicGen or ACE-Step            |
| Backend          | FastAPI, Uvicorn, Pydantic v2         |
| Frontend         | Next.js 16, React 19, Wavesurfer.js   |

## Known limitations

- Python 3.9 pinned by the course — type hints use `Optional[str]` / `List[str]`, not `str | None`.
- Demucs and Whisper model downloads happen on first run and are large.
- No tests, no CI.
- Generation step is not implemented.
- Designed to run locally on a single developer machine. No multi-user or production concerns.

## Related

Other projects in the Stanford TECH-41 cohort are not linked here.

## License

MIT. See [LICENSE](LICENSE).
