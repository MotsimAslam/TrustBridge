export const appConfig = {
  name: "TrustBridge",
  description:
    "A secure charity verification platform connecting donors, beneficiaries, and administrators through trusted workflows.",
  locales: ["en", "ur"] as const,
  defaultLocale: "en" as const,
  roles: ["DONOR", "BENEFICIARY", "ADMIN"] as const,
};

export type AppLocale = (typeof appConfig.locales)[number];
export type AppRole = (typeof appConfig.roles)[number];
