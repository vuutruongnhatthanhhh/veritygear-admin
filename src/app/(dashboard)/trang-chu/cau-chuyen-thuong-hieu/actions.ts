"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

function removeImageIfOwned(admin: ReturnType<typeof createAdminClient>, url: string | null) {
  if (!url) return;
  const path = url.split("/home-images/")[1];
  if (path) admin.storage.from("home-images").remove([path]);
}

export async function upsertBrandStory(_prev: string | null, formData: FormData): Promise<string | null> {
  const admin = createAdminClient();
  const deleteImage = formData.get("delete_image") === "1";
  const selectedUrl = ((formData.get("selected_url") as string) ?? "").trim();

  const payload: Record<string, unknown> = {
    eyebrow_vi: formData.get("eyebrow_vi") as string,
    eyebrow_en: formData.get("eyebrow_en") as string,
    heading_vi: formData.get("heading_vi") as string,
    heading_en: formData.get("heading_en") as string,
    body_vi: formData.get("body_vi") as string,
    body_en: formData.get("body_en") as string,
    cta_label_vi: formData.get("cta_label_vi") as string,
    cta_label_en: formData.get("cta_label_en") as string,
    cta_url: (formData.get("cta_url") as string) || "/gioi-thieu",
    updated_at: new Date().toISOString(),
  };

  if (deleteImage) {
    payload.image_url = null;
  } else if (selectedUrl) {
    payload.image_url = selectedUrl;
  }

  if (deleteImage || selectedUrl) {
    const { data: current } = await admin.from("home_brand_story").select("image_url").eq("id", 1).single();
    if (current?.image_url && current.image_url !== selectedUrl) {
      removeImageIfOwned(admin, current.image_url);
    }
  }

  const { error } = await admin.from("home_brand_story").update(payload).eq("id", 1);
  if (error) return error.message;

  revalidatePath("/trang-chu/cau-chuyen-thuong-hieu");
  return null;
}
