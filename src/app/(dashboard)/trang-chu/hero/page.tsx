import { createClient } from "@/lib/supabase/server";
import { HeroForm } from "./hero-form";

export const metadata = { title: "Hero - Trang chủ" };

export default async function HeroPage() {
  const supabase = await createClient();
  const { data: hero } = await supabase.from("home_hero").select("*").eq("id", 1).single();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs text-zinc-400">
          <span>Trang chủ</span>
          <span>/</span>
          <span>Hero</span>
        </div>
        <h1 className="text-xl font-semibold text-zinc-900">Hero</h1>
        <p className="mt-1 text-sm text-zinc-500">Khối banner đầu tiên trên trang chủ veritygear</p>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <HeroForm hero={hero} />
      </div>
    </div>
  );
}
