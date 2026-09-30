import { createClient } from "@/lib/supabase/server";
import { SeoForm } from "./seo-form";

export const metadata = { title: "SEO - Cấu hình" };

export default async function SeoPage() {
  const supabase = await createClient();
  const { data: content, error } = await supabase.from("seo_settings").select("*").eq("id", 1).single();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs text-zinc-400">
          <span>Cấu hình</span>
          <span>/</span>
          <span>SEO</span>
        </div>
        <h1 className="text-xl font-semibold text-zinc-900">SEO</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Tiêu đề, mô tả, từ khóa và ảnh chia sẻ mặc định của toàn site (trang chủ + fallback cho các trang chưa có mô
          tả riêng). Sản phẩm, tin tức và trang tùy chỉnh vẫn dùng tiêu đề/mô tả riêng của từng mục.
        </p>
      </div>

      {error ? (
        <p className="text-sm text-red-500">
          Không thể tải dữ liệu. Hãy chắc chắn đã chạy migration SQL (migrations/041_create_seo_settings.sql) trong
          Supabase SQL Editor.
        </p>
      ) : (
        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <SeoForm content={content} />
        </div>
      )}
    </div>
  );
}
