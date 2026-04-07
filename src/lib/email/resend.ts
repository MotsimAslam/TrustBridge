import "server-only";

import { Resend } from "resend";

let resendClient: Resend | null = null;

export function getResend() {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }

  resendClient ??= new Resend(process.env.RESEND_API_KEY);
  return resendClient;
}

export async function sendLifecycleEmail(input: {
  to: string;
  subject: string;
  html: string;
}) {
  const resend = getResend();

  if (!resend || !process.env.EMAIL_FROM) {
    return { skipped: true };
  }

  return resend.emails.send({
    from: process.env.EMAIL_FROM,
    to: input.to,
    subject: input.subject,
    html: input.html,
  });
}
