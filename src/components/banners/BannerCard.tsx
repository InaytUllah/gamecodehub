import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Countdown } from "../ui/Countdown";
import type { Banner } from "@/types/database";

interface BannerCardProps {
  banner: Banner;
}

export function BannerCard({ banner }: BannerCardProps) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <Badge variant="info">{banner.banner_type}</Badge>
          <h3 className="mt-2 text-lg font-bold text-gray-900 dark:text-white">
            {banner.title}
          </h3>
        </div>
        {banner.ends_at && <Countdown expiresAt={banner.ends_at} />}
      </div>
      {banner.featured_items && banner.featured_items.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Featured Items
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {banner.featured_items.map((item, i) => (
              <Badge key={i} variant="default">
                {item.name}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
