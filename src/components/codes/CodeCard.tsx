import { Badge } from "../ui/Badge";
import { CopyButton } from "../ui/CopyButton";
import { Countdown } from "../ui/Countdown";
import { VerificationBadge } from "./VerificationBadge";
import { CommunityReport } from "./CommunityReport";
import { formatRelativeTime } from "@/lib/utils/date";
import type { Code } from "@/types/database";

interface CodeCardProps {
  code: Code;
  gameSlug: string;
}

export function CodeCard({ code, gameSlug }: CodeCardProps) {
  const isNew = Date.now() - new Date(code.discovered_at).getTime() < 86400000;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <Badge variant={code.is_active ? "success" : "danger"}>
          {code.is_active ? "ACTIVE" : "EXPIRED"}
        </Badge>
        <VerificationBadge
          lastVerifiedAt={code.last_verified_at || null}
          failCount={code.fail_count || 0}
          method={code.verification_method}
        />
        {isNew && code.is_active && <Badge variant="new">NEW</Badge>}
        {code.region !== "global" && (
          <Badge variant="default">{code.region.toUpperCase()}</Badge>
        )}
      </div>

      <div className="flex items-center justify-between gap-4">
        <code className="text-xl font-bold tracking-wider text-gray-900 dark:text-white sm:text-2xl">
          {code.code}
        </code>
        <CopyButton text={code.code} gameSlug={gameSlug} />
      </div>

      {code.rewards && (
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
          <span className="mr-1">🎁</span> {code.rewards}
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-gray-400">
        {code.expires_at && <Countdown expiresAt={code.expires_at} />}
        <span>Added {formatRelativeTime(code.discovered_at)}</span>
        {code.verification_method && (
          <span>
            Checked via: {formatMethod(code.verification_method)}
          </span>
        )}
      </div>

      {code.is_active && (
        <div className="mt-3 border-t border-gray-100 pt-3 dark:border-gray-700">
          <CommunityReport
            codeId={code.id}
            reportedWorking={code.reported_working || 0}
            reportedExpired={code.reported_expired || 0}
          />
        </div>
      )}
    </div>
  );
}

// Code interface already has verification fields

function formatMethod(method?: string | null): string {
  const labels: Record<string, string> = {
    api_status: "API Check",
    api_redeem: "API Redemption",
    scraper_cross_check: "Cross-Check",
    community_report: "Community",
    manual_test: "Manual Test",
  };
  return labels[method || ""] || method || "";
}
