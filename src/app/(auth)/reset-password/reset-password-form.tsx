"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { PasswordInput } from "@/components/password-input";

export function ResetPasswordForm({ email }: { email: string }) {
  const router = useRouter();
  const supabase = createClient();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const code = (formData.get("code") as string).trim();
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }
    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    setSubmitting(true);
    setError(null);

    const { error: verifyError } = await supabase.auth.verifyOtp({ email, token: code, type: "recovery" });
    if (verifyError) {
      setSubmitting(false);
      setError("Mã xác nhận không đúng hoặc đã hết hạn.");
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({ password });
    setSubmitting(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push("/"), 1200);
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold text-zinc-900">Đặt lại mật khẩu</h1>
        <p className="mt-1 text-sm text-zinc-500">
          {email ? `Nhập mã xác nhận đã gửi tới ${email} và mật khẩu mới.` : "Nhập mã xác nhận và mật khẩu mới."}
        </p>
      </div>

      {success ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Đã đặt lại mật khẩu! Đang chuyển hướng...
        </div>
      ) : !email ? (
        <div className="space-y-4 text-center">
          <p className="text-sm text-zinc-500">Không tìm thấy yêu cầu đặt lại mật khẩu.</p>
          <Link href="/forgot-password" className="text-sm font-semibold text-zinc-900 underline">
            Yêu cầu mã mới
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="code" className="mb-1 block text-sm font-medium text-zinc-700">
              Mã xác nhận (8 số)
            </label>
            <input
              id="code"
              name="code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={8}
              required
              placeholder="00000000"
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-center text-sm tracking-[0.5em] text-zinc-900 placeholder-zinc-400 transition focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-zinc-700">
              Mật khẩu mới
            </label>
            <PasswordInput
              id="password"
              name="password"
              autoComplete="new-password"
              required
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium text-zinc-700">
              Xác nhận mật khẩu
            </label>
            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              autoComplete="new-password"
              required
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-50"
          >
            {submitting ? "Đang lưu..." : "Đặt lại mật khẩu"}
          </button>
        </form>
      )}
    </div>
  );
}
