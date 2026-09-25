"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

const ICON_KEYS = ["location", "phone", "email", "hours"];

export async function upsertContactCard(_prev: string | null, formData: FormData): Promise<string | null> {
  const admin = createAdminClient();
  const id = formData.get("id") as string;
  const iconKey = formData.get("icon_key") as string;

  if (!ICON_KEYS.includes(iconKey)) return "Biểu tượng không hợp lệ";

  const payload = {
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
    icon_key: iconKey,
    label_vi: formData.get("label_vi") as string,
    label_en: formData.get("label_en") as string,
    value_vi: formData.get("value_vi") as string,
    value_en: formData.get("value_en") as string,
    href: ((formData.get("href") as string) ?? "").trim() || null,
    updated_at: new Date().toISOString(),
  };

  if (id && id !== "") {
    const { error } = await admin.from("contact_info_cards").update(payload).eq("id", parseInt(id));
    if (error) return error.message;
  } else {
    const { error } = await admin.from("contact_info_cards").insert(payload);
    if (error) return error.message;
  }

  revalidatePath("/lien-he/thong-tin");
  return null;
}

export async function deleteContactCard(formData: FormData) {
  const admin = createAdminClient();
  const id = formData.get("id") as string;

  await admin.from("contact_info_cards").delete().eq("id", parseInt(id));
  revalidatePath("/lien-he/thong-tin");
}
