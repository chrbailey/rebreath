"use client";

import { useCallback, useState } from "react";
import { Upload, Disc3 } from "lucide-react";

interface UploadZoneProps {
  onFileSelected: (file: File) => void;
  isUploading: boolean;
}

export function UploadZone({ onFileSelected, isUploading }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) onFileSelected(file);
    },
    [onFileSelected]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) onFileSelected(file);
    },
    [onFileSelected]
  );

  return (
    <div
      className={`relative group rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden ${
        isDragging
          ? "border-primary bg-primary/5 scale-[1.01]"
          : "border-border/50 hover:border-primary/40"
      } ${isUploading ? "opacity-50 pointer-events-none" : ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => document.getElementById("file-input")?.click()}
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.04] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <input
        id="file-input"
        type="file"
        accept=".mp3,.wav,.flac,.m4a,.ogg,.aac"
        className="hidden"
        onChange={handleChange}
      />

      <div className="relative flex flex-col items-center gap-5 py-16 px-8">
        <div
          className={`relative flex items-center justify-center w-16 h-16 rounded-2xl transition-all duration-300 ${
            isDragging
              ? "bg-primary/20 text-primary"
              : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
          }`}
        >
          {isUploading ? (
            <Disc3 className="w-7 h-7 animate-spin" />
          ) : (
            <Upload className="w-7 h-7" />
          )}
          {isDragging && (
            <div className="absolute inset-0 rounded-2xl border-2 border-primary animate-ping opacity-30" />
          )}
        </div>

        <div className="text-center space-y-1.5">
          <p className="text-base font-medium text-foreground">
            {isUploading
              ? "Uploading..."
              : isDragging
                ? "Drop to upload"
                : "Drop your audio file here"}
          </p>
          <p className="text-sm text-muted-foreground">
            or{" "}
            <span className="text-primary/80 underline underline-offset-4 decoration-primary/30">
              browse files
            </span>
          </p>
          <p className="text-xs text-muted-foreground/60 pt-1">
            MP3, WAV, FLAC, M4A, OGG, AAC &mdash; up to 100 MB
          </p>
        </div>
      </div>
    </div>
  );
}
