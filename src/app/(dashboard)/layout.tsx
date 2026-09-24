import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NavHeader } from "@/components/nav-header";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // proxy.ts already gates staff-only access to this route group — this is
  // a defense-in-depth check for the case this layout is ever rendered
  // without going through the proxy (e.g. direct server-side invocation).
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || (profile.role !== "admin" && profile.role !== "mod")) redirect("/login");

  return (
    <div className="min-h-screen bg-zinc-50">
      <NavHeader email={user.email ?? ""} role={profile.role} />
      <div className="pt-12 md:pt-0 md:pl-56">
        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
