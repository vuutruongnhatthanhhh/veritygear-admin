import { createClient } from "@/lib/supabase/server";
import { SiteLockForm } from "./site-lock-form";

export const metadata = { title: "Khóa website - Cấu hình" };

export default async function SiteLockPage() {
  const supabase = await createClient();
  const { data: lock } = await supabase.from("site_lock").select("*").eq("id", 1).single();
  const siteUrl = (process.env.CLIENT_SITE_URL ?? "").replace(/\/+$/, "");

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs text-zinc-400">
          <span>Cấu hình</span>
          <span>/</span>
          <span>Khóa website</span>
        </div>
        <h1 className="text-xl font-semibold text-zinc-900">Khóa website</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Khi bật, mọi khách truy cập veritygear.vn sẽ thấy trang &quot;Sắp quay trở lại&quot; thay vì nội dung thật.
          Dùng link đặc biệt bên dưới để tự truy cập web bình thường trong lúc khóa.
        </p>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <SiteLockForm lock={lock} siteUrl={siteUrl} />
      </div>
    </div>
  );
}
