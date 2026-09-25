"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function upsertCategoryGrid(_prev: string | null, formData: FormData): Promise<string | null> {
  const admin = createAdminClient();
  const payload = {
    eyebrow_vi: formData.get("eyebrow_vi") as string,
    eyebrow_en: formData.get("eyebrow_en") as string,
    heading_line1_vi: formData.get("heading_line1_vi") as string,
    heading_line2_vi: formData.get("heading_line2_vi") as string,
    heading_line1_en: formData.get("heading_line1_en") as string,
    heading_line2_en: formData.get("heading_line2_en") as string,
    description_vi: formData.get("description_vi") as string,
    description_en: formData.get("description_en") as string,
    updated_at: new Date().toISOString(),
  };

  const { error } = await admin.from("home_category_grid").update(payload).eq("id", 1);
  if (error) return error.message;

  revalidatePath("/trang-chu/khu-vuc-san-pham");
  return null;
}

export async function upsertFeaturedProducts(_prev: string | null, formData: FormData): Promise<string | null> {
  const admin = createAdminClient();
  const payload = {
    eyebrow_vi: formData.get("eyebrow_vi") as string,
    eyebrow_en: formData.get("eyebrow_en") as string,
    heading_vi: formData.get("heading_vi") as string,
    heading_en: formData.get("heading_en") as string,
    view_all_label_vi: formData.get("view_all_label_vi") as string,
    view_all_label_en: formData.get("view_all_label_en") as string,
    updated_at: new Date().toISOString(),
  };

  const { error } = await admin.from("home_featured_products").update(payload).eq("id", 1);
  if (error) return error.message;

  revalidatePath("/trang-chu/khu-vuc-san-pham");
  return null;
}

export async function upsertProductSpotlight(_prev: string | null, formData: FormData): Promise<string | null> {
  const admin = createAdminClient();
  const payload = {
    eyebrow_vi: formData.get("eyebrow_vi") as string,
    eyebrow_en: formData.get("eyebrow_en") as string,
    cta_label_vi: formData.get("cta_label_vi") as string,
    cta_label_en: formData.get("cta_label_en") as string,
    updated_at: new Date().toISOString(),
  };

  const { error } = await admin.from("home_product_spotlight").update(payload).eq("id", 1);
  if (error) return error.message;

  revalidatePath("/trang-chu/khu-vuc-san-pham");
  return null;
}
