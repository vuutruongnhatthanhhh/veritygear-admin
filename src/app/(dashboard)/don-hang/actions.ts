"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { ghnCreateOrder } from "@/lib/ghn";

const VALID_STATUSES = ["pending", "confirmed", "shipping", "completed", "cancelled"];

export async function updateOrderStatus(_prev: string | null, formData: FormData): Promise<string | null> {
  const admin = createAdminClient();
  const id = formData.get("id") as string;
  const status = formData.get("status") as string;

  if (!VALID_STATUSES.includes(status)) return "Trạng thái không hợp lệ";

  const { error } = await admin
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", parseInt(id));
  if (error) return error.message;

  revalidatePath("/don-hang");
  revalidatePath(`/don-hang/${id}`);
  return null;
}

export type GhnActionState = { error?: string; success?: string } | null;

export async function createGhnShippingOrder(_prev: GhnActionState, formData: FormData): Promise<GhnActionState> {
  const admin = createAdminClient();
  const orderId = parseInt(formData.get("orderId") as string);

  const { data: ghnSettings } = await admin.from("ghn_settings").select("*").eq("id", 1).single();
  if (!ghnSettings?.enabled) return { error: "GHN chưa được bật trong Cấu hình > Vận chuyển" };
  if (!ghnSettings.token || !ghnSettings.shop_id) return { error: "Thiếu Token hoặc ShopId của GHN" };

  const { data: order } = await admin.from("orders").select("*, order_items(*)").eq("id", orderId).single();
  if (!order) return { error: "Không tìm thấy đơn hàng" };
  if (order.ghn_order_code) return { error: "Đơn hàng đã có vận đơn GHN" };
  if (!order.to_district_id || !order.to_ward_code) {
    return { error: "Đơn hàng thiếu thông tin quận/huyện, phường/xã để tạo vận đơn (đơn được đặt trước khi bật GHN)" };
  }

  const items: { product_slug: string; product_name: string; price: number; qty: number }[] = order.order_items ?? [];
  const slugs = items.map((i) => i.product_slug);
  const { data: products } = await admin.from("products").select("slug, weight_grams").in("slug", slugs);
  const weightBySlug = new Map((products ?? []).map((p) => [p.slug, p.weight_grams]));
  const totalWeight = items.reduce((sum, i) => sum + (weightBySlug.get(i.product_slug) ?? 500) * i.qty, 0);

  try {
    const result = await ghnCreateOrder(
      { token: ghnSettings.token, shopId: ghnSettings.shop_id },
      {
        serviceTypeId: ghnSettings.service_type_id,
        toName: order.full_name,
        toPhone: order.phone,
        toAddress: order.address,
        toWardCode: order.to_ward_code,
        toDistrictId: order.to_district_id,
        weightGrams: totalWeight,
        codAmount: order.total,
        note: order.note ?? "",
        items: items.map((i) => ({ name: i.product_name, quantity: i.qty, price: i.price })),
      },
    );

    const { error } = await admin
      .from("orders")
      .update({ ghn_order_code: result.order_code, status: "confirmed", updated_at: new Date().toISOString() })
      .eq("id", orderId);
    if (error) return { error: error.message };
  } catch (e) {
    return { error: (e as Error).message };
  }

  revalidatePath(`/don-hang/${orderId}`);
  return { success: "Đã tạo vận đơn GHN thành công" };
}
