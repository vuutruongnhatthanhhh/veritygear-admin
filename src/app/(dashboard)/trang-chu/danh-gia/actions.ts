"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function upsertTestimonial(_prev: string | null, formData: FormData): Promise<string | null> {
  const admin = createAdminClient();
  const id = formData.get("id") as string;
  const rating = parseInt(formData.get("rating") as string) || 5;

  if (rating < 1 || rating > 5) return "Đánh giá phải từ 1 đến 5 sao";

  const payload = {
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
    is_active: formData.get("is_active") === "on",
    quote_vi: formData.get("quote_vi") as string,
    quote_en: formData.get("quote_en") as string,
    name: formData.get("name") as string,
    role_vi: formData.get("role_vi") as string,
    role_en: formData.get("role_en") as string,
    rating,
    updated_at: new Date().toISOString(),
  };

  if (id && id !== "") {
    const { error } = await admin.from("home_testimonials").update(payload).eq("id", parseInt(id));
    if (error) return error.message;
  } else {
    const { error } = await admin.from("home_testimonials").insert(payload);
    if (error) return error.message;
  }

  revalidatePath("/trang-chu/danh-gia");
  return null;
}

export async function deleteTestimonial(formData: FormData) {
  const admin = createAdminClient();
  const id = formData.get("id") as string;

  await admin.from("home_testimonials").delete().eq("id", parseInt(id));
  revalidatePath("/trang-chu/danh-gia");
}
