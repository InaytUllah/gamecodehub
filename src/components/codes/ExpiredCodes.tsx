"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { CodeCard } from "./CodeCard";
import type { Code } from "@/types/database";

interface ExpiredCodesProps {
  codes: Code[];
  gameSlug: string;
}

export function ExpiredCodes({ codes, gameSlug }: ExpiredCodesProps) {
  const t = useTranslations("common");
  const [expanded, setExpanded] = useState(false);

  if (codes.length === 0) return null;

  return (
    <div className="mt-8">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      >
        <svg
          className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
        {expanded ? t("hideExpired") : t("showExpired")} ({codes.length})
      </button>
      {expanded && (
        <div className="mt-4 space-y-4 opacity-60">
          {codes.map((code) => (
            <CodeCard key={code.id} code={code} gameSlug={gameSlug} />
          ))}
        </div>
      )}
    </div>
  );
}
