import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { BanTinTabs } from "./ban-tin-tabs";

export const metadata = { title: "Bản tin - Trang chủ" };

export default async function BanTinPage() {
  const supabase = await createClient();
  const admin = createAdminClient();

  const [{ data: newsletter }, { data: subscribers }] = await Promise.all([
    supabase.from("home_newsletter").select("*").eq("id", 1).single(),
    admin.from("home_newsletter_subscribers").select("id, email, created_at").order("created_at", { ascending: false }),
  ]);

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs text-zinc-400">
          <span>Trang chủ</span>
          <span>/</span>
          <span>Bản tin</span>
        </div>
        <h1 className="text-xl font-semibold text-zinc-900">Bản tin</h1>
        <p className="mt-1 text-sm text-zinc-500">Nội dung khối đăng ký bản tin và danh sách người đăng ký</p>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <BanTinTabs newsletter={newsletter} subscribers={subscribers ?? []} />
      </div>
    </div>
  );
}
