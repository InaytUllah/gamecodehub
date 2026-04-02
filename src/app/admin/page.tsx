"use client";

import { useEffect, useState } from "react";

interface Stats {
  totalCodes: number;
  activeCodes: number;
  totalGames: number;
  subscribers: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ totalCodes: 0, activeCodes: 0, totalGames: 0, subscribers: 0 });

  useEffect(() => {
    // In production, fetch from API
    setStats({ totalCodes: 12, activeCodes: 8, totalGames: 5, subscribers: 0 });
  }, []);

  const cards = [
    { label: "Total Codes", value: stats.totalCodes, color: "bg-blue-500" },
    { label: "Active Codes", value: stats.activeCodes, color: "bg-green-500" },
    { label: "Games", value: stats.totalGames, color: "bg-purple-500" },
    { label: "Subscribers", value: stats.subscribers, color: "bg-orange-500" },
  ];

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
            <div className={`mb-3 inline-flex rounded-lg p-2 ${card.color}`}>
              <span className="text-white text-sm font-medium">{card.label.charAt(0)}</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{card.value}</p>
            <p className="mt-1 text-sm text-gray-500">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">Quick Actions</h2>
        <div className="flex gap-4">
          <a
            href="/admin/codes"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Add New Code
          </a>
          <a
            href="/api/cron/scrape-codes"
            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
          >
            Run Scraper
          </a>
        </div>
      </div>
    </div>
  );
}
