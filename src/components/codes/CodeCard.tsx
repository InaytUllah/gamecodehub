import { Badge } from "../ui/Badge";
import { CopyButton } from "../ui/CopyButton";
import { Countdown } from "../ui/Countdown";
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
        {code.is_verified && <Badge variant="info">Verified</Badge>}
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
        {code.expires_at && (
          <Countdown expiresAt={code.expires_at} />
        )}
        <span>Added {formatRelativeTime(code.discovered_at)}</span>
        {code.source && (
          <span className="capitalize">{code.source.replace("_", " ")}</span>
        )}
      </div>
    </div>
  );
}
