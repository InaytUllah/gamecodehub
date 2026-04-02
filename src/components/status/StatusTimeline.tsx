import type { ServerStatus } from "@/types/database";
import { formatDate } from "@/lib/utils/date";

interface StatusTimelineProps {
  history: ServerStatus[];
}

const statusColors = {
  online: "bg-green-500",
  maintenance: "bg-yellow-500",
  issues: "bg-orange-500",
  offline: "bg-red-500",
};

export function StatusTimeline({ history }: StatusTimelineProps) {
  if (history.length === 0) {
    return (
      <p className="text-sm text-gray-500 dark:text-gray-400">
        No issues reported in the last 7 days.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {history.map((entry) => (
        <div key={entry.id} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className={`h-3 w-3 rounded-full ${statusColors[entry.status]}`} />
            <div className="w-px flex-1 bg-gray-200 dark:bg-gray-700" />
          </div>
          <div className="pb-4">
            <p className="font-medium text-gray-900 dark:text-white capitalize">
              {entry.status}
            </p>
            {entry.message && (
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{entry.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-400">
              {formatDate(entry.created_at)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
