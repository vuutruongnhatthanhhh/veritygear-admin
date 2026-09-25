import { createClient } from "@/lib/supabase/server";
import { ShippingSettingsForm } from "./shipping-settings-form";

export const metadata = { title: "Vận chuyển - Cấu hình" };

export default async function VanChuyenPage() {
  const supabase = await createClient();
  const { data: settings } = await supabase.from("shipping_settings").select("*").eq("id", 1).single();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs text-zinc-400">
          <span>Cấu hình</span>
          <span>/</span>
          <span>Vận chuyển</span>
        </div>
        <h1 className="text-xl font-semibold text-zinc-900">Vận chuyển</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Phí vận chuyển và ngưỡng miễn phí áp dụng cho giỏ hàng và thanh toán trên trang client.
        </p>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <ShippingSettingsForm settings={settings} />
      </div>
    </div>
  );
}
