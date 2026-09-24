"use client";

import { deleteFeatureItem } from "./actions";

export function DeleteFeatureButton({ id }: { id: number }) {
  return (
    <form
      action={deleteFeatureItem}
      onSubmit={(e) => {
        if (!confirm("Xóa tính năng này?")) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="text-sm text-red-600 hover:underline">
        Xóa
      </button>
    </form>
  );
}
