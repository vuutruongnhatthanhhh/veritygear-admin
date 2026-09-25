import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { DeleteCategoryButton } from "./delete-category-button";
import { ToastFromSession } from "@/components/toast";

export const metadata = { title: "Danh mục - Tin tức" };

export default async function NewsDanhMucPage() {
  const supabase = await createClient();
  const [{ data: categories, error }, { data: articles }] = await Promise.all([
    supabase.from("news_categories").select("*").order("sort_order"),
    supabase.from("news_articles").select("category_id"),
  ]);

  const countByCategory = new Map<number, number>();
  (articles ?? []).forEach((a) => {
    if (a.category_id) countByCategory.set(a.category_id, (countByCategory.get(a.category_id) ?? 0) + 1);
  });

  return (
    <div className="max-w-3xl space-y-10">
      <ToastFromSession />
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs text-zinc-400">
          <Link href="/tin-tuc" className="transition hover:text-zinc-700">
            Tin tức
          </Link>
          <span>/</span>
          <span>Danh mục</span>
        </div>
        <h1 className="mb-2 text-xl font-semibold text-zinc-900">Danh mục tin tức</h1>
        <p className="text-sm text-zinc-500">Chủ đề hiển thị dưới dạng bộ lọc trên trang Tin tức.</p>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-zinc-900">Nội dung ({categories?.length ?? 0})</h2>
          <Link
            href="/tin-tuc/danh-muc/new"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700"
          >
            + Thêm danh mục
          </Link>
        </div>

        {error ? (
          <p className="text-sm text-red-500">
            Không thể tải dữ liệu. Hãy chắc chắn đã chạy migration SQL
            (migrations/030_create_news_categories.sql) trong Supabase SQL Editor.
          </p>
        ) : (
          <div className="divide-y divide-zinc-200 overflow-hidden rounded-lg border border-zinc-200">
            {categories && categories.length > 0 ? (
              categories.map((cat) => (
                <div key={cat.id} className="flex items-center gap-4 bg-white px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium text-zinc-900">{cat.name_vi}</span>
                      <span className="shrink-0 rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500">
                        {countByCategory.get(cat.id) ?? 0} bài viết
                      </span>
                    </div>
                    <div className="truncate text-xs text-zinc-400">/{cat.slug}</div>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-xs text-zinc-400">#{cat.sort_order}</span>
                    <Link
                      href={`/tin-tuc/danh-muc/${cat.id}`}
                      className="text-sm text-zinc-600 transition hover:text-zinc-900"
                    >
                      Sửa
                    </Link>
                    <DeleteCategoryButton id={cat.id} />
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white px-4 py-8 text-center text-sm text-zinc-500">
                Chưa có danh mục nào. Nhấn &quot;+ Thêm danh mục&quot; để bắt đầu.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
