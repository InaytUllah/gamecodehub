"use client";

import { GAMES } from "@/lib/constants";

export default function AdminGamesPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Manage Games</h1>

      <div className="rounded-xl bg-white shadow-sm dark:bg-gray-800">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="px-4 py-3 font-medium text-gray-500">Game</th>
              <th className="px-4 py-3 font-medium text-gray-500">Slug</th>
              <th className="px-4 py-3 font-medium text-gray-500">Redeem URL</th>
              <th className="px-4 py-3 font-medium text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {GAMES.map((game) => (
              <tr key={game.slug}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: game.color }}
                    />
                    <span className="font-medium text-gray-900 dark:text-white">{game.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-gray-600 dark:text-gray-400">
                  {game.slug}
                </td>
                <td className="px-4 py-3">
                  <a
                    href={game.redeemUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    {game.redeemUrl.replace("https://", "").slice(0, 30)}...
                  </a>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    Active
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
