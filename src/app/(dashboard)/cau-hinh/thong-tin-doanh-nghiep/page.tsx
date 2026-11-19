import { createClient } from "@/lib/supabase/server";
import { BusinessInfoForm } from "./business-info-form";

export const metadata = { title: "Thông tin doanh nghiệp - Cấu hình" };

export default async function ThongTinDoanhNghiepPage() {
  const supabase = await createClient();
  const { data: content } = await supabase.from("site_business_info").select("*").eq("id", 1).single();

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs text-zinc-400">
          <span>Cấu hình</span>
          <span>/</span>
          <span>Thông tin doanh nghiệp</span>
        </div>
        <h1 className="text-xl font-semibold text-zinc-900">Thông tin doanh nghiệp</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Hiển thị ở cột riêng trong footer trang client (tên hộ kinh doanh/công ty, địa chỉ, số điện thoại, email,
          mã số kinh doanh, ngày cấp, nơi cấp).
        </p>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <BusinessInfoForm content={content} />
      </div>
    </div>
  );
}
