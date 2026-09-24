import nodemailer from "nodemailer";

export function hasSmtpConfig(): boolean {
  return !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

export function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

// Full HTML document (not just a fragment) with an explicit UTF-8 <meta charset> —
// without this, some mail clients guess the wrong encoding and Vietnamese
// diacritics render as mojibake.
export function emailLayout(bodyHtml: string) {
  return `<!DOCTYPE html>
<html lang="vi">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body style="margin:0; padding:0; background:#f4f4f4;">
    <div style="font-family: Arial, Helvetica, sans-serif; max-width: 480px; margin: 0 auto;">
      <div style="background:#0A0A0A; padding: 32px 24px; text-align: center;">
        <span style="color:#FAFAF9; font-weight: 900; letter-spacing: 0.1em; font-size: 14px;">VERITY GEAR ADMIN</span>
      </div>
      <div style="padding: 32px 24px; background:#fff;">
        ${bodyHtml}
      </div>
    </div>
  </body>
</html>`;
}

// `label` must already be upper-cased in the source string — do NOT use CSS
// text-transform:uppercase here, and avoid font-weight:900 with Vietnamese
// text; several mail-client renderers botch double-diacritic glyphs
// (ậ, ễ, ộ, ...) at those weights. font-weight:700 renders reliably.
export function emailButtonHtml(link: string, label: string) {
  return `
    <div style="text-align:center; margin: 28px 0;">
      <a href="${link}" style="background:#0A0A0A; color:#FAFAF9; text-decoration:none; font-weight:700; letter-spacing:0.1em; font-size:12px; padding:14px 28px; display:inline-block;">
        ${label}
      </a>
    </div>
  `;
}
