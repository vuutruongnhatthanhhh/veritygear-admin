import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { UsersClient } from "./users-client";
import type { UserRow } from "./user-list";

export const metadata = { title: "Nhân viên - Tài khoản" };

export default async function NhanVienPage() {
  const supabase = await createClient();
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  const adminClient = createAdminClient();
  const [{ data: authData }, { data: profiles }] = await Promise.all([
    adminClient.auth.admin.listUsers({ perPage: 1000 }),
    adminClient.from("profiles").select("id, full_name, role"),
  ]);

  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));

  const users: UserRow[] = (authData?.users ?? [])
    .map((u): UserRow | null => {
      const profile = profileMap.get(u.id);
      if (!profile || (profile.role !== "admin" && profile.role !== "mod")) return null;
      return {
        id: u.id,
        email: u.email ?? "",
        full_name: profile.full_name ?? "",
        role: profile.role,
        created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at ?? undefined,
      };
    })
    .filter((u): u is UserRow => u !== null)
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  const currentProfile = profileMap.get(currentUser?.id ?? "");
  const isAdmin = currentProfile?.role === "admin";

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs text-zinc-400">
          <span>Tài khoản</span>
          <span>/</span>
          <span>Nhân viên</span>
        </div>
        <h1 className="text-xl font-semibold text-zinc-900">Nhân viên</h1>
        <p className="mt-1 text-sm text-zinc-500">Quản lý tài khoản admin/mod của VERITY GEAR</p>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <UsersClient users={users} isAdmin={isAdmin} currentUserId={currentUser?.id ?? ""} />
      </div>
    </div>
  );
}
