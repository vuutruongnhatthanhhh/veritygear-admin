import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { DeleteCustomPageButton } from "./delete-page-button";
import { ToastFromSession } from "@/components/toast";

export const metadata = { title: "Trang tùy chỉnh" };

export default async function CustomPagesPage() {
  const supabase = await createClient();
  const { data: items, error } = await supabase.from("custom_pages").select("*").order("sort_order");

  return (
    <div className="max-w-4xl space-y-6">
      <ToastFromSession />
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs text-zinc-400">
          <span>Trang tùy chỉnh</span>
          <span>/</span>
          <span>Danh sách trang</span>
        </div>
        <h1 className="text-xl font-semibold text-zinc-900">Trang tùy chỉnh</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Các trang nội dung tự do, hiển thị tại veritygear.vercel.app/[slug] và liên kết trong cột &quot;Công
          ty&quot; của footer.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-zinc-900">Danh sách ({items?.length ?? 0})</h2>
        <Link
          href="/trang-tuy-chinh/new"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700"
        >
          + Thêm trang
        </Link>
      </div>

      {error ? (
        <p className="text-sm text-red-500">
          Không thể tải dữ liệu. Hãy chắc chắn đã chạy migration SQL (migrations/040_create_custom_pages.sql) trong
          Supabase SQL Editor.
        </p>
      ) : (
        <div className="divide-y divide-zinc-200 overflow-hidden rounded-lg border border-zinc-200">
          {items && items.length > 0 ? (
            items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 bg-white px-4 py-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="truncate text-sm font-medium text-zinc-900">{item.title_vi || "(Chưa có tiêu đề)"}</span>
                    {!item.is_active && (
                      <span className="shrink-0 rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500">Ẩn</span>
                    )}
                  </div>
                  <div className="mt-0.5 truncate text-xs text-zinc-400">/{item.slug}</div>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <Link href={`/trang-tuy-chinh/${item.id}`} className="text-sm text-zinc-600 transition hover:text-zinc-900">
                    Sửa
                  </Link>
                  <DeleteCustomPageButton id={item.id} />
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white px-4 py-8 text-center text-sm text-zinc-500">
              Chưa có trang nào. Nhấn &quot;+ Thêm trang&quot; để bắt đầu.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
