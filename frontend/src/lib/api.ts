const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface Track {
  track_id: string;
  filename: string;
  size: number;
}

export interface UploadResponse {
  track_id: string;
  filename: string;
  size: number;
  path: string;
}

export interface StemsResponse {
  track_id: string;
  stems: Record<string, string>;
}

export interface TranscriptionResponse {
  track_id: string;
  text: string;
  segments: Array<{ start: number; end: number; text: string }>;
  language: string;
}

export interface AnalysisResponse {
  track_id: string;
  mood: string;
  energy: number;
  genres: string[];
  themes: string[];
  tempo_feel: string;
  description: string;
}

export async function uploadTrack(file: File): Promise<UploadResponse> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${API_BASE}/api/audio/upload`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function separateStems(trackId: string): Promise<StemsResponse> {
  const res = await fetch(`${API_BASE}/api/audio/separate/${trackId}`, {
    method: "POST",
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function transcribeTrack(
  trackId: string
): Promise<TranscriptionResponse> {
  const res = await fetch(`${API_BASE}/api/analysis/transcribe/${trackId}`, {
    method: "POST",
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function analyzeTrack(
  trackId: string,
  lyrics?: string
): Promise<AnalysisResponse> {
  const params = new URLSearchParams();
  if (lyrics) params.set("lyrics", lyrics);
  const res = await fetch(
    `${API_BASE}/api/analysis/analyze/${trackId}?${params}`,
    { method: "POST" }
  );
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function listTracks(): Promise<Track[]> {
  const res = await fetch(`${API_BASE}/api/audio/tracks`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export function fileUrl(path: string): string {
  return `${API_BASE}${path}`;
}
