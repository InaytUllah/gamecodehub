"use client";

import { useState } from "react";

interface CommunityReportProps {
  codeId: string;
  reportedWorking: number;
  reportedExpired: number;
}

export function CommunityReport({ codeId, reportedWorking, reportedExpired }: CommunityReportProps) {
  const [working, setWorking] = useState(reportedWorking);
  const [expired, setExpired] = useState(reportedExpired);
  const [reported, setReported] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReport = async (result: "working" | "expired") => {
    if (reported || loading) return;
    setLoading(true);

    try {
      const res = await fetch("/api/codes/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codeId, result }),
      });

      if (res.ok) {
        setReported(true);
        if (result === "working") setWorking((w) => w + 1);
        else setExpired((e) => e + 1);
      }
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  };

  if (reported) {
    return (
      <p className="text-xs text-green-600 dark:text-green-400">Thanks for reporting!</p>
    );
  }

  return (
    <div className="flex items-center gap-3 text-xs">
      <span className="text-gray-500 dark:text-gray-400">Did this code work?</span>
      <button
        onClick={() => handleReport("working")}
        disabled={loading}
        className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/40"
      >
        <span>👍</span> Yes {working > 0 && `(${working})`}
      </button>
      <button
        onClick={() => handleReport("expired")}
        disabled={loading}
        className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-red-700 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40"
      >
        <span>👎</span> No {expired > 0 && `(${expired})`}
      </button>
    </div>
  );
}
