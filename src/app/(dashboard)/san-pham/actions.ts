"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

type SpecInput = { label_vi: string; label_en: string; value_vi: string; value_en: string };

function removeImageIfOwned(admin: ReturnType<typeof createAdminClient>, url: string | null) {
  if (!url) return;
  const path = url.split("/product-images/")[1];
  if (path) admin.storage.from("product-images").remove([path]);
}

function parseSpecs(raw: string | null): SpecInput[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((s) => s && typeof s === "object")
      .map((s) => ({
        label_vi: String(s.label_vi ?? ""),
        label_en: String(s.label_en ?? ""),
        value_vi: String(s.value_vi ?? ""),
        value_en: String(s.value_en ?? ""),
      }))
      .filter((s) => s.label_vi.trim() !== "" || s.value_vi.trim() !== "");
  } catch {
    return [];
  }
}

export async function upsertProduct(_prev: string | null, formData: FormData): Promise<string | null> {
  const admin = createAdminClient();
  const id = formData.get("id") as string;
  const slug = (formData.get("slug") as string)?.trim();
  const deleteImage = formData.get("delete_image") === "1";
  const selectedUrl = ((formData.get("selected_url") as string) ?? "").trim();
  const categoryIdRaw = formData.get("category_id") as string;
  const specs = parseSpecs(formData.get("specs_json") as string | null);

  if (!slug) return "Vui lòng nhập slug";

  const priceRaw = formData.get("price") as string;
  const compareAtPriceRaw = formData.get("compare_at_price") as string;

  const payload: Record<string, unknown> = {
    slug,
    name: formData.get("name") as string,
    category_id: categoryIdRaw ? parseInt(categoryIdRaw) : null,
    tagline_vi: formData.get("tagline_vi") as string,
    tagline_en: formData.get("tagline_en") as string,
    description_vi: formData.get("description_vi") as string,
    description_en: formData.get("description_en") as string,
    price: parseInt(priceRaw) || 0,
    compare_at_price: compareAtPriceRaw ? parseInt(compareAtPriceRaw) || null : null,
    badge_vi: (formData.get("badge_vi") as string)?.trim() || null,
    badge_en: (formData.get("badge_en") as string)?.trim() || null,
    is_active: formData.get("is_active") === "on",
    is_featured: formData.get("is_featured") === "on",
    is_spotlight: formData.get("is_spotlight") === "on",
    is_lineup: formData.get("is_lineup") === "on",
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
    updated_at: new Date().toISOString(),
  };

  if (deleteImage) {
    payload.image_url = null;
  } else if (selectedUrl) {
    payload.image_url = selectedUrl;
  }

  let productId: number;

  if (id && id !== "") {
    productId = parseInt(id);
    if (deleteImage || selectedUrl) {
      const { data: current } = await admin.from("products").select("image_url").eq("id", productId).single();
      if (current?.image_url && current.image_url !== selectedUrl) {
        removeImageIfOwned(admin, current.image_url);
      }
    }
    const { error } = await admin.from("products").update(payload).eq("id", productId);
    if (error) return error.message;

    const { error: deleteSpecsError } = await admin.from("product_specs").delete().eq("product_id", productId);
    if (deleteSpecsError) return deleteSpecsError.message;
  } else {
    if (selectedUrl) payload.image_url = selectedUrl;
    const { data: inserted, error } = await admin.from("products").insert(payload).select("id").single();
    if (error) return error.message;
    productId = inserted.id;
  }

  if (specs.length > 0) {
    const { error: specsError } = await admin.from("product_specs").insert(
      specs.map((s, i) => ({ product_id: productId, sort_order: i, ...s })),
    );
    if (specsError) return specsError.message;
  }

  revalidatePath("/san-pham");
  return null;
}

export async function deleteProduct(formData: FormData) {
  const admin = createAdminClient();
  const id = formData.get("id") as string;
  const imageUrl = formData.get("image_url") as string;

  removeImageIfOwned(admin, imageUrl);

  await admin.from("products").delete().eq("id", parseInt(id));
  revalidatePath("/san-pham");
}
