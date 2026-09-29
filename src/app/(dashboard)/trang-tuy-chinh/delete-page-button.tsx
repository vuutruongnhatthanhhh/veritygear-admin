"use client";

import { deleteCustomPage } from "./actions";

export function DeleteCustomPageButton({ id }: { id: number }) {
  return (
    <form
      action={deleteCustomPage}
      onSubmit={(e) => {
        if (!confirm("Xóa trang này?")) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="text-sm text-red-600 hover:underline">
        Xóa
      </button>
    </form>
  );
}
