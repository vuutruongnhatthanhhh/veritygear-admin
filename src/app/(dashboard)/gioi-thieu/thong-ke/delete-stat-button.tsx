"use client";

import { deleteStat } from "./actions";

export function DeleteStatButton({ id }: { id: number }) {
  return (
    <form
      action={deleteStat}
      onSubmit={(e) => {
        if (!confirm("Xóa chỉ số này?")) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="text-sm text-red-600 hover:underline">
        Xóa
      </button>
    </form>
  );
}
