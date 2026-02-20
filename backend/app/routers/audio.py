"""Audio upload and stem separation routes."""
from __future__ import annotations

import uuid
from pathlib import Path
from typing import Dict

from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel

from app.services.stems import separate_stems

router = APIRouter()

DATA_DIR = Path(__file__).parent.parent.parent / "data"
UPLOAD_DIR = DATA_DIR / "uploads"

ALLOWED_EXTENSIONS = {".mp3", ".wav", ".flac", ".m4a", ".ogg", ".aac"}
MAX_FILE_SIZE = 100 * 1024 * 1024  # 100MB


class UploadResponse(BaseModel):
    track_id: str
    filename: str
    size: int
    path: str


class StemsResponse(BaseModel):
    track_id: str
    stems: Dict[str, str]


@router.post("/upload", response_model=UploadResponse)
async def upload_audio(file: UploadFile = File(...)):
    """Upload an audio file for processing."""
    if not file.filename:
        raise HTTPException(400, "No filename provided")

    ext = Path(file.filename).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            400,
            f"Unsupported format: {ext}. Allowed: {', '.join(ALLOWED_EXTENSIONS)}",
        )

    track_id = str(uuid.uuid4())[:8]
    safe_name = f"{track_id}_{Path(file.filename).stem}{ext}"
    file_path = UPLOAD_DIR / safe_name

    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(400, f"File too large. Max: {MAX_FILE_SIZE // 1024 // 1024}MB")

    file_path.write_bytes(content)

    return UploadResponse(
        track_id=track_id,
        filename=file.filename,
        size=len(content),
        path=str(file_path),
    )


@router.post("/separate/{track_id}", response_model=StemsResponse)
async def separate(track_id: str, model: str = "htdemucs"):
    """Run stem separation on an uploaded track."""
    # Find the uploaded file
    matches = list(UPLOAD_DIR.glob(f"{track_id}_*"))
    if not matches:
        raise HTTPException(404, f"Track {track_id} not found")

    audio_path = matches[0]

    try:
        stems = await separate_stems(audio_path, model=model)
    except Exception as e:
        raise HTTPException(500, f"Stem separation failed: {str(e)}")

    # Convert absolute paths to relative URLs
    stem_urls = {}
    for name, path in stems.items():
        rel = Path(path).relative_to(DATA_DIR.parent / "data")
        stem_urls[name] = f"/files/{rel}"

    return StemsResponse(track_id=track_id, stems=stem_urls)


@router.get("/tracks")
async def list_tracks():
    """List all uploaded tracks."""
    tracks = []
    for f in UPLOAD_DIR.iterdir():
        if f.suffix.lower() in ALLOWED_EXTENSIONS:
            parts = f.stem.split("_", 1)
            track_id = parts[0]
            original_name = parts[1] if len(parts) > 1 else f.stem
            tracks.append({
                "track_id": track_id,
                "filename": f"{original_name}{f.suffix}",
                "size": f.stat().st_size,
            })
    return tracks
