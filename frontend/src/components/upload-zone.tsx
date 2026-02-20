"use client";

import { useCallback, useState } from "react";
import { Card } from "@/components/ui/card";

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
    <Card
      className={`relative border-2 border-dashed p-12 text-center transition-colors cursor-pointer ${
        isDragging
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/25 hover:border-primary/50"
      } ${isUploading ? "opacity-50 pointer-events-none" : ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => document.getElementById("file-input")?.click()}
    >
      <input
        id="file-input"
        type="file"
        accept=".mp3,.wav,.flac,.m4a,.ogg,.aac"
        className="hidden"
        onChange={handleChange}
      />
      <div className="flex flex-col items-center gap-3">
        <div className="text-4xl">
          {isUploading ? (
            <span className="animate-spin inline-block">&#9696;</span>
          ) : (
            "🎵"
          )}
        </div>
        <div>
          <p className="text-lg font-medium">
            {isUploading ? "Uploading..." : "Drop your audio file here"}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            MP3, WAV, FLAC, M4A, OGG, AAC — up to 100MB
          </p>
        </div>
      </div>
    </Card>
  );
}
