"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/roles";

export type ActionState = { error?: string; success?: string } | null;

async function countAdmins(): Promise<number> {
  const adminClient = createAdminClient();
  const { count } = await adminClient
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("role", "admin");
  return count ?? 0;
}

// ─── Create staff user ─────────────────────────────────────────────────────

export async function createStaffUser(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    await requireAdmin();
  } catch (e) {
    return { error: (e as Error).message };
  }

  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const fullName = ((formData.get("fullName") as string) ?? "").trim();
  const role = formData.get("role") as string;

  if (role !== "admin" && role !== "mod") return { error: "Vai trò không hợp lệ" };
  if (!email) return { error: "Vui lòng nhập email" };
  if (password !== confirmPassword) return { error: "Mật khẩu xác nhận không khớp" };
  if (password.length < 6) return { error: "Mật khẩu phải có ít nhất 6 ký tự" };

  const adminClient = createAdminClient();
  const { data: existing } = await adminClient.auth.admin.listUsers({ perPage: 1000 });
  if (existing?.users.some((u) => u.email?.toLowerCase() === email)) {
    return { error: `Email ${email} đã được sử dụng` };
  }

  // app_metadata.role is what proxy.ts reads to gate dashboard access on the
  // JWT alone — profiles.role (set right below) stays the authoritative copy.
  const { data, error } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    app_metadata: { role },
  });
  if (error || !data.user) return { error: error?.message ?? "Không thể tạo tài khoản" };

  const { error: profileError } = await adminClient
    .from("profiles")
    .upsert({ id: data.user.id, role, full_name: fullName });
  if (profileError) return { error: profileError.message };

  return { success: `Đã tạo tài khoản ${email} thành công` };
}

// ─── Change own password ───────────────────────────────────────────────────

export async function changeOwnPassword(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmNewPassword = formData.get("confirmNewPassword") as string;

  if (newPassword !== confirmNewPassword) return { error: "Mật khẩu xác nhận không khớp" };
  if (newPassword.length < 6) return { error: "Mật khẩu mới phải có ít nhất 6 ký tự" };
  if (currentPassword === newPassword) return { error: "Mật khẩu mới phải khác mật khẩu hiện tại" };

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user?.email) return { error: "Không xác định được tài khoản" };

  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });
  if (verifyError) return { error: "Mật khẩu hiện tại không đúng" };

  const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
  if (updateError) return { error: updateError.message };
  return { success: "Đổi mật khẩu thành công" };
}

// ─── Admin resets another staff member's password ──────────────────────────

export async function adminResetPassword(_prev: ActionState, formData: FormData): Promise<ActionState> {
  let admin: Awaited<ReturnType<typeof requireAdmin>>;
  try {
    admin = await requireAdmin();
  } catch (e) {
    return { error: (e as Error).message };
  }

  const userId = formData.get("userId") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!userId) return { error: "Không tìm thấy tài khoản" };
  if (userId === admin.userId) {
    return { error: "Vui lòng dùng tab Đổi mật khẩu để đổi mật khẩu của chính bạn" };
  }
  if (newPassword !== confirmPassword) return { error: "Mật khẩu xác nhận không khớp" };
  if (newPassword.length < 6) return { error: "Mật khẩu phải có ít nhất 6 ký tự" };

  const adminClient = createAdminClient();
  const { error } = await adminClient.auth.admin.updateUserById(userId, { password: newPassword });
  if (error) return { error: error.message };
  return { success: "Đã đổi mật khẩu thành công" };
}

// ─── Change staff role ──────────────────────────────────────────────────────

export async function changeStaffRole(_prev: ActionState, formData: FormData): Promise<ActionState> {
  let admin: Awaited<ReturnType<typeof requireAdmin>>;
  try {
    admin = await requireAdmin();
  } catch (e) {
    return { error: (e as Error).message };
  }

  const userId = formData.get("userId") as string;
  const role = formData.get("role") as string;
  if (role !== "admin" && role !== "mod") return { error: "Vai trò không hợp lệ" };
  if (userId === admin.userId) return { error: "Không thể tự thay đổi vai trò của chính bạn" };

  const adminClient = createAdminClient();
  const { data: current } = await adminClient.from("profiles").select("role").eq("id", userId).single();
  if (current?.role === "admin" && role !== "admin" && (await countAdmins()) <= 1) {
    return { error: "Không thể hạ quyền admin cuối cùng của hệ thống" };
  }

  const { error: profileError } = await adminClient.from("profiles").update({ role }).eq("id", userId);
  if (profileError) return { error: profileError.message };

  const { error: authError } = await adminClient.auth.admin.updateUserById(userId, {
    app_metadata: { role },
  });
  if (authError) return { error: authError.message };

  return { success: "Đã cập nhật vai trò" };
}

// ─── Delete staff user ──────────────────────────────────────────────────────

export async function deleteStaffUser(_prev: ActionState, formData: FormData): Promise<ActionState> {
  let admin: Awaited<ReturnType<typeof requireAdmin>>;
  try {
    admin = await requireAdmin();
  } catch (e) {
    return { error: (e as Error).message };
  }

  const userId = formData.get("userId") as string;
  if (!userId) return { error: "Không tìm thấy tài khoản" };
  if (userId === admin.userId) return { error: "Không thể tự xóa tài khoản của chính bạn" };

  const adminClient = createAdminClient();
  const { data: profile } = await adminClient.from("profiles").select("role").eq("id", userId).single();
  if (profile?.role === "admin" && (await countAdmins()) <= 1) {
    return { error: "Không thể xóa admin cuối cùng của hệ thống" };
  }

  const { error } = await adminClient.auth.admin.deleteUser(userId);
  if (error) return { error: error.message };
  return { success: "Đã xóa tài khoản" };
}
