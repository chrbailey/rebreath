"use client";

import { useState, useCallback } from "react";
import { UploadZone } from "@/components/upload-zone";
import { WaveformPlayer } from "@/components/waveform-player";
import { StemPlayer } from "@/components/stem-player";
import { AnalysisCard } from "@/components/analysis-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Disc3,
  AudioLines,
  Layers,
  ScanSearch,
  ShieldCheck,
  UploadCloud,
  ArrowLeft,
} from "lucide-react";
import {
  uploadTrack,
  separateStems,
  transcribeTrack,
  analyzeTrack,
  fileUrl,
  type UploadResponse,
  type StemsResponse,
  type TranscriptionResponse,
  type AnalysisResponse,
} from "@/lib/api";

type ProcessingStep =
  | "idle"
  | "uploading"
  | "separating"
  | "transcribing"
  | "analyzing"
  | "done";

const PIPELINE_STEPS = [
  { key: "uploading", label: "Upload", icon: UploadCloud },
  { key: "separating", label: "Stems", icon: Layers },
  { key: "transcribing", label: "Lyrics", icon: AudioLines },
  { key: "analyzing", label: "Analysis", icon: ScanSearch },
] as const;

export default function Home() {
  const [step, setStep] = useState<ProcessingStep>("idle");
  const [error, setError] = useState<string | null>(null);
  const [track, setTrack] = useState<UploadResponse | null>(null);
  const [stems, setStems] = useState<StemsResponse | null>(null);
  const [transcription, setTranscription] =
    useState<TranscriptionResponse | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);

  const handleFileSelected = useCallback(async (file: File) => {
    setError(null);
    setStems(null);
    setTranscription(null);
    setAnalysis(null);

    try {
      setStep("uploading");
      const uploaded = await uploadTrack(file);
      setTrack(uploaded);

      setStep("separating");
      const separated = await separateStems(uploaded.track_id);
      setStems(separated);

      setStep("transcribing");
      let lyrics: string | undefined;
      try {
        const transcribed = await transcribeTrack(uploaded.track_id);
        setTranscription(transcribed);
        lyrics = transcribed.text;
      } catch {
        console.warn("Transcription unavailable");
      }

      setStep("analyzing");
      try {
        const analyzed = await analyzeTrack(uploaded.track_id, lyrics);
        setAnalysis(analyzed);
      } catch {
        console.warn("Analysis unavailable");
      }

      setStep("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStep("idle");
    }
  }, []);

  const reset = () => {
    setStep("idle");
    setTrack(null);
    setStems(null);
    setTranscription(null);
    setAnalysis(null);
    setError(null);
  };

  const loadDemo = () => {
    setTrack({
      track_id: "ad9cfd1e",
      filename: "fur-elise-60s.mp3",
      size: 1078870,
      path: "/Volumes/OWC drive/Dev/music/rebreath/backend/data/uploads/ad9cfd1e_fur-elise-60s.mp3",
    });
    setStems({
      track_id: "ad9cfd1e",
      stems: {
        vocals:
          "/files/stems/htdemucs/ad9cfd1e_fur-elise-60s/vocals.mp3",
        drums:
          "/files/stems/htdemucs/ad9cfd1e_fur-elise-60s/drums.mp3",
        bass: "/files/stems/htdemucs/ad9cfd1e_fur-elise-60s/bass.mp3",
        other:
          "/files/stems/htdemucs/ad9cfd1e_fur-elise-60s/other.mp3",
      },
    });
    setTranscription(null);
    setAnalysis({
      track_id: "ad9cfd1e",
      mood: "melancholic",
      energy: 4,
      genres: ["classical", "piano", "romantic"],
      themes: [
        "introspection",
        "elegance",
        "nostalgia",
        "contemplation",
        "timelessness",
      ],
      tempo_feel: "slow",
      description:
        "Beethoven's iconic 'Für Elise' — a delicate, introspective piano piece evoking romantic melancholy and graceful pensiveness. This interpretation strips the work to its emotional core, creating an intimate and contemplative listening experience.",
    });
    setStep("done");
  };

  const currentStepIndex = PIPELINE_STEPS.findIndex((s) => s.key === step);

  return (
    <div className="min-h-screen bg-background relative">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Disc3 className="w-5 h-5 text-primary" />
            <span
              className="text-lg font-bold tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              ReBreath
            </span>
          </div>
          {track && step === "done" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={reset}
              className="text-muted-foreground hover:text-foreground gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              New track
            </Button>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Landing / Upload */}
        {step === "idle" && !track && (
          <div className="animate-fade-in">
            <div className="max-w-xl mx-auto space-y-10">
              {/* Hero */}
              <div className="text-center space-y-4 pt-8">
                <h1
                  className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.1]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Reimagine
                  <br />
                  <span className="text-primary">your music</span>
                </h1>
                <p className="text-muted-foreground text-base max-w-md mx-auto leading-relaxed">
                  Upload a track and AI separates stems, transcribes lyrics, and
                  analyzes mood &mdash; all locally, all rights-clear.
                </p>
              </div>

              {/* Upload */}
              <UploadZone
                onFileSelected={handleFileSelected}
                isUploading={false}
              />

              <div className="text-center">
                <button
                  onClick={loadDemo}
                  className="text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors underline underline-offset-4 decoration-border"
                >
                  try demo: Beethoven &mdash; Für Elise
                </button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-3 pt-4">
                {[
                  {
                    icon: Layers,
                    title: "Stem Separation",
                    desc: "Vocals, drums, bass, other",
                  },
                  {
                    icon: ScanSearch,
                    title: "Smart Analysis",
                    desc: "Mood, genre, energy, themes",
                  },
                  {
                    icon: ShieldCheck,
                    title: "Rights-Clear",
                    desc: "Your music, zero risk",
                  },
                ].map((f) => (
                  <div
                    key={f.title}
                    className="rounded-lg border border-border/30 p-4 space-y-2 text-center"
                  >
                    <f.icon className="w-5 h-5 mx-auto text-muted-foreground/50" />
                    <p className="text-xs font-semibold text-foreground/80">
                      {f.title}
                    </p>
                    <p className="text-[11px] text-muted-foreground/60">
                      {f.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Processing Pipeline */}
        {step !== "idle" && step !== "done" && (
          <div className="max-w-lg mx-auto pt-16 animate-fade-in">
            <div className="space-y-8">
              {/* Pipeline progress */}
              <div className="flex items-center justify-between">
                {PIPELINE_STEPS.map((s, i) => {
                  const Icon = s.icon;
                  const isActive = s.key === step;
                  const isDone = i < currentStepIndex;

                  return (
                    <div key={s.key} className="flex items-center gap-2">
                      <div className="flex flex-col items-center gap-2">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${
                            isActive
                              ? "bg-primary/15 text-primary processing-active"
                              : isDone
                                ? "bg-primary/10 text-primary"
                                : "bg-muted text-muted-foreground/40"
                          }`}
                        >
                          {isActive ? (
                            <Disc3 className="w-4.5 h-4.5 animate-spin" />
                          ) : (
                            <Icon className="w-4.5 h-4.5" />
                          )}
                        </div>
                        <span
                          className={`text-[10px] font-semibold uppercase tracking-widest transition-colors ${
                            isActive
                              ? "text-primary"
                              : isDone
                                ? "text-foreground/60"
                                : "text-muted-foreground/30"
                          }`}
                        >
                          {s.label}
                        </span>
                      </div>
                      {i < PIPELINE_STEPS.length - 1 && (
                        <div
                          className={`w-12 h-px mx-1 mb-6 transition-colors duration-500 ${
                            isDone ? "bg-primary/30" : "bg-border/50"
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Current file info */}
              {track && (
                <div className="text-center space-y-1">
                  <p className="text-sm font-medium text-foreground/80">
                    {track.filename}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(track.size / 1024 / 1024).toFixed(1)} MB
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="max-w-lg mx-auto mt-6 rounded-lg border border-destructive/30 bg-destructive/5 p-4 animate-slide-up">
            <p className="text-sm text-destructive font-medium">{error}</p>
            <button
              onClick={reset}
              className="mt-2 text-xs text-destructive/70 underline underline-offset-4"
            >
              Try again
            </button>
          </div>
        )}

        {/* Results */}
        {track && (step === "done" || stems) && (
          <div className="space-y-6 animate-slide-up">
            {/* Track header */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <AudioLines className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2
                  className="text-lg font-bold tracking-tight"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {track.filename.replace(/\.[^.]+$/, "")}
                </h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-muted-foreground">
                    {(track.size / 1024 / 1024).toFixed(1)} MB
                  </span>
                  <Badge
                    variant="outline"
                    className="text-[10px] border-primary/20 text-primary"
                  >
                    {track.filename.match(/\.([^.]+)$/)?.[1]?.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="stems" className="w-full">
              <TabsList className="bg-muted/50 border border-border/30">
                <TabsTrigger value="original" className="gap-1.5 text-xs">
                  <AudioLines className="w-3.5 h-3.5" />
                  Original
                </TabsTrigger>
                <TabsTrigger
                  value="stems"
                  disabled={!stems}
                  className="gap-1.5 text-xs"
                >
                  <Layers className="w-3.5 h-3.5" />
                  Stems
                </TabsTrigger>
                <TabsTrigger
                  value="analysis"
                  disabled={!analysis}
                  className="gap-1.5 text-xs"
                >
                  <ScanSearch className="w-3.5 h-3.5" />
                  Analysis
                </TabsTrigger>
              </TabsList>

              <TabsContent value="original" className="mt-4">
                <div className="rounded-lg border border-border/50 bg-card/50 p-5 waveform-glow">
                  <WaveformPlayer
                    url={fileUrl(
                      `/files/uploads/${track.path.split("/").pop()}`
                    )}
                    label="Full Mix"
                    color="#f0a840"
                    height={100}
                  />
                </div>
              </TabsContent>

              <TabsContent value="stems" className="mt-4">
                {stems && (
                  <StemPlayer stems={stems.stems} trackId={stems.track_id} />
                )}
              </TabsContent>

              <TabsContent value="analysis" className="mt-4">
                <AnalysisCard
                  analysis={analysis}
                  transcription={transcription}
                  isLoading={step === "analyzing" || step === "transcribing"}
                />
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-20 py-6 border-t border-border/30 flex items-center justify-between text-[11px] text-muted-foreground/40">
          <span>ReBreath &mdash; AI Music Reimaginer</span>
          <span>Zero API costs &middot; Runs locally &middot; Rights-clear</span>
        </footer>
      </main>
    </div>
  );
}
