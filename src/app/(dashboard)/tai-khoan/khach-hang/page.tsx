import { createAdminClient } from "@/lib/supabase/admin";
import { CustomerListClient, type CustomerRow } from "./customer-list-client";

export const metadata = { title: "Khách hàng - Tài khoản" };

export default async function KhachHangPage() {
  const adminClient = createAdminClient();
  const [{ data }, { data: profiles }] = await Promise.all([
    adminClient.auth.admin.listUsers({ perPage: 1000 }),
    // service_role bypasses RLS, so this reads every customer's profile row —
    // profiles.full_name is the stable name (user_metadata.full_name gets
    // overwritten by Google on every OAuth sign-in, profiles.full_name never does).
    adminClient.from("profiles").select("id, full_name, phone, address, role"),
  ]);
  const profileById = new Map((profiles ?? []).map((p) => [p.id, p]));

  const customers: CustomerRow[] = (data?.users ?? [])
    .filter((u) => profileById.get(u.id)?.role === "customer")
    .map((u) => {
      const profile = profileById.get(u.id);
      return {
        id: u.id,
        email: u.email ?? "",
        fullName: profile?.full_name || (u.user_metadata?.full_name as string | undefined) || "",
        phone: profile?.phone || "",
        address: profile?.address || "",
        provider: (u.app_metadata?.provider as string | undefined) ?? "email",
        createdAt: u.created_at,
        lastSignInAt: u.last_sign_in_at ?? undefined,
        emailConfirmedAt: u.email_confirmed_at ?? undefined,
      };
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs text-zinc-400">
          <span>Tài khoản</span>
          <span>/</span>
          <span>Khách hàng</span>
        </div>
        <h1 className="text-xl font-semibold text-zinc-900">Khách hàng</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Danh sách khách hàng đã đăng ký tài khoản trên veritygear ({customers.length}).
        </p>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <CustomerListClient customers={customers} />
      </div>
    </div>
  );
}
