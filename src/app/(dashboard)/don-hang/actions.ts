"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

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
