import { LoginForm } from "./login-form";

export const metadata = { title: "Đăng nhập" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return <LoginForm unauthorized={error === "unauthorized"} />;
}
