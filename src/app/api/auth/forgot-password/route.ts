import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getTransporter, hasSmtpConfig, getMailFrom, emailLayout } from "@/lib/mailer";
import { isRateLimited, getClientIp } from "@/lib/rateLimit";

// Shows the OTP as plain text (not a clickable link) — some email clients /
// security scanners auto-visit links in emails, which would silently consume
// a one-time recovery link before the user ever clicks it. A typed code has
// nothing for a scanner to click, so it can't be burned that way.
function resetPasswordEmailHtml(otp: string) {
  return emailLayout(`
    <h2 style="margin:0 0 12px; font-size: 20px;">Đặt lại mật khẩu</h2>
    <p style="color:#444; line-height:1.6;">
      Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản quản trị này. Nhập mã xác nhận sau trên trang đặt lại mật khẩu:
    </p>
    <p style="text-align:center; margin: 28px 0;">
      <span style="display:inline-block; background:#0A0A0A; color:#FAFAF9; font-weight:700; letter-spacing:0.3em; font-size:28px; padding:16px 28px;">
        ${otp}
      </span>
    </p>
    <p style="color:#999; font-size:12px; line-height:1.6;">
      Mã có hiệu lực trong thời gian ngắn. Nếu bạn không yêu cầu điều này, có thể bỏ qua email này.
    </p>
  `);
}

function resetPasswordEmailText(otp: string) {
  return `Đặt lại mật khẩu\n\nChúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản quản trị này. Mã xác nhận của bạn là:\n\n${otp}\n\nMã có hiệu lực trong thời gian ngắn. Nếu bạn không yêu cầu điều này, có thể bỏ qua email này.`;
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
  const { data, error } = await admin.auth.admin.generateLink({ type: "recovery", email });

  // Don't reveal whether an email is registered, and only ever email staff
  // accounts from this app — customers reset their own password from the
  // client site instead.
  const role = data?.user?.app_metadata?.role;
  const isStaff = role === "admin" || role === "mod";
  if (error || !isStaff) {
    return NextResponse.json({ ok: true });
  }

  const otp = data.properties?.email_otp;
  if (!otp) {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }

  try {
    const transporter = getTransporter();
    await transporter.sendMail({
      from: `"VERITY GEAR Admin" <${getMailFrom()}>`,
      to: email,
      subject: "Mã đặt lại mật khẩu - VERITY GEAR Admin",
      text: resetPasswordEmailText(otp),
      html: resetPasswordEmailHtml(otp),
    });
  } catch (err) {
    console.error("Failed to send password reset email:", err);
    return NextResponse.json({ error: "send_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
