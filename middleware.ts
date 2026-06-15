// middleware.ts
import { clerkMiddleware } from "@clerk/nextjs/server";

// Auth is enforced per-route via auth() in API handlers and Clerk components on pages.
// Do not rely on this middleware alone for route protection.
export default clerkMiddleware();

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/"],
};
