"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function upsertContactSettings(_prev: string | null, formData: FormData): Promise<string | null> {
  const admin = createAdminClient();
  const recipientEmail = (formData.get("recipient_email") as string)?.trim();

  if (!recipientEmail) return "Vui lòng nhập email";

  const { error } = await admin
    .from("contact_settings")
    .update({ recipient_email: recipientEmail, updated_at: new Date().toISOString() })
    .eq("id", 1);
  if (error) return error.message;

  revalidatePath("/lien-he/email-nhan");
  return null;
}
