import { Badge } from "../ui/Badge";

interface StatusBadgeProps {
  status: "online" | "maintenance" | "issues" | "offline";
  size?: "sm" | "lg";
}

const statusConfig = {
  online: { variant: "success" as const, label: "Online", dot: "bg-green-500" },
  maintenance: { variant: "warning" as const, label: "Maintenance", dot: "bg-yellow-500" },
  issues: { variant: "danger" as const, label: "Issues", dot: "bg-orange-500" },
  offline: { variant: "danger" as const, label: "Offline", dot: "bg-red-500" },
};

export function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const config = statusConfig[status];

  if (size === "lg") {
    return (
      <div className="flex items-center gap-3">
        <div className={`h-4 w-4 rounded-full ${config.dot} animate-pulse`} />
        <span className="text-2xl font-bold text-gray-900 dark:text-white">
          {config.label}
        </span>
      </div>
    );
  }

  return (
    <Badge variant={config.variant}>
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </Badge>
  );
}
