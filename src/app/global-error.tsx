"use client";

import { useEffect } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html>
      <body className="flex min-h-screen items-center justify-center bg-muted/30 px-6">
        <Card className="max-w-xl">
          <CardContent className="space-y-6 px-8 py-10">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
                Something went wrong
              </p>
              <h1 className="text-3xl font-semibold tracking-tight">TrustBridge hit an unexpected error.</h1>
              <p className="text-sm text-muted-foreground">
                Sentry is initialized for production reporting. In local development, the error is also logged in the console.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={reset}>Try again</Button>
              <Button variant="outline" asChild>
                <Link href="/">Go home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </body>
    </html>
  );
}
