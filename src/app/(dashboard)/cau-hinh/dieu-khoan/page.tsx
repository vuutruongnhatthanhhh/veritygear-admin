import { createClient } from "@/lib/supabase/server";
import { TermsForm } from "./terms-form";

export const metadata = { title: "Điều khoản & Điều kiện - Cấu hình" };

export default async function DieuKhoanPage() {
  const supabase = await createClient();
  const { data: settings } = await supabase.from("order_terms_settings").select("*").eq("id", 1).single();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs text-zinc-400">
          <span>Đơn hàng</span>
          <span>/</span>
          <span>Điều khoản & Điều kiện</span>
        </div>
        <h1 className="text-xl font-semibold text-zinc-900">Điều khoản & Điều kiện</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Link tới trang Điều khoản &amp; Điều kiện cho từng ngôn ngữ (có thể là một trang đã tạo ở mục &quot;Trang
          tùy chỉnh&quot;, hoặc một URL bất kỳ). Khách phải tick đồng ý link này mới đặt hàng được ở trang thanh toán —
          link hiển thị theo ngôn ngữ khách đang xem (bỏ trống EN sẽ dùng link VI).
        </p>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <TermsForm settings={settings} />
      </div>
    </div>
  );
}
