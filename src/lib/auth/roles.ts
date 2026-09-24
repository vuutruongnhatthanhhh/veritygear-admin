import { createClient } from "@/lib/supabase/server";

export type StaffRole = "admin" | "mod";

// Authoritative role check — queries `profiles.role` directly rather than
// trusting the JWT's app_metadata mirror, since app_metadata is only synced
// at role-change time and this guard protects the actual mutation.
async function getCurrentStaffRole(): Promise<{ userId: string; role: StaffRole } | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || (profile.role !== "admin" && profile.role !== "mod")) return null;
  return { userId: user.id, role: profile.role };
}

export async function requireStaff() {
  const staff = await getCurrentStaffRole();
  if (!staff) throw new Error("Bạn cần đăng nhập với tài khoản nhân viên");
  return staff;
}

export async function requireAdmin() {
  const staff = await requireStaff();
  if (staff.role !== "admin") {
    throw new Error("Chỉ quản trị viên (admin) mới có quyền thực hiện thao tác này");
  }
  return staff;
}
