import Link from "next/link";
import { SignIn } from "@clerk/nextjs";

import { AuthShell } from "@/components/shared/auth-shell";
import { Button } from "@/components/ui/button";

export default function SignInPage() {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
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
