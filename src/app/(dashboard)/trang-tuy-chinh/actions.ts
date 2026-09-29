"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function upsertCustomPage(_prev: string | null, formData: FormData): Promise<string | null> {
  const admin = createAdminClient();
  const id = formData.get("id") as string;
  // Normalize the slug: strip surrounding whitespace and any leading/trailing
  // slashes so a value like "/chinh-sach-bao-mat" (which breaks both the
  // /[slug] route match and the footer href) can never be stored.
  const slug = (formData.get("slug") as string)?.trim().replace(/^\/+|\/+$/g, "");

  if (!slug) return "Vui lòng nhập slug";

  const payload: Record<string, unknown> = {
    slug,
    title_vi: formData.get("title_vi") as string,
    title_en: formData.get("title_en") as string,
    content_vi: formData.get("content_vi") as string,
    content_en: formData.get("content_en") as string,
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
    is_active: formData.get("is_active") === "on",
    updated_at: new Date().toISOString(),
  };

  if (id && id !== "") {
    const { error } = await admin.from("custom_pages").update(payload).eq("id", parseInt(id));
    if (error) return error.message;
  } else {
    const { error } = await admin.from("custom_pages").insert(payload);
    if (error) return error.message;
  }

  revalidatePath("/trang-tuy-chinh");
  return null;
}

export async function deleteCustomPage(formData: FormData) {
  const admin = createAdminClient();
  const id = formData.get("id") as string;

  await admin.from("custom_pages").delete().eq("id", parseInt(id));
  revalidatePath("/trang-tuy-chinh");
}
