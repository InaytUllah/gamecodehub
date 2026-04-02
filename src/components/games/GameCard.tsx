import { Link } from "@/i18n/navigation";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";

interface GameCardProps {
  slug: string;
  name: string;
  color: string;
  activeCodesCount: number;
  status: "online" | "maintenance" | "issues" | "offline";
}

export function GameCard({ slug, name, color, activeCodesCount, status }: GameCardProps) {
  return (
    <Link href={`/${slug}`}>
      <Card hover className="group relative overflow-hidden">
        <div
          className="absolute inset-x-0 top-0 h-1"
          style={{ backgroundColor: color }}
        />
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
              {name}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {activeCodesCount} active codes
            </p>
          </div>
          <Badge variant={status === "online" ? "success" : status === "maintenance" ? "warning" : "danger"}>
            {status === "online" ? "Online" : status === "maintenance" ? "Maint." : "Down"}
          </Badge>
        </div>
        <div className="mt-4 text-sm font-medium text-blue-600 dark:text-blue-400">
          View Codes →
        </div>
      </Card>
    </Link>
  );
}
