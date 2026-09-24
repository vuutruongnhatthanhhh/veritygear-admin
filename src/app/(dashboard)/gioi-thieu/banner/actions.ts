"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

function removeImageIfOwned(admin: ReturnType<typeof createAdminClient>, url: string | null) {
  if (!url) return;
  const path = url.split("/about-images/")[1];
  if (path) admin.storage.from("about-images").remove([path]);
}

export async function upsertAboutHero(_prev: string | null, formData: FormData): Promise<string | null> {
  const admin = createAdminClient();
  const deleteImage = formData.get("delete_image") === "1";
  const selectedUrl = ((formData.get("selected_url") as string) ?? "").trim();

  const payload: Record<string, unknown> = {
    eyebrow_vi: formData.get("eyebrow_vi") as string,
    eyebrow_en: formData.get("eyebrow_en") as string,
    heading_line1_vi: formData.get("heading_line1_vi") as string,
    heading_line2_vi: formData.get("heading_line2_vi") as string,
    heading_line1_en: formData.get("heading_line1_en") as string,
    heading_line2_en: formData.get("heading_line2_en") as string,
    updated_at: new Date().toISOString(),
  };

  if (deleteImage) {
    payload.image_url = null;
  } else if (selectedUrl) {
    payload.image_url = selectedUrl;
  }

  if (deleteImage || selectedUrl) {
    const { data: current } = await admin.from("about_hero").select("image_url").eq("id", 1).single();
    if (current?.image_url && current.image_url !== selectedUrl) {
      removeImageIfOwned(admin, current.image_url);
    }
  }

  const { error } = await admin.from("about_hero").update(payload).eq("id", 1);
  if (error) return error.message;

  revalidatePath("/gioi-thieu/banner");
  return null;
}
