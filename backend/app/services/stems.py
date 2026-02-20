"""Stem separation using Demucs v4."""
from __future__ import annotations

import asyncio
from pathlib import Path
from typing import Dict, Optional


STEMS_DIR = Path(__file__).parent.parent.parent / "data" / "stems"


async def separate_stems(
    audio_path: Path,
    model: str = "htdemucs",
    output_dir: Optional[Path] = None,
) -> Dict[str, str]:
    """Run Demucs stem separation on an audio file.

    Returns dict mapping stem name to file path.
    Uses asyncio.create_subprocess_exec (not shell) for safety.
    """
    out = output_dir or STEMS_DIR
    out.mkdir(parents=True, exist_ok=True)

    # Run demucs as a subprocess — using create_subprocess_exec
    # (argument list, NOT shell string) to prevent injection
    cmd = [
        "python3", "-m", "demucs",
        "--out", str(out),
        "--name", model,
        "--mp3",
        str(audio_path),
    ]

    process = await asyncio.create_subprocess_exec(
        *cmd,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE,
    )
    stdout, stderr = await process.communicate()

    if process.returncode != 0:
        raise RuntimeError(f"Demucs failed: {stderr.decode()}")

    # Demucs outputs to: out/{model}/{track_name}/{stem}.mp3
    track_name = audio_path.stem
    stems_path = out / model / track_name

    if not stems_path.exists():
        raise FileNotFoundError(f"Stems not found at {stems_path}")

    stems = {}
    for stem_file in stems_path.iterdir():
        if stem_file.suffix in (".mp3", ".wav"):
            stems[stem_file.stem] = str(stem_file)

    return stems
