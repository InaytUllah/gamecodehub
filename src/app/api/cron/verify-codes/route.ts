import { NextRequest, NextResponse } from "next/server";
import { VerificationEngine } from "@/lib/verification/engine";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
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
