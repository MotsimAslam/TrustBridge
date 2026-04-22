import { SignUp } from "@clerk/nextjs";

import { AuthShell } from "@/components/shared/auth-shell";
import { isClerkConfigured, isProductionClerkMisconfigured } from "@/lib/auth/clerk-config";

export default function SignUpPage() {
  if (!isClerkConfigured()) {
    return (
      <AuthShell
        title="Create your workspace"
        description="Configure Clerk keys to enable sign-up and email verification."
      >
        <p className="text-sm text-muted-foreground">
          Clerk is not configured yet. Once keys are available, this page will guide users through sign-up and email verification.
        </p>
      </AuthShell>
    );
  }

  if (isProductionClerkMisconfigured()) {
    return (
      <AuthShell
        title="Authentication setup required"
        description="TrustBridge is running in production with Clerk test keys, so secure sign-up is temporarily disabled."
      >
        <p className="text-sm text-muted-foreground">
          Update Vercel to use your Clerk production instance keys and confirm the production domain inside Clerk before opening registration to real users.
        </p>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Create your TrustBridge account"
      description="Secure sign-up, email verification, and role-based onboarding start here."
    >
      <SignUp
        path="/sign-up"
        routing="path"
        signInUrl="/sign-in"
        forceRedirectUrl="/app/select-role"
        appearance={{
          elements: {
            card: "shadow-none border-0 p-0",
            rootBox: "w-full",
          },
        }}
      />
    </AuthShell>
  );
}
