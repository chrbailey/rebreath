"""Music analysis using Claude API."""
from __future__ import annotations

import json
import os
from typing import Dict, Optional


async def analyze_track(
    lyrics: Optional[str] = None,
    filename: Optional[str] = None,
    duration_seconds: Optional[float] = None,
) -> Dict:
    """Analyze a music track for mood, energy, genre, and themes.

    Uses Claude API for analysis. Falls back to basic heuristics if API unavailable.
    """
    try:
        import anthropic

        client = anthropic.Anthropic()

        prompt_parts = ["Analyze this music track and return a JSON object with these fields:"]
        prompt_parts.append('- "mood": primary mood (e.g., "melancholic", "uplifting", "aggressive")')
        prompt_parts.append('- "energy": energy level 1-10')
        prompt_parts.append('- "genres": list of up to 3 genre tags')
        prompt_parts.append('- "themes": list of up to 5 thematic keywords')
        prompt_parts.append('- "tempo_feel": "slow", "medium", or "fast"')
        prompt_parts.append('- "description": 2-3 sentence description of the track')
        prompt_parts.append("")

        if filename:
            prompt_parts.append(f"Track filename: {filename}")
        if duration_seconds:
            prompt_parts.append(f"Duration: {duration_seconds:.1f} seconds")
        if lyrics:
            prompt_parts.append(f"\nLyrics:\n{lyrics}")
        else:
            prompt_parts.append("\n(No lyrics available — analyze based on available metadata)")

        prompt_parts.append("\nReturn ONLY the JSON object, no other text.")

        message = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=500,
            messages=[{"role": "user", "content": "\n".join(prompt_parts)}],
        )

        text = message.content[0].text.strip()
        # Strip markdown code fences if present
        if text.startswith("```"):
            text = text.split("\n", 1)[1]
            text = text.rsplit("```", 1)[0]

        return json.loads(text)

    except Exception as e:
        # Fallback analysis
        return {
            "mood": "unknown",
            "energy": 5,
            "genres": ["unknown"],
            "themes": ["music"],
            "tempo_feel": "medium",
            "description": f"Analysis unavailable: {str(e)}",
        }
