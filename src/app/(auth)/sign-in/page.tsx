import Link from "next/link";
import { SignIn } from "@clerk/nextjs";

import { AuthShell } from "@/components/shared/auth-shell";
import { Button } from "@/components/ui/button";
import { isClerkConfigured, isProductionClerkMisconfigured } from "@/lib/auth/clerk-config";

export default function SignInPage() {
  if (!isClerkConfigured()) {
    return (
      <AuthShell
        title="Connect your team"
        description="Add Clerk keys in .env.local to enable sign-in, verification, and recovery flows."
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Clerk is not configured yet. Copy the example environment values into your local setup and restart the server.
          </p>
          <Button asChild>
            <Link href="/internal/status">Open internal status</Link>
          </Button>
        </div>
      </AuthShell>
    );
  }

  if (isProductionClerkMisconfigured()) {
    return (
      <AuthShell
        title="Authentication setup required"
        description="TrustBridge is running in production with Clerk test keys, so the hosted sign-in experience cannot load safely."
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Replace the current Clerk environment values with your production instance keys (`pk_live_` and `sk_live_`) and confirm the Vercel domain is added in Clerk before testing sign-in again.
          </p>
          <Button asChild>
            <Link href="/internal/status">Open internal status</Link>
          </Button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Welcome back"
      description="Sign in to continue into your TrustBridge workspace."
    >
      <SignIn
        path="/sign-in"
        routing="path"
        signUpUrl="/sign-up"
        forceRedirectUrl="/app"
        appearance={{
          elements: {
            card: "shadow-none border-0 p-0",
            rootBox: "w-full",
          },
        }}
      />
      <p className="mt-6 text-sm text-muted-foreground">
        Need help with your password? Use the reset flow inside Clerk or open the{" "}
        <Link href="/forgot-password" className="font-medium text-primary">
          recovery guide
        </Link>
        .
      </p>
    </AuthShell>
  );
}
