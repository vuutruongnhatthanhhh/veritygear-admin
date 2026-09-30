"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function upsertSeoSettings(_prev: string | null, formData: FormData): Promise<string | null> {
  const admin = createAdminClient();
  const selectedUrl = ((formData.get("selected_url") as string) ?? "").trim();

  const payload: Record<string, unknown> = {
    site_name: (formData.get("site_name") as string)?.trim() || "VERITY GEAR",
    title_vi: formData.get("title_vi") as string,
    title_en: formData.get("title_en") as string,
    description_vi: formData.get("description_vi") as string,
    description_en: formData.get("description_en") as string,
    keywords_vi: formData.get("keywords_vi") as string,
    keywords_en: formData.get("keywords_en") as string,
    updated_at: new Date().toISOString(),
  };

  // Only overwrite the OG image when a new one was picked; leave it untouched otherwise.
  if (selectedUrl) payload.og_image_url = selectedUrl;

  const { error } = await admin.from("seo_settings").update(payload).eq("id", 1);
  if (error) return error.message;

  revalidatePath("/cau-hinh/seo");
  return null;
}
