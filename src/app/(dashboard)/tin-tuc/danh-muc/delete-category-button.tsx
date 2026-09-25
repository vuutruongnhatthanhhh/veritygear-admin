"use client";

import { deleteNewsCategory } from "./actions";

export function DeleteCategoryButton({ id }: { id: number }) {
  return (
    <form
      action={deleteNewsCategory}
      onSubmit={(e) => {
        if (!confirm("Xóa danh mục này? Bài viết thuộc danh mục sẽ mất liên kết danh mục.")) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="text-sm text-red-600 hover:underline">
        Xóa
      </button>
    </form>
  );
}
