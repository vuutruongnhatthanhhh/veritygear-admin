import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { MilestoneForm } from "./milestone-form";

export const metadata = { title: "Chỉnh sửa cột mốc" };

export default async function MilestoneItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (id === "new") {
    return (
      <div className="max-w-xl">
        <h1 className="mb-6 text-xl font-semibold text-zinc-900">Thêm cột mốc mới</h1>
        <MilestoneForm item={null} />
      </div>
    );
  }

  const supabase = await createClient();
  const { data: item, error } = await supabase
    .from("milestones_timeline")
    .select("*")
    .eq("id", parseInt(id))
    .single();

  if (error || !item) return notFound();

  return (
    <div className="max-w-xl">
      <h1 className="mb-6 text-xl font-semibold text-zinc-900">Chỉnh sửa cột mốc</h1>
      <MilestoneForm item={item} />
    </div>
  );
}
