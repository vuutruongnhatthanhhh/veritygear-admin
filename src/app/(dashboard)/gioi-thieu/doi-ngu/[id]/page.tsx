import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { TeamMemberForm } from "./team-member-form";

export const metadata = { title: "Chỉnh sửa thành viên" };

export default async function TeamMemberItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (id === "new") {
    return (
      <div className="max-w-xl">
        <h1 className="mb-6 text-xl font-semibold text-zinc-900">Thêm thành viên mới</h1>
        <TeamMemberForm item={null} />
      </div>
    );
  }

  const supabase = await createClient();
  const { data: item, error } = await supabase
    .from("about_team_members")
    .select("*")
    .eq("id", parseInt(id))
    .single();

  if (error || !item) return notFound();

  return (
    <div className="max-w-xl">
      <h1 className="mb-6 text-xl font-semibold text-zinc-900">Chỉnh sửa thành viên</h1>
      <TeamMemberForm item={item} />
    </div>
  );
}
