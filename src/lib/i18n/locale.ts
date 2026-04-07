import "server-only";

import { cookies } from "next/headers";

import { appConfig, type AppLocale } from "@/config/app";
import { LOCALE_COOKIE_NAME } from "@/config/i18n";

export async function getCurrentLocale(): Promise<AppLocale> {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE_NAME)?.value;

  if (cookieLocale && appConfig.locales.includes(cookieLocale as AppLocale)) {
    return cookieLocale as AppLocale;
  }

  return appConfig.defaultLocale;
}
