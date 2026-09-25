"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function upsertShippingSettings(_prev: string | null, formData: FormData): Promise<string | null> {
  const admin = createAdminClient();
  const payload = {
    free_shipping_threshold: parseInt(formData.get("free_shipping_threshold") as string) || 0,
    shipping_fee: parseInt(formData.get("shipping_fee") as string) || 0,
    updated_at: new Date().toISOString(),
  };

  const { error } = await admin.from("shipping_settings").update(payload).eq("id", 1);
  if (error) return error.message;

  revalidatePath("/cau-hinh/van-chuyen");
  return null;
}
