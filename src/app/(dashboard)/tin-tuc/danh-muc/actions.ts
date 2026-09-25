"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function upsertNewsCategory(_prev: string | null, formData: FormData): Promise<string | null> {
  const admin = createAdminClient();
  const id = formData.get("id") as string;
  const slug = (formData.get("slug") as string)?.trim();

  if (!slug) return "Vui lòng nhập slug";

  const payload = {
    slug,
    name_vi: formData.get("name_vi") as string,
    name_en: formData.get("name_en") as string,
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
    updated_at: new Date().toISOString(),
  };

  if (id && id !== "") {
    const { error } = await admin.from("news_categories").update(payload).eq("id", parseInt(id));
    if (error) return error.message;
  } else {
    const { error } = await admin.from("news_categories").insert(payload);
    if (error) return error.message;
  }

  revalidatePath("/tin-tuc/danh-muc");
  return null;
}

export async function deleteNewsCategory(formData: FormData) {
  const admin = createAdminClient();
  const id = formData.get("id") as string;

  await admin.from("news_categories").delete().eq("id", parseInt(id));
  revalidatePath("/tin-tuc/danh-muc");
}
