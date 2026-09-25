"use client";

import { useState, useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { deleteStaffUser, adminResetPassword, changeStaffRole } from "./actions";
import { PasswordInput } from "@/components/password-input";

export type UserRow = {
  id: string;
  email: string;
  full_name: string;
  role: "admin" | "mod";
  created_at: string;
  last_sign_in_at?: string;
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

function RoleBadge({ role }: { role: "admin" | "mod" }) {
  return role === "admin" ? (
    <span className="shrink-0 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs text-amber-700">
      Admin
    </span>
  ) : (
    <span className="shrink-0 rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs text-blue-700">
      Mod
    </span>
  );
}

function DeleteButton({ userId, email }: { userId: string; email: string }) {
  const [state, action, pending] = useActionState(deleteStaffUser, null);
  const [confirm, setConfirm] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setConfirm(false);
      router.refresh();
    }
  }, [state, router]);

  if (!confirm) {
    return (
      <div>
        {state?.error && <p className="mb-1 text-xs text-red-600">{state.error}</p>}
        <button
          type="button"
          onClick={() => setConfirm(true)}
          className="text-xs font-medium text-red-600 hover:underline"
        >
          Xóa
        </button>
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-wrap items-center gap-2">
      <input type="hidden" name="userId" value={userId} />
      <span className="text-xs text-zinc-500">
        Xóa <strong>{email}</strong>?
      </span>
      <button type="submit" disabled={pending} className="text-xs font-semibold text-red-600 hover:underline disabled:opacity-50">
        {pending ? "..." : "Xác nhận"}
      </button>
      <button type="button" onClick={() => setConfirm(false)} className="text-xs text-zinc-500 hover:text-zinc-900">
        Hủy
      </button>
    </form>
  );
}

function ChangePasswordRow({ userId, onClose }: { userId: string; onClose: () => void }) {
  const [state, action, pending] = useActionState(adminResetPassword, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
      setTimeout(onClose, 1200);
    }
  }, [state, onClose]);

  return (
    <form ref={formRef} action={action} className="mt-3 space-y-2 rounded-lg bg-zinc-50 p-3">
      <input type="hidden" name="userId" value={userId} />
      {state?.error && <p className="text-xs text-red-600">{state.error}</p>}
      {state?.success && <p className="text-xs text-emerald-600">{state.success}</p>}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <PasswordInput id={`pw-${userId}`} name="newPassword" placeholder="Mật khẩu mới" required autoComplete="new-password" />
        <PasswordInput id={`cpw-${userId}`} name="confirmPassword" placeholder="Xác nhận mật khẩu" required autoComplete="new-password" />
      </div>
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-zinc-900 px-4 py-1.5 text-xs font-medium text-white transition hover:bg-zinc-700 disabled:opacity-50"
        >
          {pending ? "Đang lưu..." : "Lưu"}
        </button>
        <button type="button" onClick={onClose} className="text-xs text-zinc-500 hover:text-zinc-900">
          Hủy
        </button>
      </div>
    </form>
  );
}

function RoleSelectRow({ userId, currentRole, onClose }: { userId: string; currentRole: "admin" | "mod"; onClose: () => void }) {
  const [state, action, pending] = useActionState(changeStaffRole, null);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      router.refresh();
      setTimeout(onClose, 800);
    }
  }, [state, router, onClose]);

  return (
    <form action={action} className="mt-3 flex flex-wrap items-center gap-2 rounded-lg bg-zinc-50 p-3">
      <input type="hidden" name="userId" value={userId} />
      {state?.error && <p className="w-full text-xs text-red-600">{state.error}</p>}
      <select
        name="role"
        defaultValue={currentRole}
        className="rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-xs text-zinc-900 focus:ring-2 focus:ring-zinc-900 focus:outline-none"
      >
        <option value="mod">Mod</option>
        <option value="admin">Admin</option>
      </select>
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-zinc-700 disabled:opacity-50"
      >
        {pending ? "..." : "Lưu"}
      </button>
      <button type="button" onClick={onClose} className="text-xs text-zinc-500 hover:text-zinc-900">
        Hủy
      </button>
    </form>
  );
}

export function UserList({
  users,
  isAdmin,
  currentUserId,
}: {
  users: UserRow[];
  isAdmin: boolean;
  currentUserId: string;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [roleEditId, setRoleEditId] = useState<string | null>(null);

  if (users.length === 0) {
    return <p className="py-4 text-center text-sm text-zinc-500">Không tìm thấy tài khoản nào.</p>;
  }

  return (
    <div className="space-y-2">
      {users.map((user) => {
        const isSelf = user.id === currentUserId;
        // Admins can't reset another admin's password or delete another
        // admin's account — only role changes and mod-targeting actions
        // stay available. Server actions enforce this too; this just keeps
        // the buttons from being shown for an action that would 400.
        const canActOnAccount = user.role !== "admin";

        return (
          <div key={user.id} className="rounded-lg border border-zinc-200 px-4 py-3">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="truncate text-sm font-medium text-zinc-900">
                    {user.full_name || user.email}
                  </span>
                  {isSelf && (
                    <span className="shrink-0 rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500">Bạn</span>
                  )}
                  <RoleBadge role={user.role} />
                </div>
                <div className="mt-0.5 text-xs break-all text-zinc-400">{user.email}</div>
                <div className="mt-0.5 text-xs text-zinc-400">
                  Tạo: {formatDate(user.created_at)}
                  {user.last_sign_in_at && ` · Đăng nhập: ${formatDate(user.last_sign_in_at)}`}
                </div>
              </div>

              {isAdmin && !isSelf && (
                <div className="flex shrink-0 items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setRoleEditId(roleEditId === user.id ? null : user.id)}
                    className="text-xs font-medium text-zinc-600 transition hover:text-zinc-900"
                  >
                    {roleEditId === user.id ? "Đóng" : "Vai trò"}
                  </button>
                  {canActOnAccount && (
                    <>
                      <button
                        type="button"
                        onClick={() => setExpandedId(expandedId === user.id ? null : user.id)}
                        className="text-xs font-medium text-zinc-600 transition hover:text-zinc-900"
                      >
                        {expandedId === user.id ? "Đóng" : "Đổi MK"}
                      </button>
                      <DeleteButton userId={user.id} email={user.email} />
                    </>
                  )}
                </div>
              )}
            </div>

            {isAdmin && !isSelf && roleEditId === user.id && (
              <RoleSelectRow userId={user.id} currentRole={user.role} onClose={() => setRoleEditId(null)} />
            )}
            {isAdmin && !isSelf && canActOnAccount && expandedId === user.id && (
              <ChangePasswordRow userId={user.id} onClose={() => setExpandedId(null)} />
            )}
          </div>
        );
      })}
    </div>
  );
}
