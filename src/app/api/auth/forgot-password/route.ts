import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getTransporter, hasSmtpConfig, emailLayout, emailButtonHtml } from "@/lib/mailer";
import { isRateLimited, getClientIp } from "@/lib/rateLimit";

function resetPasswordEmailHtml(actionLink: string) {
  return emailLayout(`
    <h2 style="margin:0 0 12px; font-size: 20px;">Đặt lại mật khẩu</h2>
    <p style="color:#444; line-height:1.6;">
      Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản quản trị này. Nhấn vào nút bên dưới để đặt mật khẩu mới.
    </p>
    ${emailButtonHtml(actionLink, "ĐẶT LẠI MẬT KHẨU")}
    <p style="color:#999; font-size:12px; line-height:1.6;">
      Nếu bạn không yêu cầu điều này, có thể bỏ qua email này.
    </p>
  `);
}

function resetPasswordEmailText(actionLink: string) {
  return `Đặt lại mật khẩu\n\nChúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản quản trị này. Mở liên kết sau để đặt mật khẩu mới:\n${actionLink}\n\nNếu bạn không yêu cầu điều này, có thể bỏ qua email này.`;
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  if (isRateLimited(`forgot-password:${ip}`, 3, 15 * 60 * 1000)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: { email?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  if (!email) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  if (!hasSmtpConfig()) {
    return NextResponse.json({ error: "send_failed" }, { status: 500 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.generateLink({
    type: "recovery",
    email,
    options: { redirectTo: `${request.nextUrl.origin}/reset-password` },
  });

  // Don't reveal whether an email is registered, and only ever email staff
  // accounts from this app — customers reset their own password from the
  // client site instead.
  const role = data?.user?.app_metadata?.role;
  const isStaff = role === "admin" || role === "mod";
  if (error || !isStaff) {
    return NextResponse.json({ ok: true });
  }

  const actionLink = data.properties?.action_link;
  if (!actionLink) {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }

  try {
    const transporter = getTransporter();
    await transporter.sendMail({
      from: `"VERITY GEAR Admin" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Đặt lại mật khẩu - VERITY GEAR Admin",
      text: resetPasswordEmailText(actionLink),
      html: resetPasswordEmailHtml(actionLink),
    });
  } catch (err) {
    console.error("Failed to send password reset email:", err);
    return NextResponse.json({ error: "send_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
