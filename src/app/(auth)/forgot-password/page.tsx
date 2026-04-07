import Link from "next/link";

import { AuthShell } from "@/components/shared/auth-shell";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Password recovery"
      description="Clerk handles the secure reset flow, including identity checks and email delivery."
    >
      <div className="space-y-4 text-sm text-muted-foreground">
        <p>
          Open the sign-in form and choose <span className="font-medium text-foreground">Forgot password?</span> to start the secure recovery flow.
        </p>
        <p>
          The dedicated route exists so TrustBridge can support branded recovery messaging and future support workflows without changing URLs.
        </p>
        <Button asChild>
          <Link href="/sign-in">Go to sign in</Link>
        </Button>
      </div>
    </AuthShell>
  );
}
