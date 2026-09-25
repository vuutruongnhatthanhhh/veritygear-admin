import { createClient } from "@/lib/supabase/server";
import { SocialLinksForm } from "./social-links-form";

export const metadata = { title: "Mạng xã hội - Cấu hình" };

export default async function MangXaHoiPage() {
  const supabase = await createClient();
  const { data: links } = await supabase.from("site_social_links").select("*").eq("id", 1).single();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs text-zinc-400">
          <span>Cấu hình</span>
          <span>/</span>
          <span>Mạng xã hội</span>
        </div>
        <h1 className="text-xl font-semibold text-zinc-900">Mạng xã hội</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Dùng chung cho Footer, trang Liên hệ và menu di động trên trang chủ client.
        </p>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <SocialLinksForm links={links} />
      </div>
    </div>
  );
}
