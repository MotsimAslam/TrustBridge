"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { appConfig, type AppLocale } from "@/config/app";
import { LOCALE_COOKIE_NAME } from "@/config/i18n";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function LocaleSwitcher({ locale }: { locale: AppLocale }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Select
      defaultValue={locale}
      onValueChange={(value) => {
        document.cookie = `${LOCALE_COOKIE_NAME}=${value}; path=/; max-age=31536000; samesite=lax`;
        startTransition(() => router.refresh());
      }}
      disabled={isPending}
    >
      <SelectTrigger className="w-[120px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {appConfig.locales.map((item) => (
          <SelectItem key={item} value={item}>
            {item === "en" ? "English" : "اردو"}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
