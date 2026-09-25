"use client";

import { deleteNewsArticle } from "./actions";

export function DeleteArticleButton({ id, imageUrl }: { id: number; imageUrl: string | null }) {
  return (
    <form
      action={deleteNewsArticle}
      onSubmit={(e) => {
        if (!confirm("Xóa bài viết này?")) e.preventDefault();
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
