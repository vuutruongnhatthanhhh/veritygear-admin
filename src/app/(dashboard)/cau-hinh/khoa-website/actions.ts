"use server";

import { randomBytes } from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function setSiteLock(isLocked: boolean): Promise<{ bypassCode: string | null; error: string | null }> {
  const admin = createAdminClient();

  // The first time the lock is ever turned on, make sure a bypass code
  // already exists so the admin isn't locked out of their own site.
  const { data: current } = await admin.from("site_lock").select("bypass_code").eq("id", 1).single();
  const payload: Record<string, unknown> = { is_locked: isLocked, updated_at: new Date().toISOString() };
  if (isLocked && !current?.bypass_code) {
    payload.bypass_code = randomBytes(12).toString("hex");
  }

  const { error } = await admin.from("site_lock").update(payload).eq("id", 1);
  if (error) return { bypassCode: null, error: error.message };

  revalidatePath("/cau-hinh/khoa-website");
  return { bypassCode: (payload.bypass_code as string | undefined) ?? current?.bypass_code ?? null, error: null };
}

export async function regenerateBypassCode(): Promise<{ bypassCode: string | null; error: string | null }> {
  const admin = createAdminClient();
  const bypassCode = randomBytes(12).toString("hex");

  const { error } = await admin
    .from("site_lock")
    .update({ bypass_code: bypassCode, updated_at: new Date().toISOString() })
    .eq("id", 1);
  if (error) return { bypassCode: null, error: error.message };

  revalidatePath("/cau-hinh/khoa-website");
  return { bypassCode, error: null };
}
