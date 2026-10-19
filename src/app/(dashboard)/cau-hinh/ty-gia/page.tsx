import { createClient } from "@/lib/supabase/server";
import { ExchangeRateForm } from "./exchange-rate-form";

export const metadata = { title: "Tỷ giá USD/VNĐ - Cấu hình" };

export default async function TyGiaPage() {
  const supabase = await createClient();
  const { data: settings } = await supabase.from("exchange_rate_settings").select("*").eq("id", 1).single();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs text-zinc-400">
          <span>Đơn hàng</span>
          <span>/</span>
          <span>Tỷ giá USD/VNĐ</span>
        </div>
        <h1 className="text-xl font-semibold text-zinc-900">Tỷ giá USD/VNĐ</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Khi khách xem trang bằng tiếng Anh, giá sản phẩm sẽ hiển thị bằng USD, quy đổi theo tỷ giá này. Thanh toán
          vẫn luôn thực hiện bằng VNĐ như bình thường — tỷ giá chỉ ảnh hưởng tới giá hiển thị.
        </p>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <ExchangeRateForm settings={settings} />
      </div>
    </div>
  );
}
