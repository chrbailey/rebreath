"use client";

import { useState, useCallback } from "react";
import { UploadZone } from "@/components/upload-zone";
import { WaveformPlayer } from "@/components/waveform-player";
import { StemPlayer } from "@/components/stem-player";
import { AnalysisCard } from "@/components/analysis-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
      // Step 1: Upload
      setStep("uploading");
      const uploaded = await uploadTrack(file);
      setTrack(uploaded);

      // Step 2: Separate stems
      setStep("separating");
      const separated = await separateStems(uploaded.track_id);
      setStems(separated);

      // Step 3: Transcribe
      setStep("transcribing");
      let lyrics: string | undefined;
      try {
        const transcribed = await transcribeTrack(uploaded.track_id);
        setTranscription(transcribed);
        lyrics = transcribed.text;
      } catch {
        // Transcription is optional
        console.warn("Transcription unavailable");
      }

      // Step 4: Analyze
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

  const stepLabels: Record<ProcessingStep, string> = {
    idle: "",
    uploading: "Uploading audio...",
    separating: "Separating stems with Demucs (this takes a minute)...",
    transcribing: "Transcribing lyrics with Whisper...",
    analyzing: "Analyzing mood, genre, and themes...",
    done: "Processing complete",
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">ReBreath</h1>
            <Badge variant="secondary">AI Music Reimaginer</Badge>
          </div>
          <p className="text-sm text-muted-foreground hidden sm:block">
            Upload your music. AI reimagines it.
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Upload Section */}
        {step === "idle" && !track && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">Reimagine Your Music</h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Drop an audio file and AI will separate stems, transcribe
                lyrics, analyze mood and energy, and let you hear your music in
                new ways.
              </p>
            </div>
            <UploadZone
              onFileSelected={handleFileSelected}
              isUploading={false}
            />

            {/* Feature grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              {[
                {
                  title: "Stem Separation",
                  desc: "AI splits your track into vocals, drums, bass, and more",
                  icon: "🎛️",
                },
                {
                  title: "Smart Analysis",
                  desc: "Mood, genre, energy, themes — AI understands your music",
                  icon: "🔍",
                },
                {
                  title: "Rights-Clear",
                  desc: "Your music, your rights. Zero copyright risk.",
                  icon: "✅",
                },
              ].map((f) => (
                <Card key={f.title}>
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl mb-2">{f.icon}</div>
                    <h3 className="font-semibold">{f.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {f.desc}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Processing status */}
        {step !== "idle" && step !== "done" && (
          <Card className="mb-6">
            <CardContent className="p-4 flex items-center gap-3">
              <span className="animate-spin text-lg">&#9696;</span>
              <div>
                <p className="font-medium">{stepLabels[step]}</p>
                {track && (
                  <p className="text-sm text-muted-foreground">
                    {track.filename} (
                    {(track.size / 1024 / 1024).toFixed(1)} MB)
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error */}
        {error && (
          <Card className="mb-6 border-destructive">
            <CardContent className="p-4">
              <p className="text-destructive font-medium">Error: {error}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => {
                  setError(null);
                  setStep("idle");
                  setTrack(null);
                }}
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {track && (step === "done" || stems) && (
          <div className="space-y-6">
            {/* Track header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">{track.filename}</h2>
                <p className="text-sm text-muted-foreground">
                  {(track.size / 1024 / 1024).toFixed(1)} MB
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setStep("idle");
                  setTrack(null);
                  setStems(null);
                  setTranscription(null);
                  setAnalysis(null);
                }}
              >
                Upload New Track
              </Button>
            </div>

            <Separator />

            <Tabs defaultValue="stems" className="w-full">
              <TabsList>
                <TabsTrigger value="original">Original</TabsTrigger>
                <TabsTrigger value="stems" disabled={!stems}>
                  Stems
                </TabsTrigger>
                <TabsTrigger value="analysis" disabled={!analysis}>
                  Analysis
                </TabsTrigger>
              </TabsList>

              <TabsContent value="original" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Original Track</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <WaveformPlayer
                      url={fileUrl(`/files/uploads/${track.path.split("/").pop()}`)}
                      label="Full Mix"
                      color="#6366f1"
                      height={100}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="stems" className="mt-4">
                {stems && (
                  <StemPlayer
                    stems={stems.stems}
                    trackId={stems.track_id}
                  />
                )}
              </TabsContent>

              <TabsContent value="analysis" className="mt-4">
                <AnalysisCard
                  analysis={analysis}
                  transcription={transcription}
                  isLoading={
                    step === "analyzing" || step === "transcribing"
                  }
                />
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 py-8 border-t text-center text-sm text-muted-foreground">
          <p>
            ReBreath — AI Music Reimaginer. Built with Demucs, Whisper, and
            Claude.
          </p>
          <p className="mt-1">
            Zero API costs. Runs locally. Your music, your rights.
          </p>
        </footer>
      </main>
    </div>
  );
}
