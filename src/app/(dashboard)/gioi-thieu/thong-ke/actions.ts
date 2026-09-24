"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function upsertStat(_prev: string | null, formData: FormData): Promise<string | null> {
  const admin = createAdminClient();
  const id = formData.get("id") as string;

  const payload = {
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
    value: formData.get("value") as string,
    label_vi: formData.get("label_vi") as string,
    label_en: formData.get("label_en") as string,
    updated_at: new Date().toISOString(),
  };

  if (id && id !== "") {
    const { error } = await admin.from("about_stats").update(payload).eq("id", parseInt(id));
    if (error) return error.message;
  } else {
    const { error } = await admin.from("about_stats").insert(payload);
    if (error) return error.message;
  }

  revalidatePath("/gioi-thieu/thong-ke");
  return null;
}

export async function deleteStat(formData: FormData) {
  const admin = createAdminClient();
  const id = formData.get("id") as string;

  await admin.from("about_stats").delete().eq("id", parseInt(id));
  revalidatePath("/gioi-thieu/thong-ke");
}
