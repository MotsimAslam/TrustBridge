import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-6">
      <Card className="max-w-xl">
        <CardContent className="space-y-6 px-8 py-10 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">Access forbidden</h1>
          <p className="text-sm text-muted-foreground">
            Your account is authenticated, but it does not have permission to open this route.
          </p>
          <div className="flex justify-center gap-3">
            <Button variant="outline" asChild>
              <Link href="/">Go home</Link>
            </Button>
            <Button asChild>
              <Link href="/app">Open app</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
