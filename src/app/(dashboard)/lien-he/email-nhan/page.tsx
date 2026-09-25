import { createClient } from "@/lib/supabase/server";
import { ContactSettingsForm } from "./contact-settings-form";

export const metadata = { title: "Email nhận tin nhắn - Liên hệ" };

export default async function EmailNhanPage() {
  const supabase = await createClient();
  const { data: settings } = await supabase.from("contact_settings").select("*").eq("id", 1).single();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs text-zinc-400">
          <span>Liên hệ</span>
          <span>/</span>
          <span>Email nhận tin nhắn</span>
        </div>
        <h1 className="text-xl font-semibold text-zinc-900">Email nhận tin nhắn</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Mỗi khi khách hàng gửi biểu mẫu liên hệ trên trang liên hệ, tin nhắn sẽ được gửi tới email này.
        </p>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <ContactSettingsForm settings={settings} />
      </div>
    </div>
  );
}
