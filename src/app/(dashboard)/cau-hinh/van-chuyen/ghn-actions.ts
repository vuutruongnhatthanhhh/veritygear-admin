"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { ghnGetProvinces } from "@/lib/ghn";

export async function upsertGhnSettings(_prev: string | null, formData: FormData): Promise<string | null> {
  const admin = createAdminClient();
  const payload = {
    enabled: formData.get("enabled") === "on",
    token: (formData.get("token") as string)?.trim(),
    shop_id: (formData.get("shop_id") as string)?.trim(),
    service_type_id: parseInt(formData.get("service_type_id") as string) || 2,
    updated_at: new Date().toISOString(),
  };

  const { error } = await admin.from("ghn_settings").update(payload).eq("id", 1);
  if (error) return error.message;

  revalidatePath("/cau-hinh/van-chuyen");
  return null;
}

export type TestConnectionState = { error?: string; success?: string } | null;

export async function testGhnConnection(_prev: TestConnectionState, formData: FormData): Promise<TestConnectionState> {
  const token = (formData.get("token") as string)?.trim();
  if (!token) return { error: "Vui lòng nhập Token trước khi kiểm tra" };

  try {
    const provinces = await ghnGetProvinces({ token });
    return { success: `Token hợp lệ — tải được ${provinces.length} tỉnh/thành.` };
  } catch (e) {
    return { error: (e as Error).message };
  }
}
