import { NextRequest, NextResponse } from "next/server";
import { CommunityReporter } from "@/lib/verification/community";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { codeId, result } = body;

  if (!codeId || !["working", "expired"].includes(result)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Get IP from headers
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0] ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const reporter = new CommunityReporter();
  const response = await reporter.report(codeId, result, ip);

  if (!response.success) {
    return NextResponse.json({ error: response.error }, { status: 429 });
  }

  return NextResponse.json({ success: true });
}
