"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "../ui/Button";

export function NewsletterForm() {
  const t = useTranslations("newsletter");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-blue-50 to-purple-50 p-6 dark:border-gray-700 dark:from-blue-900/20 dark:to-purple-900/20">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
        {t("title")}
      </h3>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
        {t("subtitle")}
      </p>
      {status === "success" ? (
        <p className="mt-4 text-sm font-medium text-green-600 dark:text-green-400">
          {t("success")}
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("placeholder")}
            required
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
          <Button type="submit" disabled={status === "loading"} size="sm">
            {t("subscribe")}
          </Button>
        </form>
      )}
    </div>
  );
}
