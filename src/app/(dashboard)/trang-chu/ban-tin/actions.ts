"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function upsertNewsletter(_prev: string | null, formData: FormData): Promise<string | null> {
  const admin = createAdminClient();

  const payload = {
    eyebrow_vi: formData.get("eyebrow_vi") as string,
    eyebrow_en: formData.get("eyebrow_en") as string,
    heading_vi: formData.get("heading_vi") as string,
    heading_en: formData.get("heading_en") as string,
    body_vi: formData.get("body_vi") as string,
    body_en: formData.get("body_en") as string,
    updated_at: new Date().toISOString(),
  };

  const { error } = await admin.from("home_newsletter").update(payload).eq("id", 1);
  if (error) return error.message;

  revalidatePath("/trang-chu/ban-tin");
  return null;
}
