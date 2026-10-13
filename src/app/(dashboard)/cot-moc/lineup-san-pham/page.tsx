import { createClient } from "@/lib/supabase/server";
import { LineupForm } from "./lineup-form";

export const metadata = { title: "Lineup sản phẩm - Cột mốc" };

export default async function MilestonesLineupPage() {
  const supabase = await createClient();
  const { data: lineup } = await supabase.from("milestones_lineup").select("*").eq("id", 1).single();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs text-zinc-400">
          <span>Cột mốc</span>
          <span>/</span>
          <span>Lineup sản phẩm</span>
        </div>
        <h1 className="text-xl font-semibold text-zinc-900">Lineup sản phẩm</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Nhãn nhỏ và tiêu đề phía trên khối sản phẩm lineup mới trên trang Cột mốc (/cot-moc). Sản phẩm nào hiển thị
          ở đây được chọn trong trang Sản phẩm (tick &quot;Lineup mới&quot;).
        </p>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <LineupForm lineup={lineup} />
      </div>
    </div>
  );
}
