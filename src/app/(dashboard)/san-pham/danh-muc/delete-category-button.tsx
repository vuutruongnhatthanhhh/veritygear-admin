"use client";

import { deleteCategory } from "./actions";

export function DeleteCategoryButton({ id, imageUrl }: { id: number; imageUrl: string | null }) {
  return (
    <form
      action={deleteCategory}
      onSubmit={(e) => {
        if (!confirm("Xóa danh mục này? Sản phẩm thuộc danh mục sẽ mất liên kết danh mục.")) e.preventDefault();
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
