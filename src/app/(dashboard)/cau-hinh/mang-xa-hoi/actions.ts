"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function upsertSocialLinks(_prev: string | null, formData: FormData): Promise<string | null> {
  const admin = createAdminClient();

  const payload = {
    facebook_url: (formData.get("facebook_url") as string) ?? "",
    facebook_active: formData.get("facebook_active") === "on",
    instagram_url: (formData.get("instagram_url") as string) ?? "",
    instagram_active: formData.get("instagram_active") === "on",
    tiktok_url: (formData.get("tiktok_url") as string) ?? "",
    tiktok_active: formData.get("tiktok_active") === "on",
    youtube_url: (formData.get("youtube_url") as string) ?? "",
    youtube_active: formData.get("youtube_active") === "on",
    updated_at: new Date().toISOString(),
  };

  const { error } = await admin.from("site_social_links").update(payload).eq("id", 1);
  if (error) return error.message;

  revalidatePath("/cau-hinh/mang-xa-hoi");
  return null;
}
