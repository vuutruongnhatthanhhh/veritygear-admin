import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { DeleteProductButton } from "./delete-product-button";
import { ToastFromSession } from "@/components/toast";

export const metadata = { title: "Sản phẩm" };

function formatVnd(value: number): string {
  return value.toLocaleString("vi-VN") + "₫";
}

export default async function SanPhamPage() {
  const supabase = await createClient();
  const { data: items, error } = await supabase
    .from("products")
    .select("*, product_categories(name_vi)")
    .order("sort_order");

  return (
    <div className="max-w-4xl space-y-6">
      <ToastFromSession />
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs text-zinc-400">
          <span>Sản phẩm</span>
          <span>/</span>
          <span>Sản phẩm</span>
        </div>
        <h1 className="text-xl font-semibold text-zinc-900">Sản phẩm</h1>
        <p className="mt-1 text-sm text-zinc-500">Toàn bộ catalog sản phẩm hiển thị trên veritygear.</p>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-zinc-900">Danh sách ({items?.length ?? 0})</h2>
        <div className="flex items-center gap-3">
          <Link href="/san-pham/danh-muc" className="text-sm text-zinc-600 transition hover:text-zinc-900">
            Quản lý danh mục →
          </Link>
          <Link
            href="/san-pham/new"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700"
          >
            + Thêm sản phẩm
          </Link>
        </div>
      </div>

      {error ? (
        <p className="text-sm text-red-500">
          Không thể tải dữ liệu. Hãy chắc chắn đã chạy migration SQL (migrations/026_create_products.sql) trong
          Supabase SQL Editor.
        </p>
      ) : (
        <div className="divide-y divide-zinc-200 overflow-hidden rounded-lg border border-zinc-200">
          {items && items.length > 0 ? (
            items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 bg-white px-4 py-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-zinc-100">
                  {item.image_url && (
                    <Image src={item.image_url} alt={item.name} fill className="object-cover" unoptimized />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="truncate text-sm font-medium text-zinc-900">{item.name}</span>
                    {!item.is_active && (
                      <span className="shrink-0 rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500">Ẩn</span>
                    )}
                    {item.is_featured && (
                      <span className="shrink-0 rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs text-blue-700">
                        Nổi bật
                      </span>
                    )}
                    {item.is_spotlight && (
                      <span className="shrink-0 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs text-amber-700">
                        Hero
                      </span>
                    )}
                    {item.is_lineup && (
                      <span className="shrink-0 rounded-full border border-purple-200 bg-purple-50 px-2 py-0.5 text-xs text-purple-700">
                        Lineup
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 truncate text-xs text-zinc-400">
                    {item.product_categories?.name_vi ?? "Chưa phân loại"} · {formatVnd(item.price)}
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <span className="text-xs text-zinc-400">#{item.sort_order}</span>
                  <Link href={`/san-pham/${item.id}`} className="text-sm text-zinc-600 transition hover:text-zinc-900">
                    Sửa
                  </Link>
                  <DeleteProductButton id={item.id} imageUrl={item.image_url} />
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white px-4 py-8 text-center text-sm text-zinc-500">
              Chưa có sản phẩm nào. Nhấn &quot;+ Thêm sản phẩm&quot; để bắt đầu.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
