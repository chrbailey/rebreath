"""ReBreath API — AI Music Reimaginer backend."""
from __future__ import annotations

import os
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.routers import audio, analysis, generation

DATA_DIR = Path(__file__).parent.parent / "data"
UPLOAD_DIR = DATA_DIR / "uploads"
STEMS_DIR = DATA_DIR / "stems"
GENERATED_DIR = DATA_DIR / "generated"

for d in [UPLOAD_DIR, STEMS_DIR, GENERATED_DIR]:
    d.mkdir(parents=True, exist_ok=True)

app = FastAPI(
    title="ReBreath API",
    description="AI Music Reimaginer — stem separation, analysis, and generation",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve processed audio files
app.mount("/files/stems", StaticFiles(directory=str(STEMS_DIR)), name="stems")
app.mount("/files/generated", StaticFiles(directory=str(GENERATED_DIR)), name="generated")
app.mount("/files/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

app.include_router(audio.router, prefix="/api/audio", tags=["audio"])
app.include_router(analysis.router, prefix="/api/analysis", tags=["analysis"])
app.include_router(generation.router, prefix="/api/generation", tags=["generation"])


@app.get("/api/health")
async def health():
    return {"status": "ok", "version": "0.1.0"}
