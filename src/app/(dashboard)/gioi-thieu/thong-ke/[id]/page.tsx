import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { StatForm } from "./stat-form";

export const metadata = { title: "Chỉnh sửa chỉ số" };

export default async function StatItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (id === "new") {
    return (
      <div className="max-w-xl">
        <h1 className="mb-6 text-xl font-semibold text-zinc-900">Thêm chỉ số mới</h1>
        <StatForm item={null} />
      </div>
    );
  }

  const supabase = await createClient();
  const { data: item, error } = await supabase.from("about_stats").select("*").eq("id", parseInt(id)).single();

  if (error || !item) return notFound();

  return (
    <div className="max-w-xl">
      <h1 className="mb-6 text-xl font-semibold text-zinc-900">Chỉnh sửa chỉ số</h1>
      <StatForm item={item} />
    </div>
  );
}
