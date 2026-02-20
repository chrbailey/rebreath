"use client";

import { useState } from "react";
import { WaveformPlayer } from "./waveform-player";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fileUrl } from "@/lib/api";

interface StemPlayerProps {
  stems: Record<string, string>;
  trackId: string;
}

const STEM_COLORS: Record<string, string> = {
  vocals: "#ec4899",
  drums: "#f59e0b",
  bass: "#10b981",
  other: "#6366f1",
};

const STEM_ORDER = ["vocals", "drums", "bass", "other"];

export function StemPlayer({ stems, trackId }: StemPlayerProps) {
  const [mutedStems, setMutedStems] = useState<Set<string>>(new Set());

  const orderedStems = STEM_ORDER.filter((s) => s in stems);

  const toggleMute = (stem: string) => {
    setMutedStems((prev) => {
      const next = new Set(prev);
      if (next.has(stem)) {
        next.delete(stem);
      } else {
        next.add(stem);
      }
      return next;
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Separated Stems
          <Badge variant="secondary">{orderedStems.length} stems</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {orderedStems.map((stem) => (
          <div
            key={stem}
            className={`transition-opacity ${
              mutedStems.has(stem) ? "opacity-30" : ""
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <button
                onClick={() => toggleMute(stem)}
                className="text-xs px-2 py-0.5 rounded border hover:bg-muted transition-colors"
                style={{
                  borderColor: STEM_COLORS[stem] || "#6366f1",
                  color: mutedStems.has(stem)
                    ? "var(--muted-foreground)"
                    : STEM_COLORS[stem] || "#6366f1",
                }}
              >
                {mutedStems.has(stem) ? "MUTED" : "SOLO"}
              </button>
            </div>
            {!mutedStems.has(stem) && (
              <WaveformPlayer
                url={fileUrl(stems[stem])}
                label={stem}
                color={STEM_COLORS[stem] || "#6366f1"}
                height={60}
              />
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
