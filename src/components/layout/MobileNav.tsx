"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { GAMES } from "@/lib/constants";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  const t = useTranslations("common");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-72 bg-white p-6 shadow-xl dark:bg-gray-900">
        <div className="mb-8 flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            {t("siteName")}
          </span>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-col gap-2">
          <Link
            href="/"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            {t("home")}
          </Link>
          <div className="my-2 border-t border-gray-200 dark:border-gray-700" />
          <p className="px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            {t("allGames")}
          </p>
          {GAMES.map((game) => (
            <Link
              key={game.slug}
              href={`/${game.slug}`}
              onClick={onClose}
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              {game.name}
            </Link>
          ))}
          <div className="my-2 border-t border-gray-200 dark:border-gray-700" />
          <Link
            href="/about"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            {t("about")}
          </Link>
          <Link
            href="/contact"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            {t("contact")}
          </Link>
        </nav>
      </div>
    </div>
  );
}
