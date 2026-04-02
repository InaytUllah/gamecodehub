import { createAdminClient } from "@/lib/supabase/admin";
import { createHash } from "crypto";

export class CommunityReporter {
  private supabase = createAdminClient();

  async report(
    codeId: string,
    result: "working" | "expired",
    ipAddress: string
  ): Promise<{ success: boolean; error?: string }> {
    const ipHash = this.hashIP(ipAddress);

    // Rate limit: 1 report per code per IP per 24h
    const { data: existing } = await this.supabase
      .from("code_verifications")
      .select("id")
      .eq("code_id", codeId)
      .eq("ip_hash", ipHash)
      .eq("method", "community_report")
      .gte("verified_at", new Date(Date.now() - 86400000).toISOString())
      .limit(1);

    if (existing && existing.length > 0) {
      return { success: false, error: "Already reported in the last 24 hours" };
    }

    // Insert verification log
    await this.supabase.from("code_verifications").insert({
      code_id: codeId,
      method: "community_report",
      result,
      ip_hash: ipHash,
    });

    // Update code counters
    if (result === "working") {
      const { data: code } = await this.supabase
        .from("codes")
        .select("reported_working")
        .eq("id", codeId)
        .single();

      await this.supabase
        .from("codes")
        .update({ reported_working: (code?.reported_working || 0) + 1 })
        .eq("id", codeId);
    } else {
      const { data: code } = await this.supabase
        .from("codes")
        .select("reported_expired, reported_working")
        .eq("id", codeId)
        .single();

      const newExpired = (code?.reported_expired || 0) + 1;
      const totalReports = newExpired + (code?.reported_working || 0);

      const updates: Record<string, unknown> = {
        reported_expired: newExpired,
      };

      // Auto-expire if >10 reports and >70% say expired
      if (totalReports > 10 && newExpired / totalReports > 0.7) {
        updates.is_active = false;
      }

      await this.supabase.from("codes").update(updates).eq("id", codeId);
    }

    return { success: true };
  }

  private hashIP(ip: string): string {
    return createHash("sha256").update(ip + "gamecodehub_salt").digest("hex").slice(0, 16);
  }
}
