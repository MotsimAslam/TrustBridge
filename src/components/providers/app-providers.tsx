"use client";

import * as React from "react";
import { NextIntlClientProvider } from "next-intl";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

import type { AppLocale } from "@/config/app";

import { ThemeProvider } from "./theme-provider";

function MaybeClerkProvider({ children }: { children: React.ReactNode }) {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return <>{children}</>;
  }

  return <ClerkProvider>{children}</ClerkProvider>;
}

export function AppProviders({
  children,
  locale,
  messages,
}: {
  children: React.ReactNode;
  locale: AppLocale;
  messages: Record<string, unknown>;
}) {
  return (
    <MaybeClerkProvider>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <ThemeProvider>
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </NextIntlClientProvider>
    </MaybeClerkProvider>
  );
}
