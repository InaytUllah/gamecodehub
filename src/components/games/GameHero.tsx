import { Badge } from "../ui/Badge";

interface GameHeroProps {
  name: string;
  description: string;
  color: string;
  status: "online" | "maintenance" | "issues" | "offline";
  activeCodesCount: number;
}

export function GameHero({ name, description, color, status, activeCodesCount }: GameHeroProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl p-8" style={{ backgroundColor: color + "15" }}>
      <div
        className="absolute inset-x-0 top-0 h-1"
        style={{ backgroundColor: color }}
      />
      <div className="relative">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{name}</h1>
          <Badge variant={status === "online" ? "success" : "warning"}>
            {status === "online" ? "Servers Online" : "Maintenance"}
          </Badge>
        </div>
        <p className="mt-2 max-w-2xl text-gray-600 dark:text-gray-300">{description}</p>
        <div className="mt-4 flex items-center gap-4 text-sm">
          <span className="font-semibold text-gray-900 dark:text-white">
            {activeCodesCount} active codes
          </span>
        </div>
      </div>
    </div>
  );
}
