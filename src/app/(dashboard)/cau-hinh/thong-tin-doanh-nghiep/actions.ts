"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { revalidateSiteWide } from "@/lib/revalidateClient";

export async function upsertBusinessInfo(_prev: string | null, formData: FormData): Promise<string | null> {
  const admin = createAdminClient();
  const payload = {
    content_vi: ((formData.get("content_vi") as string) ?? "").trim(),
    content_en: ((formData.get("content_en") as string) ?? "").trim(),
    updated_at: new Date().toISOString(),
  };

  const { error } = await admin.from("site_business_info").update(payload).eq("id", 1);
  if (error) return error.message;

  revalidatePath("/cau-hinh/thong-tin-doanh-nghiep");
  await revalidateSiteWide();
  return null;
}
