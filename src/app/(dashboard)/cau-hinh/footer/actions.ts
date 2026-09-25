"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function upsertFooter(_prev: string | null, formData: FormData): Promise<string | null> {
  const admin = createAdminClient();
  const payload = {
    tagline_vi: formData.get("tagline_vi") as string,
    tagline_en: formData.get("tagline_en") as string,
    updated_at: new Date().toISOString(),
  };

  const { error } = await admin.from("site_footer").update(payload).eq("id", 1);
  if (error) return error.message;

  revalidatePath("/cau-hinh/footer");
  return null;
}
