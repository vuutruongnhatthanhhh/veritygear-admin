"use client";

import { deleteMilestone } from "./actions";

export function DeleteMilestoneButton({ id }: { id: number }) {
  return (
    <form
      action={deleteMilestone}
      onSubmit={(e) => {
        if (!confirm("Xóa cột mốc này?")) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="text-sm text-red-600 hover:underline">
        Xóa
      </button>
    </form>
  );
}
