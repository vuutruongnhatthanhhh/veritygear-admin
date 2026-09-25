import { createClient } from "@/lib/supabase/server";
import { FooterForm } from "./footer-form";

export const metadata = { title: "Footer - Cấu hình" };

export default async function FooterPage() {
  const supabase = await createClient();
  const { data: content } = await supabase.from("site_footer").select("*").eq("id", 1).single();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs text-zinc-400">
          <span>Cấu hình</span>
          <span>/</span>
          <span>Footer</span>
        </div>
        <h1 className="text-xl font-semibold text-zinc-900">Footer</h1>
        <p className="mt-1 text-sm text-zinc-500">Câu giới thiệu ngắn hiển thị dưới logo ở footer trang client.</p>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <FooterForm content={content} />
      </div>
    </div>
  );
}
