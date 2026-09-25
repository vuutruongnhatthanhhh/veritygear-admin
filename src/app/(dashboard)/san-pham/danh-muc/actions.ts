"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

function removeImageIfOwned(admin: ReturnType<typeof createAdminClient>, url: string | null) {
  if (!url) return;
  const path = url.split("/product-images/")[1];
  if (path) admin.storage.from("product-images").remove([path]);
}

export async function upsertCategory(_prev: string | null, formData: FormData): Promise<string | null> {
  const admin = createAdminClient();
  const id = formData.get("id") as string;
  const slug = (formData.get("slug") as string)?.trim();
  const deleteImage = formData.get("delete_image") === "1";
  const selectedUrl = ((formData.get("selected_url") as string) ?? "").trim();

  if (!slug) return "Vui lòng nhập slug";

  const payload: Record<string, unknown> = {
    slug,
    name_vi: formData.get("name_vi") as string,
    name_en: formData.get("name_en") as string,
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
    show_on_homepage: formData.get("show_on_homepage") === "on",
    updated_at: new Date().toISOString(),
  };

  if (deleteImage) {
    payload.image_url = null;
  } else if (selectedUrl) {
    payload.image_url = selectedUrl;
  }

  if (id && id !== "") {
    if (deleteImage || selectedUrl) {
      const { data: current } = await admin.from("product_categories").select("image_url").eq("id", parseInt(id)).single();
      if (current?.image_url && current.image_url !== selectedUrl) {
        removeImageIfOwned(admin, current.image_url);
      }
    }
    const { error } = await admin.from("product_categories").update(payload).eq("id", parseInt(id));
    if (error) return error.message;
  } else {
    if (selectedUrl) payload.image_url = selectedUrl;
    const { error } = await admin.from("product_categories").insert(payload);
    if (error) return error.message;
  }

  revalidatePath("/san-pham/danh-muc");
  return null;
}

export async function deleteCategory(formData: FormData) {
  const admin = createAdminClient();
  const id = formData.get("id") as string;
  const imageUrl = formData.get("image_url") as string;

  removeImageIfOwned(admin, imageUrl);

  await admin.from("product_categories").delete().eq("id", parseInt(id));
  revalidatePath("/san-pham/danh-muc");
}
