import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { DeleteArticleButton } from "./delete-article-button";
import { ToastFromSession } from "@/components/toast";

export const metadata = { title: "Tin tức" };

function formatDate(value: string): string {
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}

export default async function TinTucPage() {
  const supabase = await createClient();
  const { data: items, error } = await supabase
    .from("news_articles")
    .select("*, news_categories(name_vi)")
    .order("published_at", { ascending: false });

  return (
    <div className="max-w-4xl space-y-6">
      <ToastFromSession />
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs text-zinc-400">
          <span>Tin tức</span>
          <span>/</span>
          <span>Bài viết</span>
        </div>
        <h1 className="text-xl font-semibold text-zinc-900">Tin tức</h1>
        <p className="mt-1 text-sm text-zinc-500">Toàn bộ bài viết hiển thị trên veritygear.</p>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-zinc-900">Danh sách ({items?.length ?? 0})</h2>
        <div className="flex items-center gap-3">
          <Link href="/tin-tuc/danh-muc" className="text-sm text-zinc-600 transition hover:text-zinc-900">
            Quản lý danh mục →
          </Link>
          <Link
            href="/tin-tuc/new"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700"
          >
            + Thêm bài viết
          </Link>
        </div>
      </div>

      {error ? (
        <p className="text-sm text-red-500">
          Không thể tải dữ liệu. Hãy chắc chắn đã chạy migration SQL (migrations/031_create_news_articles.sql) trong
          Supabase SQL Editor.
        </p>
      ) : (
        <div className="divide-y divide-zinc-200 overflow-hidden rounded-lg border border-zinc-200">
          {items && items.length > 0 ? (
            items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 bg-white px-4 py-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-zinc-100">
                  {item.image_url && (
                    <Image src={item.image_url} alt={item.title_vi} fill className="object-cover" unoptimized />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="truncate text-sm font-medium text-zinc-900">{item.title_vi}</span>
                    {!item.is_active && (
                      <span className="shrink-0 rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500">Ẩn</span>
                    )}
                  </div>
                  <div className="mt-0.5 truncate text-xs text-zinc-400">
                    {item.news_categories?.name_vi ?? "Chưa phân loại"} · {formatDate(item.published_at)}
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <Link href={`/tin-tuc/${item.id}`} className="text-sm text-zinc-600 transition hover:text-zinc-900">
                    Sửa
                  </Link>
                  <DeleteArticleButton id={item.id} imageUrl={item.image_url} />
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white px-4 py-8 text-center text-sm text-zinc-500">
              Chưa có bài viết nào. Nhấn &quot;+ Thêm bài viết&quot; để bắt đầu.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
