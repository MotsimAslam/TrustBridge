import "server-only";

import type { AppLocale } from "@/config/app";
import { appConfig } from "@/config/app";
import en from "@/messages/en.json";
import ur from "@/messages/ur.json";

const catalog = { en, ur } satisfies Record<AppLocale, typeof en>;

export async function getMessages(locale: AppLocale) {
  return catalog[locale] ?? catalog[appConfig.defaultLocale];
}
