import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { DeleteCategoryButton } from "./delete-category-button";
import { ToastFromSession } from "@/components/toast";

export const metadata = { title: "Danh mục - Sản phẩm" };

export default async function DanhMucPage() {
  const supabase = await createClient();
  const [{ data: categories, error }, { data: products }] = await Promise.all([
    supabase.from("product_categories").select("*").order("sort_order"),
    supabase.from("products").select("category_id"),
  ]);

  const countByCategory = new Map<number, number>();
  (products ?? []).forEach((p) => {
    if (p.category_id) countByCategory.set(p.category_id, (countByCategory.get(p.category_id) ?? 0) + 1);
  });

  return (
    <div className="max-w-3xl space-y-10">
      <ToastFromSession />
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs text-zinc-400">
          <Link href="/san-pham" className="transition hover:text-zinc-700">
            Sản phẩm
          </Link>
          <span>/</span>
          <span>Danh mục</span>
        </div>
        <h1 className="mb-2 text-xl font-semibold text-zinc-900">Danh mục sản phẩm</h1>
        <p className="text-sm text-zinc-500">Danh mục hiển thị trên trang chủ và bộ lọc trang sản phẩm.</p>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-zinc-900">Nội dung ({categories?.length ?? 0})</h2>
          <Link
            href="/san-pham/danh-muc/new"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700"
          >
            + Thêm danh mục
          </Link>
        </div>

        {error ? (
          <p className="text-sm text-red-500">
            Không thể tải dữ liệu. Hãy chắc chắn đã chạy migration SQL
            (migrations/025_create_product_categories.sql) trong Supabase SQL Editor.
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
                        {countByCategory.get(cat.id) ?? 0} sản phẩm
                      </span>
                      {!cat.show_on_homepage && (
                        <span className="shrink-0 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs text-amber-700">
                          Ẩn ở trang chủ
                        </span>
                      )}
                    </div>
                    <div className="truncate text-xs text-zinc-400">/{cat.slug}</div>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-xs text-zinc-400">#{cat.sort_order}</span>
                    <Link
                      href={`/san-pham/danh-muc/${cat.id}`}
                      className="text-sm text-zinc-600 transition hover:text-zinc-900"
                    >
                      Sửa
                    </Link>
                    <DeleteCategoryButton id={cat.id} imageUrl={cat.image_url} />
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
