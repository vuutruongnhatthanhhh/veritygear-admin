"use client";

import { deleteStoryBlock } from "./actions";

export function DeleteStoryBlockButton({ id, imageUrl }: { id: number; imageUrl: string | null }) {
  return (
    <form
      action={deleteStoryBlock}
      onSubmit={(e) => {
        if (!confirm("Xóa câu chuyện này?")) e.preventDefault();
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
