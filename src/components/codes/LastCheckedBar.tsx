"use client";

import { useEffect, useState } from "react";
import { getVerificationBadge, getNextCheckTime } from "@/lib/verification/freshness";

interface LastCheckedBarProps {
  oldestVerifiedAt: string | null;
}

export function LastCheckedBar({ oldestVerifiedAt }: LastCheckedBarProps) {
  const [, setTick] = useState(0);

  // Re-render every minute to update relative times
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  if (!oldestVerifiedAt) return null;

  const badge = getVerificationBadge(oldestVerifiedAt, 0);
  const nextCheck = getNextCheckTime(oldestVerifiedAt);

  return (
    <div className="mb-6 flex flex-wrap items-center justify-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-2.5 text-sm dark:border-green-900/50 dark:bg-green-900/10">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
      </span>
      <span className="text-green-800 dark:text-green-300">
        All codes last verified: <strong>{badge.text.replace("Verified ", "")}</strong>
      </span>
      <span className="text-green-600 dark:text-green-500">|</span>
      <span className="text-green-600 dark:text-green-500">
        Next check in: <strong>{nextCheck}</strong>
      </span>
      <span className="text-green-600 dark:text-green-500">|</span>
      <span className="text-green-600 dark:text-green-500">
        Powered by real-time verification
      </span>
    </div>
  );
}
