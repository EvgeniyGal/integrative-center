import { Resend } from "resend";

import { site } from "@/lib/site";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error("RESEND_API_KEY is not set");
  }
  return new Resend(key);
}

function fromAddress() {
  return process.env.EMAIL_FROM ?? `Admin <noreply@${new URL(site.url).hostname}>`;
}

function appUrl() {
  return process.env.AUTH_URL ?? site.url;
}

export async function sendAdminInviteEmail(params: {
  to: string;
  token: string;
}) {
  const link = `${appUrl()}/admin/accept-invite?token=${params.token}`;
  const resend = getResend();

  await resend.emails.send({
    from: fromAddress(),
    to: params.to,
    subject: `You're invited to manage ${site.shortName}`,
    html: `
      <p>You have been invited to the admin panel for ${site.name}.</p>
      <p><a href="${link}">Accept invite and set your password</a></p>
      <p>This link expires in 48 hours.</p>
      <p>If you did not expect this email, you can ignore it.</p>
    `,
  });
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export type StaffEmailResult = {
  sent: number;
  error: string | null;
};

async function sendToRecipients(params: {
  to: string[];
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<StaffEmailResult> {
  if (params.to.length === 0) {
    return { sent: 0, error: "No notification recipients are configured." };
  }
  const resend = getResend();
  const from = fromAddress();
  const failures: string[] = [];
  let sent = 0;

  for (const recipient of params.to) {
    const { error } = await resend.emails.send({
      from,
      to: recipient,
      replyTo: params.replyTo,
      subject: params.subject,
      html: params.html,
    });
    if (error) {
      failures.push(`${recipient}: ${error.message}`);
    } else {
      sent += 1;
    }
  }

  return {
    sent,
    error: failures.length > 0 ? failures.join(" ") : null,
  };
}

function contactRequestEmailHtml(params: {
  name: string;
  phone: string;
  email: string;
  message: string;
}) {
  const name = escapeHtml(params.name);
  const phone = escapeHtml(params.phone);
  const email = escapeHtml(params.email);
  const message = escapeHtml(params.message).replaceAll("\n", "<br />");
  const phoneHref = `tel:${params.phone.replace(/[^\d+]/g, "")}`;
  const adminLink = `${appUrl()}/admin/contact-requests`;
  const brand = "#079ca2";
  const brandDark = "#05747a";
  const ivory = "#f6f3ee";
  const stone = "#e4ddd2";
  const ink = "#1c1b19";
  const muted = "#6d6861";

  const detailRow = (label: string, valueHtml: string) => `
    <tr>
      <td style="padding:0 0 16px 0;">
        <p style="margin:0 0 4px 0;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:${muted};font-family:Georgia,'Times New Roman',serif;">
          ${label}
        </p>
        <p style="margin:0;font-size:16px;line-height:1.5;color:${ink};font-family:Arial,Helvetica,sans-serif;">
          ${valueHtml}
        </p>
      </td>
    </tr>
  `;

  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>New consult request</title>
  </head>
  <body style="margin:0;padding:0;background:${ivory};color:${ink};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${ivory};padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background:#ffffff;border:1px solid ${stone};">
            <tr>
              <td style="background:${brand};padding:22px 28px;">
                <p style="margin:0;font-size:12px;letter-spacing:0.22em;text-transform:uppercase;color:#ffffff;font-family:Arial,Helvetica,sans-serif;opacity:0.9;">
                  ${escapeHtml(site.shortName)}
                </p>
                <h1 style="margin:8px 0 0 0;font-size:24px;line-height:1.3;color:#ffffff;font-weight:normal;font-family:Georgia,'Times New Roman',serif;">
                  New consult request
                </h1>
              </td>
            </tr>
            <tr>
              <td style="padding:28px;">
                <p style="margin:0 0 24px 0;font-size:15px;line-height:1.6;color:${muted};font-family:Arial,Helvetica,sans-serif;">
                  A visitor submitted the contact form on
                  <strong style="color:${ink};">${escapeHtml(site.name)}</strong>.
                  You can reply directly to this email to reach them.
                </p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${ivory};border:1px solid ${stone};">
                  <tr>
                    <td style="padding:22px 22px 6px 22px;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                        ${detailRow("Name", name)}
                        ${detailRow(
                          "Email",
                          `<a href="mailto:${email}" style="color:${brandDark};text-decoration:none;">${email}</a>`,
                        )}
                        ${detailRow(
                          "Phone",
                          `<a href="${phoneHref}" style="color:${brandDark};text-decoration:none;">${phone}</a>`,
                        )}
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:0 22px 22px 22px;">
                      <p style="margin:0 0 8px 0;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:${muted};font-family:Georgia,'Times New Roman',serif;">
                        Message
                      </p>
                      <div style="padding:16px 18px;background:#ffffff;border-left:3px solid ${brand};font-size:15px;line-height:1.65;color:${ink};font-family:Arial,Helvetica,sans-serif;">
                        ${message}
                      </div>
                    </td>
                  </tr>
                </table>
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0 0 0;">
                  <tr>
                    <td style="background:${brand};border-radius:2px;">
                      <a href="${escapeHtml(adminLink)}" style="display:inline-block;padding:12px 20px;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;text-decoration:none;color:#ffffff;font-family:Arial,Helvetica,sans-serif;">
                        Open in admin
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 28px;border-top:1px solid ${stone};background:${ivory};">
                <p style="margin:0;font-size:12px;line-height:1.5;color:${muted};font-family:Arial,Helvetica,sans-serif;">
                  ${escapeHtml(site.name)} · ${escapeHtml(site.address.full)}
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
  `.trim();
}

export async function sendContactRequestEmail(params: {
  to: string[];
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  message: string;
}): Promise<StaffEmailResult> {
  const name = `${params.firstName} ${params.lastName}`.trim();
  return sendToRecipients({
    to: params.to,
    replyTo: params.email,
    subject: `New consult request from ${name}`,
    html: contactRequestEmailHtml({
      name,
      phone: params.phone,
      email: params.email,
      message: params.message,
    }),
  });
}

export async function sendNewsletterSignupEmail(params: {
  to: string[];
  firstName?: string;
  lastName?: string;
  email: string;
}): Promise<StaffEmailResult> {
  const name = `${params.firstName ?? ""} ${params.lastName ?? ""}`.trim();
  return sendToRecipients({
    to: params.to,
    replyTo: params.email,
    subject: `New newsletter signup: ${params.email}`,
    html: `
      <p>Someone subscribed to the ${site.name} newsletter.</p>
      ${name ? `<p><strong>Name:</strong> ${escapeHtml(name)}</p>` : ""}
      <p><strong>Email:</strong> ${escapeHtml(params.email)}</p>
    `,
  });
}

export async function sendTestStaffEmail(params: {
  to: string[];
  channel: "contact" | "newsletter";
}): Promise<StaffEmailResult> {
  const kind =
    params.channel === "newsletter" ? "newsletter signups" : "consult requests";
  return sendToRecipients({
    to: params.to,
    subject: `Test ${kind} email from ${site.shortName}`,
    html: `
      <p>This is a test from the ${site.name} admin settings.</p>
      <p>If you received this, ${kind} will be delivered to this address.</p>
    `,
  });
}

export async function sendPasswordResetEmail(params: {
  to: string;
  token: string;
}) {
  const link = `${appUrl()}/admin/reset-password?token=${params.token}`;
  const resend = getResend();

  await resend.emails.send({
    from: fromAddress(),
    to: params.to,
    subject: `Reset your ${site.shortName} admin password`,
    html: `
      <p>We received a request to reset your admin password.</p>
      <p><a href="${link}">Reset password</a></p>
      <p>This link expires in 1 hour.</p>
      <p>If you did not request this, you can ignore this email.</p>
    `,
  });
}
