import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ValueForm } from "./value-form";

export const metadata = { title: "Chỉnh sửa giá trị cốt lõi" };

export default async function ValueItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (id === "new") {
    return (
      <div className="max-w-xl">
        <h1 className="mb-6 text-xl font-semibold text-zinc-900">Thêm giá trị mới</h1>
        <ValueForm item={null} />
      </div>
    );
  }

  const supabase = await createClient();
  const { data: item, error } = await supabase.from("about_values").select("*").eq("id", parseInt(id)).single();

  if (error || !item) return notFound();

  return (
    <div className="max-w-xl">
      <h1 className="mb-6 text-xl font-semibold text-zinc-900">Chỉnh sửa giá trị cốt lõi</h1>
      <ValueForm item={item} />
    </div>
  );
}
