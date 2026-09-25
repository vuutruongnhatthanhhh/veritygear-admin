"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

function removeImageIfOwned(admin: ReturnType<typeof createAdminClient>, url: string | null) {
  if (!url) return;
  const path = url.split("/news-images/")[1];
  if (path) admin.storage.from("news-images").remove([path]);
}

export async function upsertNewsArticle(_prev: string | null, formData: FormData): Promise<string | null> {
  const admin = createAdminClient();
  const id = formData.get("id") as string;
  const slug = (formData.get("slug") as string)?.trim();
  const deleteImage = formData.get("delete_image") === "1";
  const selectedUrl = ((formData.get("selected_url") as string) ?? "").trim();
  const categoryIdRaw = formData.get("category_id") as string;
  const publishedAt = formData.get("published_at") as string;

  if (!slug) return "Vui lòng nhập slug";
  if (!publishedAt) return "Vui lòng chọn ngày đăng";

  const payload: Record<string, unknown> = {
    slug,
    category_id: categoryIdRaw ? parseInt(categoryIdRaw) : null,
    title_vi: formData.get("title_vi") as string,
    title_en: formData.get("title_en") as string,
    excerpt_vi: formData.get("excerpt_vi") as string,
    excerpt_en: formData.get("excerpt_en") as string,
    content_vi: formData.get("content_vi") as string,
    content_en: formData.get("content_en") as string,
    published_at: publishedAt,
    read_minutes: parseInt(formData.get("read_minutes") as string) || 5,
    is_active: formData.get("is_active") === "on",
    updated_at: new Date().toISOString(),
  };

  if (deleteImage) {
    payload.image_url = null;
  } else if (selectedUrl) {
    payload.image_url = selectedUrl;
  }

  if (id && id !== "") {
    const articleId = parseInt(id);
    if (deleteImage || selectedUrl) {
      const { data: current } = await admin.from("news_articles").select("image_url").eq("id", articleId).single();
      if (current?.image_url && current.image_url !== selectedUrl) {
        removeImageIfOwned(admin, current.image_url);
      }
    }
    const { error } = await admin.from("news_articles").update(payload).eq("id", articleId);
    if (error) return error.message;
  } else {
    if (selectedUrl) payload.image_url = selectedUrl;
    const { error } = await admin.from("news_articles").insert(payload);
    if (error) return error.message;
  }

  revalidatePath("/tin-tuc");
  return null;
}

export async function deleteNewsArticle(formData: FormData) {
  const admin = createAdminClient();
  const id = formData.get("id") as string;
  const imageUrl = formData.get("image_url") as string;

  removeImageIfOwned(admin, imageUrl);

  await admin.from("news_articles").delete().eq("id", parseInt(id));
  revalidatePath("/tin-tuc");
}
