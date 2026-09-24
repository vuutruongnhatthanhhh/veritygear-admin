"use client";

import { deleteMarqueeItem } from "./actions";

export function DeleteMarqueeButton({ id }: { id: number }) {
  return (
    <form
      action={deleteMarqueeItem}
      onSubmit={(e) => {
        if (!confirm("Xóa dòng chữ này?")) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="text-sm text-red-600 hover:underline">
        Xóa
      </button>
    </form>
  );
}
