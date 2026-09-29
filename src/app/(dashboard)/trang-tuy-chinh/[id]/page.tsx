import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { CustomPageForm } from "./custom-page-form";

export const metadata = { title: "Chỉnh sửa trang" };

export default async function CustomPageItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (id === "new") {
    return (
      <div className="max-w-2xl">
        <h1 className="mb-6 text-xl font-semibold text-zinc-900">Thêm trang mới</h1>
        <CustomPageForm item={null} />
      </div>
    );
  }

  const supabase = await createClient();
  const { data: item, error } = await supabase.from("custom_pages").select("*").eq("id", parseInt(id)).single();

  if (error || !item) return notFound();

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-xl font-semibold text-zinc-900">Chỉnh sửa trang</h1>
      <CustomPageForm item={item} />
    </div>
  );
}
