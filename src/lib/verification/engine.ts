import { createAdminClient } from "@/lib/supabase/admin";
import { HoyoVerifier } from "./hoyo-verifier";
import { CrossChecker } from "./cross-check";

export interface VerificationResult {
  codeId: string;
  result: "working" | "expired" | "invalid" | "region_locked" | "unknown";
  method: string;
  source?: string;
  responseData?: Record<string, unknown>;
}

interface CodeToVerify {
  id: string;
  code: string;
  game_slug: string;
  discovered_at: string;
  last_verified_at: string | null;
  fail_count: number;
  expires_at: string | null;
  reported_expired: number;
}

export class VerificationEngine {
  private supabase = createAdminClient();

  async runVerificationCycle(): Promise<VerificationResult[]> {
    const codes = await this.getCodesByPriority();
    const results: VerificationResult[] = [];

    for (const code of codes) {
      try {
        const result = await this.verifyCode(code);
        if (result) {
          await this.recordResult(code.id, result);
          results.push(result);
        }
      } catch (error) {
        console.error(`Verification failed for ${code.code}:`, error);
      }
    }

    return results;
  }

  private async getCodesByPriority(): Promise<CodeToVerify[]> {
    const { data: codes } = await this.supabase
      .from("codes")
      .select("id, code, discovered_at, last_verified_at, fail_count, expires_at, reported_expired, games!inner(slug)")
      .eq("is_active", true)
      .order("discovered_at", { ascending: false })
      .limit(50);

    if (!codes) return [];

    // Map and sort by priority
    const mapped = codes.map((c) => ({
      id: c.id,
      code: c.code,
      game_slug: (c.games as unknown as { slug: string }).slug,
      discovered_at: c.discovered_at,
      last_verified_at: c.last_verified_at,
      fail_count: c.fail_count || 0,
      expires_at: c.expires_at,
      reported_expired: c.reported_expired || 0,
    }));

    return mapped.sort((a, b) => this.getPriority(a) - this.getPriority(b));
  }

  private getPriority(code: CodeToVerify): number {
    const ageMinutes = (Date.now() - new Date(code.discovered_at).getTime()) / 60000;
    const sinceVerified = code.last_verified_at
      ? (Date.now() - new Date(code.last_verified_at).getTime()) / 60000
      : Infinity;

    // Priority 1: New codes (< 1 hour)
    if (ageMinutes < 60) return 1;
    // Priority 2: Codes with community "No" reports
    if (code.reported_expired > 3) return 2;
    // Priority 3: Codes approaching expiry
    if (code.expires_at) {
      const expiryMins = (new Date(code.expires_at).getTime() - Date.now()) / 60000;
      if (expiryMins < 120 && expiryMins > 0) return 3;
    }
    // Priority 4: Not verified in 30+ mins
    if (sinceVerified > 30) return 4;
    // Priority 5: Everything else
    return 5;
  }

  private async verifyCode(code: CodeToVerify): Promise<VerificationResult | null> {
    // Method 1: HoYoverse API for Genshin/Honkai
    if (code.game_slug === "genshin-impact" || code.game_slug === "honkai-star-rail") {
      const verifier = new HoyoVerifier();
      const result = await verifier.verify(code.code, code.game_slug);
      if (result) return { ...result, codeId: code.id };
    }

    // Method 2: Cross-check across sources
    const crossChecker = new CrossChecker();
    const result = await crossChecker.verify(code.code, code.game_slug);
    if (result) return { ...result, codeId: code.id };

    return null;
  }

  private async recordResult(codeId: string, result: VerificationResult) {
    // Insert verification log
    await this.supabase.from("code_verifications").insert({
      code_id: codeId,
      method: result.method,
      result: result.result,
      source: result.source,
      response_data: result.responseData,
    });

    // Update code record
    if (result.result === "working") {
      await this.supabase
        .from("codes")
        .update({
          last_verified_at: new Date().toISOString(),
          verification_count: undefined, // Will use raw SQL increment
          verification_method: result.method,
          fail_count: 0,
        })
        .eq("id", codeId);

      // Increment verification_count
      await this.supabase.rpc("increment_verification_count", { code_id: codeId }).maybeSingle();
    } else if (result.result === "expired" || result.result === "invalid") {
      const { data: code } = await this.supabase
        .from("codes")
        .select("fail_count")
        .eq("id", codeId)
        .single();

      const newFailCount = (code?.fail_count || 0) + 1;

      await this.supabase
        .from("codes")
        .update({
          last_failed_at: new Date().toISOString(),
          fail_count: newFailCount,
          is_active: newFailCount >= 3 ? false : true,
          verification_method: result.method,
        })
        .eq("id", codeId);
    }
  }
}
