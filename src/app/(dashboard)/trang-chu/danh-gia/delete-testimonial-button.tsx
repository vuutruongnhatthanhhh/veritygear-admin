"use client";

import { deleteTestimonial } from "./actions";

export function DeleteTestimonialButton({ id }: { id: number }) {
  return (
    <form
      action={deleteTestimonial}
      onSubmit={(e) => {
        if (!confirm("Xóa đánh giá này?")) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="text-sm text-red-600 hover:underline">
        Xóa
      </button>
    </form>
  );
}
