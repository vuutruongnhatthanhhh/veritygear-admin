import { createClient } from "@/lib/supabase/server";
import { MissionForm } from "./mission-form";

export const metadata = { title: "Sứ mệnh - Giới thiệu" };

export default async function MissionPage() {
  const supabase = await createClient();
  const { data: mission } = await supabase.from("about_mission").select("*").eq("id", 1).single();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs text-zinc-400">
          <span>Giới thiệu</span>
          <span>/</span>
          <span>Sứ mệnh</span>
        </div>
        <h1 className="text-xl font-semibold text-zinc-900">Sứ mệnh</h1>
        <p className="mt-1 text-sm text-zinc-500">Đoạn tuyên ngôn sứ mệnh trên trang giới thiệu</p>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <MissionForm mission={mission} />
      </div>
    </div>
  );
}
