"use client";

import { useState } from "react";
import { WaveformPlayer } from "./waveform-player";
import { fileUrl } from "@/lib/api";
import { Mic, Drum, Guitar, Waves } from "lucide-react";

interface StemPlayerProps {
  stems: Record<string, string>;
  trackId: string;
}

const STEM_CONFIG: Record<
  string,
  { color: string; icon: typeof Mic; label: string }
> = {
  vocals: { color: "#e879a0", icon: Mic, label: "Vocals" },
  drums: { color: "#f0a840", icon: Drum, label: "Drums" },
  bass: { color: "#34c88a", icon: Guitar, label: "Bass" },
  other: { color: "#818cf8", icon: Waves, label: "Other" },
};

const STEM_ORDER = ["vocals", "drums", "bass", "other"];

export function StemPlayer({ stems }: StemPlayerProps) {
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
    <div className="space-y-1 stagger-children">
      {orderedStems.map((stem) => {
        const config = STEM_CONFIG[stem];
        const Icon = config.icon;
        const isMuted = mutedStems.has(stem);

        return (
          <div
            key={stem}
            className={`relative rounded-lg border transition-all duration-300 ${
              isMuted
                ? "opacity-40 border-border/30 bg-transparent"
                : "border-border/50 bg-card/50"
            }`}
          >
            {/* Subtle left accent bar */}
            {!isMuted && (
              <div
                className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full"
                style={{ backgroundColor: config.color }}
              />
            )}

            <div className="p-4 pl-5">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="flex items-center justify-center w-7 h-7 rounded-md transition-colors"
                  style={{
                    backgroundColor: isMuted
                      ? "transparent"
                      : `${config.color}15`,
                    color: isMuted
                      ? "var(--muted-foreground)"
                      : config.color,
                  }}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{
                    color: isMuted
                      ? "var(--muted-foreground)"
                      : config.color,
                  }}
                >
                  {config.label}
                </span>
                <button
                  onClick={() => toggleMute(stem)}
                  className="ml-auto text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded transition-all duration-200 hover:scale-105 active:scale-95"
                  style={{
                    backgroundColor: isMuted ? "var(--muted)" : `${config.color}15`,
                    color: isMuted ? "var(--muted-foreground)" : config.color,
                    border: `1px solid ${isMuted ? "var(--border)" : `${config.color}25`}`,
                  }}
                >
                  {isMuted ? "Muted" : "Active"}
                </button>
              </div>

              {!isMuted && (
                <div className="animate-fade-in">
                  <WaveformPlayer
                    url={fileUrl(stems[stem])}
                    label={stem}
                    color={config.color}
                    height={52}
                  />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
