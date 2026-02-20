"""Analysis routes — transcription and music analysis."""
from __future__ import annotations

from pathlib import Path
from typing import List, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.transcription import transcribe_audio
from app.services.analyzer import analyze_track

router = APIRouter()

DATA_DIR = Path(__file__).parent.parent.parent / "data"
UPLOAD_DIR = DATA_DIR / "uploads"


class TranscriptionResponse(BaseModel):
    track_id: str
    text: str
    segments: list
    language: str


class AnalysisResponse(BaseModel):
    track_id: str
    mood: str
    energy: int
    genres: List[str]
    themes: List[str]
    tempo_feel: str
    description: str


@router.post("/transcribe/{track_id}", response_model=TranscriptionResponse)
async def transcribe(track_id: str, model: str = "base"):
    """Transcribe lyrics from a track."""
    matches = list(UPLOAD_DIR.glob(f"{track_id}_*"))
    if not matches:
        raise HTTPException(404, f"Track {track_id} not found")

    try:
        result = await transcribe_audio(matches[0], model=model)
    except Exception as e:
        raise HTTPException(500, f"Transcription failed: {str(e)}")

    return TranscriptionResponse(
        track_id=track_id,
        text=result["text"],
        segments=result["segments"],
        language=result.get("language", "en"),
    )


@router.post("/analyze/{track_id}", response_model=AnalysisResponse)
async def analyze(track_id: str, lyrics: Optional[str] = None):
    """Analyze a track for mood, genre, energy, and themes."""
    matches = list(UPLOAD_DIR.glob(f"{track_id}_*"))
    if not matches:
        raise HTTPException(404, f"Track {track_id} not found")

    audio_path = matches[0]

    try:
        result = await analyze_track(
            lyrics=lyrics,
            filename=audio_path.name,
            duration_seconds=None,  # TODO: get from audio metadata
        )
    except Exception as e:
        raise HTTPException(500, f"Analysis failed: {str(e)}")

    return AnalysisResponse(
        track_id=track_id,
        mood=result.get("mood", "unknown"),
        energy=result.get("energy", 5),
        genres=result.get("genres", []),
        themes=result.get("themes", []),
        tempo_feel=result.get("tempo_feel", "medium"),
        description=result.get("description", ""),
    )
