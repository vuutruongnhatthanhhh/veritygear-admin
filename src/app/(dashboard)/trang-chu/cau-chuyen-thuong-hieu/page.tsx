import { createClient } from "@/lib/supabase/server";
import { BrandStoryForm } from "./brand-story-form";

export const metadata = { title: "Câu chuyện thương hiệu - Trang chủ" };

export default async function BrandStoryPage() {
  const supabase = await createClient();
  const { data: story } = await supabase.from("home_brand_story").select("*").eq("id", 1).single();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs text-zinc-400">
          <span>Trang chủ</span>
          <span>/</span>
          <span>Câu chuyện thương hiệu</span>
        </div>
        <h1 className="text-xl font-semibold text-zinc-900">Câu chuyện thương hiệu</h1>
        <p className="mt-1 text-sm text-zinc-500">Khối giới thiệu thương hiệu trên trang chủ</p>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <BrandStoryForm story={story} />
      </div>
    </div>
  );
}
