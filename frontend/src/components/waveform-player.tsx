"use client";

import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface WaveformPlayerProps {
  url: string;
  label: string;
  color?: string;
  height?: number;
}

export function WaveformPlayer({
  url,
  label,
  color = "#6366f1",
  height = 80,
}: WaveformPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");
  const [volume, setVolume] = useState(80);

  useEffect(() => {
    if (!containerRef.current) return;

    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: `${color}66`,
      progressColor: color,
      cursorColor: "#fff",
      height,
      barWidth: 2,
      barGap: 1,
      barRadius: 2,
      normalize: true,
    });

    ws.load(url);

    ws.on("play", () => setIsPlaying(true));
    ws.on("pause", () => setIsPlaying(false));
    ws.on("timeupdate", (time) => setCurrentTime(formatTime(time)));
    ws.on("ready", () => setDuration(formatTime(ws.getDuration())));

    wavesurferRef.current = ws;

    return () => {
      ws.destroy();
    };
  }, [url, color, height]);

  useEffect(() => {
    if (wavesurferRef.current) {
      wavesurferRef.current.setVolume(volume / 100);
    }
  }, [volume]);

  const togglePlay = () => {
    wavesurferRef.current?.playPause();
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium capitalize">{label}</span>
        <span className="text-xs text-muted-foreground">
          {currentTime} / {duration}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={togglePlay}
          className="shrink-0 w-8 h-8 p-0"
        >
          {isPlaying ? "⏸" : "▶"}
        </Button>
        <div ref={containerRef} className="flex-1 min-w-0" />
        <div className="w-20 shrink-0">
          <Slider
            value={[volume]}
            onValueChange={([v]) => setVolume(v)}
            max={100}
            step={1}
          />
        </div>
      </div>
    </div>
  );
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
