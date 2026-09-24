"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function upsertMarqueeItem(_prev: string | null, formData: FormData): Promise<string | null> {
  const admin = createAdminClient();
  const id = formData.get("id") as string;

  const payload = {
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
    is_active: formData.get("is_active") === "on",
    text_vi: formData.get("text_vi") as string,
    text_en: formData.get("text_en") as string,
    updated_at: new Date().toISOString(),
  };

  if (id && id !== "") {
    const { error } = await admin.from("home_marquee_items").update(payload).eq("id", parseInt(id));
    if (error) return error.message;
  } else {
    const { error } = await admin.from("home_marquee_items").insert(payload);
    if (error) return error.message;
  }

  revalidatePath("/trang-chu/marquee");
  return null;
}

export async function deleteMarqueeItem(formData: FormData) {
  const admin = createAdminClient();
  const id = formData.get("id") as string;

  await admin.from("home_marquee_items").delete().eq("id", parseInt(id));
  revalidatePath("/trang-chu/marquee");
}
