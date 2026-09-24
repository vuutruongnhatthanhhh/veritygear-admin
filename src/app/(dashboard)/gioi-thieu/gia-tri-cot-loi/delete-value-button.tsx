"use client";

import { deleteValueItem } from "./actions";

export function DeleteValueButton({ id }: { id: number }) {
  return (
    <form
      action={deleteValueItem}
      onSubmit={(e) => {
        if (!confirm("Xóa giá trị này?")) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="text-sm text-red-600 hover:underline">
        Xóa
      </button>
    </form>
  );
}
