"use client";

import { useEffect, useState } from "react";

interface CodeEntry {
  id: string;
  code: string;
  rewards: string;
  is_active: boolean;
  is_verified: boolean;
  game_id: string;
  discovered_at: string;
}

interface Game {
  id: string;
  slug: string;
  name: string;
}

export default function AdminCodesPage() {
  const [codes, setCodes] = useState<CodeEntry[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    game_id: "",
    code: "",
    rewards: "",
    source: "manual",
    region: "global",
    expires_at: "",
  });

  useEffect(() => {
    fetchCodes();
    fetchGames();
  }, []);

  const fetchCodes = async () => {
    try {
      const res = await fetch("/api/codes");
      const data = await res.json();
      setCodes(data.codes || []);
    } catch {
      // Handle error
    }
  };

  const fetchGames = async () => {
    try {
      const res = await fetch("/api/status");
      const data = await res.json();
      if (data.statuses) {
        setGames(data.statuses.map((s: { game: string; name: string; game_id?: string }) => ({
          id: s.game_id || s.game,
          slug: s.game,
          name: s.name,
        })));
      }
    } catch {
      // Handle error
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/codes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": process.env.NEXT_PUBLIC_ADMIN_SECRET || "admin",
        },
        body: JSON.stringify(form),
      });
      setShowForm(false);
      setForm({ game_id: "", code: "", rewards: "", source: "manual", region: "global", expires_at: "" });
      fetchCodes();
    } catch {
      // Handle error
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Codes</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          {showForm ? "Cancel" : "Add Code"}
        </button>
      </div>

      {showForm && (
        <div className="mb-8 rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            <select
              value={form.game_id}
              onChange={(e) => setForm({ ...form, game_id: e.target.value })}
              required
              className="rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select Game</option>
              {games.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
            <input
              type="text"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              placeholder="Code (e.g., GENSHINGIFT)"
              required
              className="rounded-lg border border-gray-300 px-3 py-2 font-mono dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
            <input
              type="text"
              value={form.rewards}
              onChange={(e) => setForm({ ...form, rewards: e.target.value })}
              placeholder="Rewards description"
              className="rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
            <select
              value={form.region}
              onChange={(e) => setForm({ ...form, region: e.target.value })}
              className="rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="global">Global</option>
              <option value="NA">North America</option>
              <option value="EU">Europe</option>
              <option value="SEA">Southeast Asia</option>
              <option value="BR">Brazil</option>
            </select>
            <input
              type="datetime-local"
              value={form.expires_at}
              onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
              className="rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
            <button
              type="submit"
              className="rounded-lg bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700"
            >
              Save Code
            </button>
          </form>
        </div>
      )}

      <div className="rounded-xl bg-white shadow-sm dark:bg-gray-800">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="px-4 py-3 font-medium text-gray-500">Code</th>
              <th className="px-4 py-3 font-medium text-gray-500">Rewards</th>
              <th className="px-4 py-3 font-medium text-gray-500">Status</th>
              <th className="px-4 py-3 font-medium text-gray-500">Added</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {codes.map((code) => (
              <tr key={code.id}>
                <td className="px-4 py-3 font-mono font-bold text-gray-900 dark:text-white">
                  {code.code}
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{code.rewards}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      code.is_active
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                    }`}
                  >
                    {code.is_active ? "Active" : "Expired"}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-400">
                  {new Date(code.discovered_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {codes.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                  No codes found. Add one above or run the scraper.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
