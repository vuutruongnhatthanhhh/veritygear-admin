"use client";

import { useActionState, useEffect, useRef } from "react";
import { PasswordInput } from "@/components/password-input";
import { changeOwnPassword } from "./actions";

export function ChangePasswordForm() {
  const [state, action, pending] = useActionState(changeOwnPassword, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={action} className="space-y-4">
      {state?.success && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {state.success}
        </div>
      )}
      {state?.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</div>
      )}

      <div>
        <label htmlFor="currentPassword" className="mb-1 block text-sm font-medium text-zinc-700">
          Mật khẩu hiện tại
        </label>
        <PasswordInput id="currentPassword" name="currentPassword" autoComplete="current-password" required />
      </div>

      <div>
        <label htmlFor="newPassword" className="mb-1 block text-sm font-medium text-zinc-700">
          Mật khẩu mới
        </label>
        <PasswordInput id="newPassword" name="newPassword" autoComplete="new-password" required />
      </div>

      <div>
        <label htmlFor="confirmNewPassword" className="mb-1 block text-sm font-medium text-zinc-700">
          Xác nhận mật khẩu mới
        </label>
        <PasswordInput id="confirmNewPassword" name="confirmNewPassword" autoComplete="new-password" required />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? "Đang cập nhật..." : "Đổi mật khẩu"}
      </button>
    </form>
  );
}
