"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

interface GameNavProps {
  gameSlug: string;
}

export function GameNav({ gameSlug }: GameNavProps) {
  const t = useTranslations("common");
  const pathname = usePathname();

  const links = [
    { href: `/${gameSlug}`, label: "Overview" },
    { href: `/${gameSlug}/codes`, label: t("codes") },
    { href: `/${gameSlug}/server-status`, label: t("serverStatus") },
    { href: `/${gameSlug}/banners`, label: t("banners") },
  ];

  return (
    <nav className="flex gap-1 overflow-x-auto border-b border-gray-200 dark:border-gray-700">
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              isActive
                ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
