import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Placeholder for server status checking
  // In production, this would ping game servers or check official status pages
  return NextResponse.json({
    message: "Status check completed",
    timestamp: new Date().toISOString(),
  });
}
