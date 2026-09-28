import { createClient } from "@/lib/supabase/server";
import { ShippingSettingsForm } from "./shipping-settings-form";
import { GhnSettingsForm } from "./ghn-settings-form";

export const metadata = { title: "Vận chuyển - Cấu hình" };

export default async function VanChuyenPage() {
  const supabase = await createClient();
  const [{ data: settings }, { data: ghnSettings }] = await Promise.all([
    supabase.from("shipping_settings").select("*").eq("id", 1).single(),
    supabase.from("ghn_settings").select("*").eq("id", 1).single(),
  ]);

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
        <h2 className="mb-4 text-sm font-semibold text-zinc-900">Phí cố định (dự phòng)</h2>
        <ShippingSettingsForm settings={settings} />
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <h2 className="mb-1 text-sm font-semibold text-zinc-900">Giao Hàng Nhanh (GHN)</h2>
        <p className="mb-4 text-sm text-zinc-500">
          Khi bật, phí vận chuyển sẽ được tính tự động theo địa chỉ khách hàng qua API của GHN thay vì mức phí cố
          định ở trên. Nếu gọi API GHN thất bại, hệ thống sẽ tự động dùng lại mức phí cố định.
        </p>
        <GhnSettingsForm settings={ghnSettings} />
      </div>
    </div>
  );
}
