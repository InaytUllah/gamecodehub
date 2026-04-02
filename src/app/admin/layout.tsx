"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    const token = sessionStorage.getItem("admin_token");
    if (token) setAuthenticated(true);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple client-side auth - in production use proper auth
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || password === "admin") {
      sessionStorage.setItem("admin_token", "authenticated");
      setAuthenticated(true);
      setError("");
    } else {
      setError("Invalid password");
    }
  };

  if (!authenticated) {
    return (
      <html lang="en">
        <body className="min-h-screen bg-gray-100 dark:bg-gray-950">
          <div className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-sm rounded-xl bg-white p-8 shadow-lg dark:bg-gray-800">
              <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Admin Login</h1>
              <form onSubmit={handleLogin}>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="mb-4 w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
                {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
                <button
                  type="submit"
                  className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
                >
                  Login
                </button>
              </form>
            </div>
          </div>
        </body>
      </html>
    );
  }

  const navItems = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/codes", label: "Codes" },
    { href: "/admin/games", label: "Games" },
    { href: "/admin/settings", label: "Settings" },
  ];

  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100 dark:bg-gray-950">
        <div className="flex min-h-screen">
          <aside className="w-64 border-r border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
            <h1 className="mb-8 text-xl font-bold text-gray-900 dark:text-white">
              GCH Admin
            </h1>
            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-lg px-4 py-2 text-sm font-medium ${
                    pathname === item.href
                      ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                      : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <button
              onClick={() => {
                sessionStorage.removeItem("admin_token");
                setAuthenticated(false);
              }}
              className="mt-8 text-sm text-gray-400 hover:text-red-500"
            >
              Logout
            </button>
          </aside>
          <main className="flex-1 p-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
