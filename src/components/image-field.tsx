"use client";

import { useState } from "react";
import Image from "next/image";
import { MediaPicker } from "./media-picker";

export function ImageField({
  label,
  initialUrl,
  bucket,
  pickerTitle,
}: {
  label: string;
  initialUrl: string | null;
  bucket: string;
  pickerTitle: string;
}) {
  const [preview, setPreview] = useState<string | null>(initialUrl);
  const [selectedUrl, setSelectedUrl] = useState("");
  const [showPicker, setShowPicker] = useState(false);

  function handleSelect(url: string) {
    setPreview(url);
    setSelectedUrl(url);
    setShowPicker(false);
  }

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-zinc-700">{label}</label>

      {showPicker && (
        <MediaPicker
          bucket={bucket}
          title={pickerTitle}
          onSelect={handleSelect}
          onClose={() => setShowPicker(false)}
        />
      )}

      <input type="hidden" name="selected_url" value={selectedUrl} />

      {preview ? (
        <div className="space-y-2">
          <div className="relative h-44 w-full overflow-hidden rounded-lg border border-zinc-200">
            <Image src={preview} alt="Preview" fill className="object-cover" unoptimized />
          </div>
          <button
            type="button"
            onClick={() => setShowPicker(true)}
            className="text-xs font-medium text-zinc-600 transition hover:text-zinc-900"
          >
            Đổi ảnh
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowPicker(true)}
          className="flex h-44 w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-zinc-300 bg-zinc-100 text-zinc-400 transition hover:bg-zinc-200"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
          <span className="text-xs">Nhấn để chọn ảnh</span>
        </button>
      )}
    </div>
  );
}
