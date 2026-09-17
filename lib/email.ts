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

async function sendToRecipients(params: {
  to: string[];
  subject: string;
  html: string;
  replyTo?: string;
}) {
  if (params.to.length === 0) {
    throw new Error("No notification recipients are configured.");
  }
  const resend = getResend();
  const { error } = await resend.emails.send({
    from: fromAddress(),
    to: params.to,
    replyTo: params.replyTo,
    subject: params.subject,
    html: params.html,
  });
  if (error) {
    throw new Error(error.message);
  }
}

export async function sendContactRequestEmail(params: {
  to: string[];
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  message: string;
}) {
  const name = `${params.firstName} ${params.lastName}`.trim();
  await sendToRecipients({
    to: params.to,
    replyTo: params.email,
    subject: `New consult request from ${name}`,
    html: `
      <p>A visitor submitted the contact form on ${site.name}.</p>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(params.email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(params.phone)}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(params.message).replaceAll("\n", "<br />")}</p>
    `,
  });
}

export async function sendNewsletterSignupEmail(params: {
  to: string[];
  firstName?: string;
  lastName?: string;
  email: string;
}) {
  const name = `${params.firstName ?? ""} ${params.lastName ?? ""}`.trim();
  await sendToRecipients({
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
