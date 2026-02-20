"use client";

import { Badge } from "@/components/ui/badge";
import { Disc3, Music, Zap, Clock, Tag, MessageSquareText } from "lucide-react";
import type { AnalysisResponse, TranscriptionResponse } from "@/lib/api";

interface AnalysisCardProps {
  analysis: AnalysisResponse | null;
  transcription: TranscriptionResponse | null;
  isLoading: boolean;
}

export function AnalysisCard({
  analysis,
  transcription,
  isLoading,
}: AnalysisCardProps) {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-border/50 bg-card/50 p-8">
        <div className="flex items-center gap-3">
          <Disc3 className="w-5 h-5 animate-spin text-primary" />
          <span className="text-muted-foreground text-sm">
            Analyzing track...
          </span>
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="space-y-3 stagger-children">
      {/* Main Analysis */}
      <div className="rounded-lg border border-border/50 bg-card/50 p-6 space-y-6">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Track Analysis
        </h3>

        {/* Mood + Energy + Tempo row */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-muted-foreground/60">
              <Music className="w-3 h-3" />
              <span className="text-[10px] font-semibold uppercase tracking-widest">
                Mood
              </span>
            </div>
            <p className="text-sm font-medium capitalize text-foreground">
              {analysis.mood}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-muted-foreground/60">
              <Zap className="w-3 h-3" />
              <span className="text-[10px] font-semibold uppercase tracking-widest">
                Energy
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${analysis.energy * 10}%`,
                    background: `linear-gradient(90deg, var(--primary), oklch(0.75 0.18 40))`,
                  }}
                />
              </div>
              <span className="text-xs font-mono text-muted-foreground tabular-nums">
                {analysis.energy}/10
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-muted-foreground/60">
              <Clock className="w-3 h-3" />
              <span className="text-[10px] font-semibold uppercase tracking-widest">
                Tempo
              </span>
            </div>
            <p className="text-sm font-medium capitalize text-foreground">
              {analysis.tempo_feel}
            </p>
          </div>
        </div>

        {/* Genres */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-muted-foreground/60">
            <Tag className="w-3 h-3" />
            <span className="text-[10px] font-semibold uppercase tracking-widest">
              Genres
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {analysis.genres.map((g) => (
              <Badge
                key={g}
                variant="outline"
                className="text-xs border-primary/20 text-primary bg-primary/5"
              >
                {g}
              </Badge>
            ))}
          </div>
        </div>

        {/* Themes */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-muted-foreground/60">
            <MessageSquareText className="w-3 h-3" />
            <span className="text-[10px] font-semibold uppercase tracking-widest">
              Themes
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {analysis.themes.map((t) => (
              <Badge
                key={t}
                variant="secondary"
                className="text-xs"
              >
                {t}
              </Badge>
            ))}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm leading-relaxed text-muted-foreground border-t border-border/50 pt-4">
          {analysis.description}
        </p>
      </div>

      {/* Lyrics */}
      {transcription && transcription.text && (
        <div className="rounded-lg border border-border/50 bg-card/50 p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Lyrics
            </h3>
            <Badge
              variant="outline"
              className="text-[10px] border-border/50 text-muted-foreground"
            >
              {transcription.language}
            </Badge>
          </div>
          <pre className="text-sm whitespace-pre-wrap font-sans leading-7 text-foreground/80">
            {transcription.text}
          </pre>
        </div>
      )}
    </div>
  );
}
