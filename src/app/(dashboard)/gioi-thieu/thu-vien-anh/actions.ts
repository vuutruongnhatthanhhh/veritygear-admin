"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

function removeImageIfOwned(admin: ReturnType<typeof createAdminClient>, url: string | null) {
  if (!url) return;
  const path = url.split("/about-images/")[1];
  if (path) admin.storage.from("about-images").remove([path]);
}

export async function upsertGalleryImage(_prev: string | null, formData: FormData): Promise<string | null> {
  const admin = createAdminClient();
  const id = formData.get("id") as string;
  const selectedUrl = ((formData.get("selected_url") as string) ?? "").trim();

  const payload: Record<string, unknown> = {
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
    alt_vi: formData.get("alt_vi") as string,
    alt_en: formData.get("alt_en") as string,
    updated_at: new Date().toISOString(),
  };

  if (selectedUrl) payload.image_url = selectedUrl;

  if (id && id !== "") {
    if (selectedUrl) {
      const { data: current } = await admin
        .from("about_gallery_images")
        .select("image_url")
        .eq("id", parseInt(id))
        .single();
      if (current?.image_url && current.image_url !== selectedUrl) {
        removeImageIfOwned(admin, current.image_url);
      }
    }
    const { error } = await admin.from("about_gallery_images").update(payload).eq("id", parseInt(id));
    if (error) return error.message;
  } else {
    if (!selectedUrl) return "Vui lòng chọn ảnh";
    const { error } = await admin.from("about_gallery_images").insert(payload);
    if (error) return error.message;
  }

  revalidatePath("/gioi-thieu/thu-vien-anh");
  return null;
}

export async function deleteGalleryImage(formData: FormData) {
  const admin = createAdminClient();
  const id = formData.get("id") as string;
  const imageUrl = formData.get("image_url") as string;

  removeImageIfOwned(admin, imageUrl);

  await admin.from("about_gallery_images").delete().eq("id", parseInt(id));
  revalidatePath("/gioi-thieu/thu-vien-anh");
}
