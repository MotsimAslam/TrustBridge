import type { Metadata } from "next";

import "@/app/globals.css";

import { AppProviders } from "@/components/providers/app-providers";
import { appConfig } from "@/config/app";
import { getCurrentLocale } from "@/lib/i18n/locale";
import { getMessages } from "@/lib/i18n/messages";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: {
    default: appConfig.name,
    template: `%s | ${appConfig.name}`,
  },
  description: appConfig.description,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getCurrentLocale();
  const messages = await getMessages(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <AppProviders locale={locale} messages={messages}>
          <div>{children}</div>
        </AppProviders>
      </body>
    </html>
  );
}
