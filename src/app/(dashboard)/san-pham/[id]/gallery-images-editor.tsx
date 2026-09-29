"use client";

import { useState } from "react";
import Image from "next/image";
import { MediaPicker } from "@/components/media-picker";

export function GalleryImagesEditor({ initialImages }: { initialImages: string[] }) {
  const [images, setImages] = useState<string[]>(initialImages);
  const [showPicker, setShowPicker] = useState(false);

  function addImage(url: string) {
    setImages((prev) => [...prev, url]);
    setShowPicker(false);
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="block text-sm font-medium text-zinc-700">Ảnh bổ sung (hiển thị trong gallery sản phẩm)</label>
        <button
          type="button"
          onClick={() => setShowPicker(true)}
          className="text-xs font-medium text-zinc-600 transition hover:text-zinc-900"
        >
          + Thêm ảnh
        </button>
      </div>
      <p className="mb-3 text-xs text-zinc-400">
        Ảnh sản phẩm ở trên luôn là ảnh đầu tiên trong gallery — đây là các ảnh bổ sung hiển thị tiếp theo.
      </p>

      <input type="hidden" name="images_json" value={JSON.stringify(images)} readOnly />

      {showPicker && (
        <MediaPicker
          bucket="product-images"
          title="Chọn ảnh bổ sung"
          onSelect={addImage}
          onClose={() => setShowPicker(false)}
        />
      )}

      {images.length === 0 ? (
        <p className="rounded-lg border border-dashed border-zinc-300 px-4 py-6 text-center text-sm text-zinc-400">
          Chưa có ảnh bổ sung nào.
        </p>
      ) : (
        <div className="grid grid-cols-4 gap-3">
          {images.map((url, i) => (
            <div key={`${url}-${i}`} className="group relative aspect-square overflow-hidden rounded-lg border border-zinc-200">
              <Image src={url} alt={`Ảnh bổ sung ${i + 1}`} fill className="object-cover" unoptimized />
              <button
                type="button"
                onClick={() => removeImage(i)}
                title="Xóa ảnh"
                className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white opacity-0 shadow transition group-hover:opacity-100 hover:bg-red-700"
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
