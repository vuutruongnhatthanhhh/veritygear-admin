"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { revalidateProductGuarantees } from "@/lib/revalidateClient";

export async function upsertProductGuarantees(_prev: string | null, formData: FormData): Promise<string | null> {
  const admin = createAdminClient();

  const payload = {
    warranty_label_vi: formData.get("warranty_label_vi") as string,
    warranty_label_en: formData.get("warranty_label_en") as string,
    warranty_desc_vi: formData.get("warranty_desc_vi") as string,
    warranty_desc_en: formData.get("warranty_desc_en") as string,
    return_label_vi: formData.get("return_label_vi") as string,
    return_label_en: formData.get("return_label_en") as string,
    return_desc_vi: formData.get("return_desc_vi") as string,
    return_desc_en: formData.get("return_desc_en") as string,
    shipping_label_vi: formData.get("shipping_label_vi") as string,
    shipping_label_en: formData.get("shipping_label_en") as string,
    shipping_desc_vi: formData.get("shipping_desc_vi") as string,
    shipping_desc_en: formData.get("shipping_desc_en") as string,
    updated_at: new Date().toISOString(),
  };

  const { error } = await admin.from("product_guarantees").update(payload).eq("id", 1);
  if (error) return error.message;

  revalidatePath("/san-pham/bao-hanh");
  await revalidateProductGuarantees();
  return null;
}
