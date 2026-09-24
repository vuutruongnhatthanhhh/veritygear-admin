"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { PasswordInput } from "@/components/password-input";
import { createStaffUser } from "./actions";

export function CreateUserForm() {
  const [state, action, pending] = useActionState(createStaffUser, null);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
      router.refresh();
    }
  }, [state, router]);

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
        <label htmlFor="fullName" className="mb-1 block text-sm font-medium text-zinc-700">
          Họ tên
        </label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 transition focus:ring-2 focus:ring-zinc-900 focus:outline-none"
          placeholder="Nguyễn Văn A"
        />
      </div>

      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-zinc-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="off"
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 transition focus:ring-2 focus:ring-zinc-900 focus:outline-none"
          placeholder="user@example.com"
        />
      </div>

      <div>
        <label htmlFor="role" className="mb-1 block text-sm font-medium text-zinc-700">
          Vai trò
        </label>
        <select
          id="role"
          name="role"
          defaultValue="mod"
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 transition focus:ring-2 focus:ring-zinc-900 focus:outline-none"
        >
          <option value="mod">Mod</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium text-zinc-700">
          Mật khẩu
        </label>
        <PasswordInput id="password" name="password" autoComplete="new-password" required />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium text-zinc-700">
          Xác nhận mật khẩu
        </label>
        <PasswordInput id="confirmPassword" name="confirmPassword" autoComplete="new-password" required />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? "Đang tạo..." : "Tạo tài khoản"}
      </button>
    </form>
  );
}
