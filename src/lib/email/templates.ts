export function renderLifecycleEmail(input: {
  title: string;
  message: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return `
    <div style="font-family: Arial, sans-serif; background: #f7f7f2; padding: 32px;">
      <div style="max-width: 640px; margin: 0 auto; background: #ffffff; border-radius: 20px; padding: 32px; border: 1px solid #d8e0d6;">
        <p style="font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase; color: #14532d; font-weight: 700;">TrustBridge</p>
        <h1 style="font-size: 28px; color: #15201b; margin-bottom: 16px;">${input.title}</h1>
        <p style="font-size: 16px; color: #475467; line-height: 1.7;">${input.message}</p>
        ${
          input.ctaHref && input.ctaLabel
            ? `<p style="margin-top: 24px;"><a href="${input.ctaHref}" style="display: inline-block; background: #14532d; color: #ffffff; text-decoration: none; padding: 12px 18px; border-radius: 999px; font-weight: 700;">${input.ctaLabel}</a></p>`
            : ""
        }
      </div>
    </div>
  `;
}
