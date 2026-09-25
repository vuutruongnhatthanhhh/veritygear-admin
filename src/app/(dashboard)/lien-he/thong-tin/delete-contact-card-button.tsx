"use client";

import { deleteContactCard } from "./actions";

export function DeleteContactCardButton({ id }: { id: number }) {
  return (
    <form
      action={deleteContactCard}
      onSubmit={(e) => {
        if (!confirm("Xóa thông tin này?")) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="text-sm text-red-600 hover:underline">
        Xóa
      </button>
    </form>
  );
}
