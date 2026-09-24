import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { DeleteStatButton } from "./delete-stat-button";
import { ToastFromSession } from "@/components/toast";

export const metadata = { title: "Thống kê - Giới thiệu" };

export default async function ThongKePage() {
  const supabase = await createClient();
  const { data: items, error } = await supabase.from("about_stats").select("*").order("sort_order");

  return (
    <div className="max-w-3xl space-y-10">
      <ToastFromSession />
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs text-zinc-400">
          <Link href="/gioi-thieu/banner" className="transition hover:text-zinc-700">
            Giới thiệu
          </Link>
          <span>/</span>
          <span>Thống kê</span>
        </div>
        <h1 className="mb-2 text-xl font-semibold text-zinc-900">Thống kê</h1>
        <p className="text-sm text-zinc-500">Dải số liệu nổi bật trên trang giới thiệu.</p>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-zinc-900">Nội dung ({items?.length ?? 0})</h2>
          <Link
            href="/gioi-thieu/thong-ke/new"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700"
          >
            + Thêm chỉ số
          </Link>
        </div>

        {error ? (
          <p className="text-sm text-red-500">
            Không thể tải dữ liệu. Hãy chắc chắn đã chạy migration SQL
            (migrations/012_create_about_stats.sql) trong Supabase SQL Editor.
          </p>
        ) : (
          <div className="divide-y divide-zinc-200 overflow-hidden rounded-lg border border-zinc-200">
            {items && items.length > 0 ? (
              items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 bg-white px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-semibold text-zinc-900">{item.value}</span>
                      <span className="truncate text-sm text-zinc-500">{item.label_vi}</span>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-xs text-zinc-400">#{item.sort_order}</span>
                    <Link
                      href={`/gioi-thieu/thong-ke/${item.id}`}
                      className="text-sm text-zinc-600 transition hover:text-zinc-900"
                    >
                      Sửa
                    </Link>
                    <DeleteStatButton id={item.id} />
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white px-4 py-8 text-center text-sm text-zinc-500">
                Chưa có chỉ số nào. Nhấn &quot;+ Thêm chỉ số&quot; để bắt đầu.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
