"use client";

import { useActionState } from "react";
import Link from "next/link";
import { PasswordInput } from "@/components/password-input";
import { login } from "./actions";

export function LoginForm({ unauthorized = false }: { unauthorized?: boolean }) {
  const [error, action, pending] = useActionState(login, null);

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold text-zinc-900">Đăng nhập</h1>
        <p className="mt-1 text-sm text-zinc-500">Quản trị VERITY GEAR</p>
      </div>

      {unauthorized && !error && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Tài khoản này không có quyền truy cập trang quản trị.
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form action={action} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-zinc-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 transition focus:outline-none focus:ring-2 focus:ring-zinc-900"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-zinc-700">
            Mật khẩu
          </label>
          <PasswordInput id="password" name="password" autoComplete="current-password" required />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-50"
        >
          {pending ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>

      <Link
        href="/forgot-password"
        className="mt-4 block text-center text-sm text-zinc-500 hover:text-zinc-900"
      >
        Quên mật khẩu?
      </Link>
    </div>
  );
}
