import nodemailer from 'nodemailer';

// ─── Transporter (configured from env vars) ─────────────────────────────────────
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // true for 465, false for other ports (STARTTLS)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// ─── Send Verification Email ────────────────────────────────────────────────────
export async function sendVerificationEmail(
  to: string,
  token: string,
  userName: string
): Promise<void> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const verifyUrl = `${appUrl}/verify?token=${token}`;
  const from = process.env.EMAIL_FROM || 'Kraaft <noreply@kraaft.dev>';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background-color:#0a0a0b;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0b;padding:40px 20px;">
        <tr>
          <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background-color:#18181b;border-radius:16px;border:1px solid #27272a;overflow:hidden;">
              <!-- Header -->
              <tr>
                <td style="padding:32px 32px 0;text-align:center;">
                  <div style="display:inline-block;background-color:#fff;color:#000;padding:8px 20px;border-radius:8px;font-size:16px;font-weight:800;letter-spacing:-0.5px;">
                    Kraaft
                  </div>
                </td>
              </tr>
              <!-- Body -->
              <tr>
                <td style="padding:32px;">
                  <h1 style="color:#fafafa;font-size:22px;font-weight:700;margin:0 0 8px;">
                    Verify your email
                  </h1>
                  <p style="color:#a1a1aa;font-size:15px;line-height:1.6;margin:0 0 24px;">
                    Hey ${userName}, welcome to Kraaft! Please click the button below to verify your email address and activate your account.
                  </p>
                  <a href="${verifyUrl}" style="display:inline-block;background-color:#fff;color:#000;padding:12px 28px;border-radius:8px;font-size:14px;font-weight:600;text-decoration:none;letter-spacing:-0.2px;">
                    Verify Email Address
                  </a>
                  <p style="color:#71717a;font-size:13px;line-height:1.5;margin:24px 0 0;">
                    This link will expire in <strong style="color:#a1a1aa;">24 hours</strong>. If you didn't create this account, you can safely ignore this email.
                  </p>
                </td>
              </tr>
              <!-- Divider -->
              <tr>
                <td style="padding:0 32px;">
                  <hr style="border:none;border-top:1px solid #27272a;margin:0;">
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="padding:20px 32px 28px;text-align:center;">
                  <p style="color:#52525b;font-size:12px;margin:0;">
                    Kraaft — 300+ Free Online Tools
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from,
    to,
    subject: 'Verify your email — Kraaft',
    html,
  });
}
