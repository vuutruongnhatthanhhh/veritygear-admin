"use client";

import { deleteProduct } from "./actions";

export function DeleteProductButton({ id, imageUrl }: { id: number; imageUrl: string | null }) {
  return (
    <form
      action={deleteProduct}
      onSubmit={(e) => {
        if (!confirm("Xóa sản phẩm này?")) e.preventDefault();
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
