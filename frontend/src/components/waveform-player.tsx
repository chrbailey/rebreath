"use client";

import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { Play, Pause, Volume2 } from "lucide-react";
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
  color = "#f0a840",
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
      waveColor: `${color}30`,
      progressColor: color,
      cursorColor: `${color}80`,
      cursorWidth: 1,
      height,
      barWidth: 2,
      barGap: 2,
      barRadius: 4,
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
        <span
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color }}
        >
          {label}
        </span>
        <span className="text-xs text-muted-foreground font-mono tabular-nums">
          {currentTime} / {duration}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={togglePlay}
          className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
          style={{
            backgroundColor: `${color}18`,
            color: color,
          }}
        >
          {isPlaying ? (
            <Pause className="w-3.5 h-3.5" fill="currentColor" />
          ) : (
            <Play className="w-3.5 h-3.5 ml-0.5" fill="currentColor" />
          )}
        </button>
        <div
          ref={containerRef}
          className="flex-1 min-w-0 rounded-md overflow-hidden"
        />
        <div className="flex items-center gap-1.5 shrink-0">
          <Volume2
            className="w-3.5 h-3.5 text-muted-foreground/50"
          />
          <div className="w-16">
            <Slider
              value={[volume]}
              onValueChange={([v]) => setVolume(v)}
              max={100}
              step={1}
            />
          </div>
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
