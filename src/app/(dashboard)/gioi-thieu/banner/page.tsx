import { createClient } from "@/lib/supabase/server";
import { AboutHeroForm } from "./about-hero-form";

export const metadata = { title: "Banner - Giới thiệu" };

export default async function AboutBannerPage() {
  const supabase = await createClient();
  const { data: hero } = await supabase.from("about_hero").select("*").eq("id", 1).single();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs text-zinc-400">
          <span>Giới thiệu</span>
          <span>/</span>
          <span>Banner</span>
        </div>
        <h1 className="text-xl font-semibold text-zinc-900">Banner</h1>
        <p className="mt-1 text-sm text-zinc-500">Khối banner đầu trang giới thiệu</p>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <AboutHeroForm hero={hero} />
      </div>
    </div>
  );
}
