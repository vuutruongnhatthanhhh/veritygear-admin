import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ArticleForm } from "./article-form";

export const metadata = { title: "Chỉnh sửa bài viết" };

export default async function ArticleItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: categories } = await supabase.from("news_categories").select("id, name_vi").order("sort_order");

  if (id === "new") {
    return (
      <div className="max-w-2xl">
        <h1 className="mb-6 text-xl font-semibold text-zinc-900">Thêm bài viết mới</h1>
        <ArticleForm item={null} categories={categories ?? []} />
      </div>
    );
  }

  const { data: item, error } = await supabase.from("news_articles").select("*").eq("id", parseInt(id)).single();

  if (error || !item) return notFound();

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-xl font-semibold text-zinc-900">Chỉnh sửa bài viết</h1>
      <ArticleForm item={item} categories={categories ?? []} />
    </div>
  );
}
