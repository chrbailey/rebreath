"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <span className="animate-spin">&#9696;</span>
            <span className="text-muted-foreground">Analyzing track...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analysis) return null;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Track Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground w-16">Mood</span>
            <Badge variant="outline" className="capitalize">
              {analysis.mood}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground w-16">Energy</span>
            <Progress value={analysis.energy * 10} className="flex-1" />
            <span className="text-sm font-mono w-8">{analysis.energy}/10</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground w-16">Tempo</span>
            <Badge variant="secondary" className="capitalize">
              {analysis.tempo_feel}
            </Badge>
          </div>

          <div>
            <span className="text-sm text-muted-foreground">Genres</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {analysis.genres.map((g) => (
                <Badge key={g} variant="outline">
                  {g}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <span className="text-sm text-muted-foreground">Themes</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {analysis.themes.map((t) => (
                <Badge key={t} variant="secondary">
                  {t}
                </Badge>
              ))}
            </div>
          </div>

          <p className="text-sm text-muted-foreground mt-2">
            {analysis.description}
          </p>
        </CardContent>
      </Card>

      {transcription && transcription.text && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Lyrics
              <Badge variant="secondary">{transcription.language}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm whitespace-pre-wrap font-sans leading-relaxed">
              {transcription.text}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
