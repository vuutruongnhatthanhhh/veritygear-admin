import { createClient } from "@/lib/supabase/server";
import { AboutCtaForm } from "./about-cta-form";

export const metadata = { title: "CTA cuối trang - Giới thiệu" };

export default async function AboutCtaPage() {
  const supabase = await createClient();
  const { data: cta } = await supabase.from("about_cta").select("*").eq("id", 1).single();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs text-zinc-400">
          <span>Giới thiệu</span>
          <span>/</span>
          <span>CTA cuối trang</span>
        </div>
        <h1 className="text-xl font-semibold text-zinc-900">CTA cuối trang</h1>
        <p className="mt-1 text-sm text-zinc-500">Khối kêu gọi hành động ở cuối trang giới thiệu</p>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <AboutCtaForm cta={cta} />
      </div>
    </div>
  );
}
