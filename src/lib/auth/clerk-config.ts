export function isClerkConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
}

export function isProductionClerkMisconfigured() {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const isProductionRuntime =
    process.env.VERCEL_ENV === "production" ||
    (process.env.NODE_ENV === "production" &&
      (process.env.NEXT_PUBLIC_APP_URL?.startsWith("https://") ?? false));

  return Boolean(isProductionRuntime && publishableKey?.startsWith("pk_test_"));
}

export function getClerkStatusLabel() {
  if (!isClerkConfigured()) {
    return "Missing keys";
  }

  if (isProductionClerkMisconfigured()) {
    return "Using test keys in production";
  }

  return "Configured";
}
