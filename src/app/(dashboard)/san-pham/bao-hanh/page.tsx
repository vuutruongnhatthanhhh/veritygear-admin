import { createClient } from "@/lib/supabase/server";
import { GuaranteesForm } from "./guarantees-form";

export const metadata = { title: "Bảo hành & giao hàng - Sản phẩm" };

export default async function ProductGuaranteesPage() {
  const supabase = await createClient();
  const { data: guarantees } = await supabase.from("product_guarantees").select("*").eq("id", 1).single();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs text-zinc-400">
          <span>Sản phẩm</span>
          <span>/</span>
          <span>Bảo hành & giao hàng</span>
        </div>
        <h1 className="text-xl font-semibold text-zinc-900">Bảo hành & giao hàng</h1>
        <p className="mt-1 text-sm text-zinc-500">
          3 khối cam kết (bảo hành, đổi trả, giao hàng) hiển thị trên trang chi tiết mọi sản phẩm
        </p>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <GuaranteesForm guarantees={guarantees} />
      </div>
    </div>
  );
}
