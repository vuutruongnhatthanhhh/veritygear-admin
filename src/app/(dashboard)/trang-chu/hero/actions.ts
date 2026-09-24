"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

function removeImageIfOwned(admin: ReturnType<typeof createAdminClient>, url: string | null) {
  if (!url) return;
  const path = url.split("/home-images/")[1];
  if (path) admin.storage.from("home-images").remove([path]);
}

export async function upsertHero(_prev: string | null, formData: FormData): Promise<string | null> {
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

    body_vi: formData.get("body_vi") as string,
    body_en: formData.get("body_en") as string,

    cta1_label_vi: formData.get("cta1_label_vi") as string,
    cta1_label_en: formData.get("cta1_label_en") as string,
    cta1_url: (formData.get("cta1_url") as string) || "#",

    cta2_label_vi: formData.get("cta2_label_vi") as string,
    cta2_label_en: formData.get("cta2_label_en") as string,
    cta2_url: (formData.get("cta2_url") as string) || "#",

    updated_at: new Date().toISOString(),
  };

  if (deleteImage) {
    payload.image_url = null;
  } else if (selectedUrl) {
    payload.image_url = selectedUrl;
  }

  if (deleteImage || selectedUrl) {
    const { data: current } = await admin.from("home_hero").select("image_url").eq("id", 1).single();
    if (current?.image_url && current.image_url !== selectedUrl) {
      removeImageIfOwned(admin, current.image_url);
    }
  }

  const { error } = await admin.from("home_hero").update(payload).eq("id", 1);
  if (error) return error.message;

  revalidatePath("/trang-chu/hero");
  return null;
}
