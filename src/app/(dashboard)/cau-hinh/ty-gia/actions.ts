"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function upsertExchangeRateSettings(_prev: string | null, formData: FormData): Promise<string | null> {
  const rate = parseFloat(formData.get("usd_to_vnd_rate") as string);
  if (!rate || rate <= 0) return "Vui lòng nhập tỷ giá hợp lệ";

  const admin = createAdminClient();
  const { error } = await admin
    .from("exchange_rate_settings")
    .update({ usd_to_vnd_rate: rate, updated_at: new Date().toISOString() })
    .eq("id", 1);
  if (error) return error.message;

  revalidatePath("/cau-hinh/ty-gia");
  return null;
}
