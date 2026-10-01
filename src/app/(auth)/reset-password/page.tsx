import { ResetPasswordForm } from "./reset-password-form";

export const metadata = { title: "Đặt lại mật khẩu" };

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;
  return <ResetPasswordForm email={(email ?? "").trim()} />;
}
