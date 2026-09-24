import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { FeatureForm } from "./feature-form";

export const metadata = { title: "Chỉnh sửa tính năng" };

export default async function FeatureItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (id === "new") {
    return (
      <div className="max-w-xl">
        <h1 className="mb-6 text-xl font-semibold text-zinc-900">Thêm tính năng mới</h1>
        <FeatureForm item={null} />
      </div>
    );
  }

  const supabase = await createClient();
  const { data: item, error } = await supabase
    .from("home_feature_strip_items")
    .select("*")
    .eq("id", parseInt(id))
    .single();

  if (error || !item) return notFound();

  return (
    <div className="max-w-xl">
      <h1 className="mb-6 text-xl font-semibold text-zinc-900">Chỉnh sửa tính năng</h1>
      <FeatureForm item={item} />
    </div>
  );
}
