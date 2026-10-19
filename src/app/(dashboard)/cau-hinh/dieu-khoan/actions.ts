"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function upsertOrderTerms(_prev: string | null, formData: FormData): Promise<string | null> {
  const urlVi = (formData.get("url_vi") as string)?.trim();
  const urlEn = ((formData.get("url_en") as string) ?? "").trim();
  if (!urlVi) return "Vui lòng nhập link (VI)";

  const admin = createAdminClient();
  const { error } = await admin
    .from("order_terms_settings")
    .update({ url_vi: urlVi, url_en: urlEn, updated_at: new Date().toISOString() })
    .eq("id", 1);
  if (error) return error.message;

  revalidatePath("/cau-hinh/dieu-khoan");
  return null;
}
