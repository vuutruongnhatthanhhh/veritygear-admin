"use client";

import { deleteGalleryImage } from "./actions";

export function DeleteGalleryImageButton({ id, imageUrl }: { id: number; imageUrl: string | null }) {
  return (
    <form
      action={deleteGalleryImage}
      onSubmit={(e) => {
        if (!confirm("Xóa ảnh này?")) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="image_url" value={imageUrl ?? ""} />
      <button type="submit" className="text-sm text-red-600 hover:underline">
        Xóa
      </button>
    </form>
  );
}
