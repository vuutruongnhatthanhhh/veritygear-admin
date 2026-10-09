import { createClient } from "@/lib/supabase/server";
import { NewsHeroForm } from "./news-hero-form";

export const metadata = { title: "Banner - Tin tức" };

export default async function NewsBannerPage() {
  const supabase = await createClient();
  const { data: hero } = await supabase.from("news_hero").select("*").eq("id", 1).single();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs text-zinc-400">
          <span>Tin tức</span>
          <span>/</span>
          <span>Banner</span>
        </div>
        <h1 className="text-xl font-semibold text-zinc-900">Banner</h1>
        <p className="mt-1 text-sm text-zinc-500">Khối banner đầu trang Tin tức (/tin-tuc)</p>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <NewsHeroForm hero={hero} />
      </div>
    </div>
  );
}
