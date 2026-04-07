import { SignUp } from "@clerk/nextjs";

import { AuthShell } from "@/components/shared/auth-shell";

export default function SignUpPage() {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
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
