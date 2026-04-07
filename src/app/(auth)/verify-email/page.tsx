import Link from "next/link";

import { AuthShell } from "@/components/shared/auth-shell";
import { Button } from "@/components/ui/button";

export default function VerifyEmailPage() {
  return (
    <AuthShell
      title="Verify your email"
      description="Email verification is required before sensitive workflows become available."
    >
      <div className="space-y-4 text-sm text-muted-foreground">
        <p>
          After sign-up, Clerk sends the verification challenge and keeps the token validation secure. This route provides a stable branded location for the verification step.
        </p>
        <Button asChild>
          <Link href="/sign-up">Return to sign up</Link>
        </Button>
      </div>
    </AuthShell>
  );
}
