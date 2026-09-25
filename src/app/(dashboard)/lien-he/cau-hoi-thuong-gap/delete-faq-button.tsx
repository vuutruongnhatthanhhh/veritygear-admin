"use client";

import { deleteFaq } from "./actions";

export function DeleteFaqButton({ id }: { id: number }) {
  return (
    <form
      action={deleteFaq}
      onSubmit={(e) => {
        if (!confirm("Xóa câu hỏi này?")) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="text-sm text-red-600 hover:underline">
        Xóa
      </button>
    </form>
  );
}
