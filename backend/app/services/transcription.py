"""Lyrics transcription using Whisper."""
from __future__ import annotations

import asyncio
import json
import shutil
from pathlib import Path
from typing import Dict, Optional


async def transcribe_audio(
    audio_path: Path,
    model: str = "base",
    language: Optional[str] = "en",
) -> Dict:
    """Transcribe audio using whisper (Python library, loaded in-process).

    Returns dict with text, segments, and language.
    """
    # Use Python whisper library directly via subprocess
    # (runs in separate process to avoid blocking the event loop)
    return await _transcribe_whisper(audio_path, model, language)


async def _transcribe_whisper(
    audio_path: Path,
    model: str,
    language: Optional[str],
) -> Dict:
    """Transcribe using OpenAI whisper Python library in a thread."""
    import functools

    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(
        None,
        functools.partial(_sync_transcribe, audio_path, model, language),
    )


def _sync_transcribe(
    audio_path: Path,
    model: str,
    language: Optional[str],
) -> Dict:
    """Synchronous whisper transcription."""
    import whisper as whisper_lib

    whisper_model = whisper_lib.load_model(model)
    result = whisper_model.transcribe(str(audio_path), language=language or "en")

    segments = [
        {"start": s["start"], "end": s["end"], "text": s["text"]}
        for s in result["segments"]
    ]

    return {
        "text": result["text"],
        "segments": segments,
        "language": result.get("language", language),
    }
