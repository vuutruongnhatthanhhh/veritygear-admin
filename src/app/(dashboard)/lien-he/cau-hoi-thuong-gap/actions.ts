"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function upsertFaq(_prev: string | null, formData: FormData): Promise<string | null> {
  const admin = createAdminClient();
  const id = formData.get("id") as string;

  const payload = {
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
    question_vi: formData.get("question_vi") as string,
    question_en: formData.get("question_en") as string,
    answer_vi: formData.get("answer_vi") as string,
    answer_en: formData.get("answer_en") as string,
    updated_at: new Date().toISOString(),
  };

  if (id && id !== "") {
    const { error } = await admin.from("contact_faqs").update(payload).eq("id", parseInt(id));
    if (error) return error.message;
  } else {
    const { error } = await admin.from("contact_faqs").insert(payload);
    if (error) return error.message;
  }

  revalidatePath("/lien-he/cau-hoi-thuong-gap");
  return null;
}

export async function deleteFaq(formData: FormData) {
  const admin = createAdminClient();
  const id = formData.get("id") as string;

  await admin.from("contact_faqs").delete().eq("id", parseInt(id));
  revalidatePath("/lien-he/cau-hoi-thuong-gap");
}
