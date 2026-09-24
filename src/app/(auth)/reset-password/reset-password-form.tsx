"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { PasswordInput } from "@/components/password-input";

export function ResetPasswordForm() {
  const router = useRouter();
  const supabase = createClient();

  const [checking, setChecking] = useState(true);
  const [hasRecoverySession, setHasRecoverySession] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setHasRecoverySession(true);
    });

    // The recovery link logs the user in via a special session — if one
    // already exists by the time this page mounts, treat it as valid too.
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setHasRecoverySession(true);
      setChecking(false);
    });

    return () => sub.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
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
    const { error } = await supabase.auth.updateUser({ password });
    setSubmitting(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push("/"), 1200);
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold text-zinc-900">Đặt lại mật khẩu</h1>
        <p className="mt-1 text-sm text-zinc-500">Nhập mật khẩu mới cho tài khoản của bạn.</p>
      </div>

      {success ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Đã đặt lại mật khẩu! Đang chuyển hướng...
        </div>
      ) : checking ? (
        <p className="text-center text-sm text-zinc-500">Đang kiểm tra liên kết...</p>
      ) : !hasRecoverySession ? (
        <div className="space-y-4 text-center">
          <p className="text-sm text-zinc-500">
            Liên kết không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu liên kết mới.
          </p>
          <Link href="/forgot-password" className="text-sm font-semibold text-zinc-900 underline">
            Yêu cầu liên kết mới
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
