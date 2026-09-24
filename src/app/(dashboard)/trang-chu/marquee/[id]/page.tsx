import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { MarqueeForm } from "./marquee-form";

export const metadata = { title: "Chỉnh sửa dòng chữ" };

export default async function MarqueeItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (id === "new") {
    return (
      <div className="max-w-xl">
        <h1 className="mb-6 text-xl font-semibold text-zinc-900">Thêm dòng chữ mới</h1>
        <MarqueeForm item={null} />
      </div>
    );
  }

  const supabase = await createClient();
  const { data: item, error } = await supabase
    .from("home_marquee_items")
    .select("*")
    .eq("id", parseInt(id))
    .single();

  if (error || !item) return notFound();

  return (
    <div className="max-w-xl">
      <h1 className="mb-6 text-xl font-semibold text-zinc-900">Chỉnh sửa dòng chữ</h1>
      <MarqueeForm item={item} />
    </div>
  );
}
