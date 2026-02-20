"""Music generation/reimagination routes."""
from __future__ import annotations

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class ReimaginRequest(BaseModel):
    track_id: str
    style: str  # e.g., "jazz", "lo-fi", "electronic"
    preserve_vocals: bool = True


@router.post("/reimagine")
async def reimagine(request: ReimaginRequest):
    """Reimagine a track in a different style.

    TODO: Wire up MusicGen or ACE-Step for actual generation.
    For MVP, this returns a placeholder.
    """
    return {
        "status": "pending",
        "track_id": request.track_id,
        "style": request.style,
        "message": "Generation pipeline coming in Week 2",
    }
