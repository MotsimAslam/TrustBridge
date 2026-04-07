import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-6">
      <Card className="max-w-xl">
        <CardContent className="space-y-6 px-8 py-10 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">Sign in required</h1>
          <p className="text-sm text-muted-foreground">
            This part of TrustBridge is protected. Sign in to continue into the correct role-based workspace.
          </p>
          <Button asChild>
            <Link href="/sign-in">Go to sign in</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
