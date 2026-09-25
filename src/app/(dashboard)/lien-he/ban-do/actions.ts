"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function upsertContactMap(_prev: string | null, formData: FormData): Promise<string | null> {
  const admin = createAdminClient();

  const payload = {
    heading_vi: formData.get("heading_vi") as string,
    heading_en: formData.get("heading_en") as string,
    footer_label_vi: formData.get("footer_label_vi") as string,
    footer_label_en: formData.get("footer_label_en") as string,
    map_embed_url: (formData.get("map_embed_url") as string)?.trim(),
    updated_at: new Date().toISOString(),
  };

  if (!payload.map_embed_url) return "Vui lòng nhập link nhúng Google Maps";

  const { error } = await admin.from("contact_map").update(payload).eq("id", 1);
  if (error) return error.message;

  revalidatePath("/lien-he/ban-do");
  return null;
}
