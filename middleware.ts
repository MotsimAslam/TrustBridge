import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/campaigns(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/forgot-password(.*)",
  "/verify-email(.*)",
  "/unauthorized(.*)",
  "/forbidden(.*)",
  "/internal/status(.*)",
  "/api/health(.*)",
]);

const isProtectedAppRoute = createRouteMatcher(["/app(.*)"]);
const isAdminRoute = createRouteMatcher(["/app/admin(.*)"]);
const isBeneficiaryRoute = createRouteMatcher(["/app/beneficiary(.*)"]);
const isDonorRoute = createRouteMatcher(["/app/donor(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  if (isPublicRoute(request)) {
    return NextResponse.next();
  }

  const { userId, sessionClaims, redirectToSignIn } = await auth();

  if (isProtectedAppRoute(request) && !userId) {
    return redirectToSignIn({ returnBackUrl: request.url });
  }

  if (!userId) {
    return NextResponse.next();
  }

  const metadata = (sessionClaims?.metadata ?? sessionClaims?.publicMetadata ?? {}) as {
    role?: string;
  };
  const role = metadata.role;

  if (isAdminRoute(request) && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/forbidden", request.url));
  }

  if (isBeneficiaryRoute(request) && role !== "BENEFICIARY") {
    return NextResponse.redirect(new URL("/forbidden", request.url));
  }

  if (isDonorRoute(request) && role !== "DONOR") {
    return NextResponse.redirect(new URL("/forbidden", request.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)", "/(api|trpc)(.*)"],
};
