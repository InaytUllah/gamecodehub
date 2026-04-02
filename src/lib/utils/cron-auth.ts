import { NextRequest } from "next/server";

export function verifyCronAuth(request: NextRequest): boolean {
  // Vercel Cron sends Authorization: Bearer <CRON_SECRET>
  const authHeader = request.headers.get("authorization");
  if (authHeader === `Bearer ${process.env.CRON_SECRET}`) return true;

  // Also accept x-cron-secret header for manual testing
  const cronSecret = request.headers.get("x-cron-secret");
  if (cronSecret === process.env.CRON_SECRET) return true;

  // In development, allow without auth
  if (process.env.NODE_ENV === "development") return true;

  return false;
}
