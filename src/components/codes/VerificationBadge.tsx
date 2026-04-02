"use client";

import { getVerificationBadge } from "@/lib/verification/freshness";

interface VerificationBadgeProps {
  lastVerifiedAt: string | null;
  failCount: number;
  method?: string | null;
}

const colorMap = {
  green: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  amber: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  red: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  gray: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400",
};

const methodLabels: Record<string, string> = {
  api_status: "API Check",
  api_redeem: "API Redemption Test",
  scraper_cross_check: "Cross-Check",
  community_report: "Community Report",
  manual_test: "Manual Test",
};

export function VerificationBadge({ lastVerifiedAt, failCount, method }: VerificationBadgeProps) {
  const badge = getVerificationBadge(lastVerifiedAt, failCount);

  return (
    <span
      className={`group relative inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${colorMap[badge.color]}`}
    >
      {badge.pulse && (
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
        </span>
      )}
      {!badge.pulse && badge.color !== "gray" && (
        <span className={`h-1.5 w-1.5 rounded-full ${
          badge.color === "green" ? "bg-green-500" : badge.color === "amber" ? "bg-amber-500" : "bg-red-500"
        }`} />
      )}
      {badge.text}

      {method && (
        <span className="pointer-events-none absolute -top-8 left-1/2 z-50 hidden -translate-x-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white shadow-lg group-hover:block dark:bg-gray-700">
          {methodLabels[method] || method}
        </span>
      )}
    </span>
  );
}
