import { NextRequest, NextResponse } from "next/server";
import { verifyCronAuth } from "@/lib/utils/cron-auth";
import { VerificationEngine } from "@/lib/verification/engine";

export const maxDuration = 60; // Allow up to 60s for verification

export async function GET(request: NextRequest) {
  if (!verifyCronAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const engine = new VerificationEngine();
  const results = await engine.runVerificationCycle();

  const summary = {
    total: results.length,
    working: results.filter((r) => r.result === "working").length,
    expired: results.filter((r) => r.result === "expired").length,
    unknown: results.filter((r) => r.result === "unknown").length,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(summary);
}
