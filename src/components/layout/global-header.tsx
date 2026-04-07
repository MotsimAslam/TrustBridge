import Link from "next/link";

import type { AppLocale } from "@/config/app";
import { AppLogo } from "@/components/layout/app-logo";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";

export function GlobalHeader({
  locale,
  authenticated,
}: {
  locale: AppLocale;
  authenticated: boolean;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-border/80 bg-background/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <AppLogo />
        <nav className="hidden items-center gap-8 md:flex">
          <Link href="/#how-it-works" className="text-sm text-muted-foreground transition hover:text-foreground">
            How it works
          </Link>
          <Link href="/#trust-features" className="text-sm text-muted-foreground transition hover:text-foreground">
            Trust features
          </Link>
          <Link href="/campaigns" className="text-sm text-muted-foreground transition hover:text-foreground">
            Campaigns
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <LocaleSwitcher locale={locale} />
          <ThemeToggle />
          {authenticated ? (
            <Button asChild>
              <Link href="/app">Open app</Link>
            </Button>
          ) : (
            <>
              <Button variant="outline" asChild className="hidden sm:inline-flex">
                <Link href="/sign-in">Sign in</Link>
              </Button>
              <Button asChild>
                <Link href="/sign-up">Create account</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
