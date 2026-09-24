"use client";

import { deleteTeamMember } from "./actions";

export function DeleteTeamMemberButton({ id, imageUrl }: { id: number; imageUrl: string | null }) {
  return (
    <form
      action={deleteTeamMember}
      onSubmit={(e) => {
        if (!confirm("Xóa thành viên này?")) e.preventDefault();
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
