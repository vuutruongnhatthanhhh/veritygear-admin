"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function upsertMilestone(_prev: string | null, formData: FormData): Promise<string | null> {
  const admin = createAdminClient();
  const id = formData.get("id") as string;

  const payload = {
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
    year: formData.get("year") as string,
    title_vi: formData.get("title_vi") as string,
    title_en: formData.get("title_en") as string,
    desc_vi: formData.get("desc_vi") as string,
    desc_en: formData.get("desc_en") as string,
    updated_at: new Date().toISOString(),
  };

  if (id && id !== "") {
    const { error } = await admin.from("milestones_timeline").update(payload).eq("id", parseInt(id));
    if (error) return error.message;
  } else {
    const { error } = await admin.from("milestones_timeline").insert(payload);
    if (error) return error.message;
  }

  revalidatePath("/cot-moc/hanh-trinh");
  return null;
}

export async function deleteMilestone(formData: FormData) {
  const admin = createAdminClient();
  const id = formData.get("id") as string;

  await admin.from("milestones_timeline").delete().eq("id", parseInt(id));
  revalidatePath("/cot-moc/hanh-trinh");
}
