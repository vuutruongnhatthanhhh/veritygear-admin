import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { CategoryForm } from "./category-form";

export const metadata = { title: "Danh mục tin tức" };

export default async function NewsCategoryItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (id === "new") {
    return (
      <div className="max-w-2xl">
        <h1 className="mb-6 text-xl font-semibold text-zinc-900">Thêm danh mục mới</h1>
        <CategoryForm item={null} />
      </div>
    );
  }

  const supabase = await createClient();
  const { data: item, error } = await supabase.from("news_categories").select("*").eq("id", parseInt(id)).single();

  if (error || !item) return notFound();

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-xl font-semibold text-zinc-900">Chỉnh sửa danh mục</h1>
      <CategoryForm item={item} />
    </div>
  );
}
