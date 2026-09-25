import { createClient } from "@/lib/supabase/server";
import { ContactMapForm } from "./contact-map-form";

export const metadata = { title: "Bản đồ - Liên hệ" };

export default async function ContactMapPage() {
  const supabase = await createClient();
  const { data: map } = await supabase.from("contact_map").select("*").eq("id", 1).single();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs text-zinc-400">
          <span>Liên hệ</span>
          <span>/</span>
          <span>Bản đồ</span>
        </div>
        <h1 className="text-xl font-semibold text-zinc-900">Bản đồ</h1>
        <p className="mt-1 text-sm text-zinc-500">Bản đồ Google Maps hiển thị trên trang liên hệ</p>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <ContactMapForm map={map} />
      </div>
    </div>
  );
}
