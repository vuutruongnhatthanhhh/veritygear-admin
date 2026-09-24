import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { DeleteTestimonialButton } from "./delete-testimonial-button";
import { ToastFromSession } from "@/components/toast";

export const metadata = { title: "Đánh giá - Trang chủ" };

export default async function DanhGiaPage() {
  const supabase = await createClient();
  const { data: items, error } = await supabase.from("home_testimonials").select("*").order("sort_order");

  return (
    <div className="max-w-3xl space-y-10">
      <ToastFromSession />
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs text-zinc-400">
          <Link href="/trang-chu/hero" className="transition hover:text-zinc-700">
            Trang chủ
          </Link>
          <span>/</span>
          <span>Đánh giá</span>
        </div>
        <h1 className="mb-2 text-xl font-semibold text-zinc-900">Đánh giá</h1>
        <p className="text-sm text-zinc-500">Đánh giá khách hàng/game thủ hiển thị trên trang chủ.</p>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-zinc-900">Nội dung ({items?.length ?? 0})</h2>
          <Link
            href="/trang-chu/danh-gia/new"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700"
          >
            + Thêm đánh giá
          </Link>
        </div>

        {error ? (
          <p className="text-sm text-red-500">
            Không thể tải dữ liệu. Hãy chắc chắn đã chạy migration SQL
            (migrations/006_create_home_testimonials.sql) trong Supabase SQL Editor.
          </p>
        ) : (
          <div className="divide-y divide-zinc-200 overflow-hidden rounded-lg border border-zinc-200">
            {items && items.length > 0 ? (
              items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 bg-white px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium text-zinc-900">{item.name}</span>
                      <span className="shrink-0 text-xs text-amber-500">{"★".repeat(item.rating)}</span>
                      {!item.is_active && (
                        <span className="shrink-0 rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500">Ẩn</span>
                      )}
                    </div>
                    <div className="truncate text-xs text-zinc-400">{item.quote_vi}</div>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-xs text-zinc-400">#{item.sort_order}</span>
                    <Link
                      href={`/trang-chu/danh-gia/${item.id}`}
                      className="text-sm text-zinc-600 transition hover:text-zinc-900"
                    >
                      Sửa
                    </Link>
                    <DeleteTestimonialButton id={item.id} />
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white px-4 py-8 text-center text-sm text-zinc-500">
                Chưa có đánh giá nào. Nhấn &quot;+ Thêm đánh giá&quot; để bắt đầu.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
