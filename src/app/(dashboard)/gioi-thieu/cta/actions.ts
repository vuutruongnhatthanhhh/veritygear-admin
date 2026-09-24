"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function upsertAboutCta(_prev: string | null, formData: FormData): Promise<string | null> {
  const admin = createAdminClient();

  const payload = {
    heading_line1_vi: formData.get("heading_line1_vi") as string,
    heading_line2_vi: formData.get("heading_line2_vi") as string,
    heading_line1_en: formData.get("heading_line1_en") as string,
    heading_line2_en: formData.get("heading_line2_en") as string,
    body_vi: formData.get("body_vi") as string,
    body_en: formData.get("body_en") as string,
    cta_label_vi: formData.get("cta_label_vi") as string,
    cta_label_en: formData.get("cta_label_en") as string,
    cta_url: (formData.get("cta_url") as string) || "/san-pham",
    updated_at: new Date().toISOString(),
  };

  const { error } = await admin.from("about_cta").update(payload).eq("id", 1);
  if (error) return error.message;

  revalidatePath("/gioi-thieu/cta");
  return null;
}
