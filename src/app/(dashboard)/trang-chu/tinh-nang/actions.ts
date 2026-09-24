"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

const ICON_KEYS = ["precision", "warranty", "shipping", "community"];

export async function upsertFeatureItem(_prev: string | null, formData: FormData): Promise<string | null> {
  const admin = createAdminClient();
  const id = formData.get("id") as string;
  const iconKey = formData.get("icon_key") as string;

  if (!ICON_KEYS.includes(iconKey)) return "Biểu tượng không hợp lệ";

  const payload = {
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
    icon_key: iconKey,
    title_vi: formData.get("title_vi") as string,
    title_en: formData.get("title_en") as string,
    desc_vi: formData.get("desc_vi") as string,
    desc_en: formData.get("desc_en") as string,
    updated_at: new Date().toISOString(),
  };

  if (id && id !== "") {
    const { error } = await admin.from("home_feature_strip_items").update(payload).eq("id", parseInt(id));
    if (error) return error.message;
  } else {
    const { error } = await admin.from("home_feature_strip_items").insert(payload);
    if (error) return error.message;
  }

  revalidatePath("/trang-chu/tinh-nang");
  return null;
}

export async function deleteFeatureItem(formData: FormData) {
  const admin = createAdminClient();
  const id = formData.get("id") as string;

  await admin.from("home_feature_strip_items").delete().eq("id", parseInt(id));
  revalidatePath("/trang-chu/tinh-nang");
}
