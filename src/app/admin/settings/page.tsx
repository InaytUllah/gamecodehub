"use client";

export default function AdminSettingsPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>

      <div className="space-y-6">
        <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
          <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">Ad Placements</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Configure Google AdSense ad placements. Set your AdSense client ID in the
            environment variable <code className="text-blue-600">NEXT_PUBLIC_ADSENSE_CLIENT_ID</code>.
          </p>
          <div className="mt-4 space-y-3">
            {["header_banner", "sidebar", "in_content", "footer", "between_codes"].map((slot) => (
              <div
                key={slot}
                className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3 dark:border-gray-700"
              >
                <span className="font-mono text-sm text-gray-700 dark:text-gray-300">{slot}</span>
                <span className="text-xs text-gray-400">Placeholder</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
          <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">Cron Jobs</h2>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <p><strong>Scrape Codes:</strong> Every 2 hours</p>
            <p><strong>Check Expired:</strong> Every 6 hours</p>
            <p><strong>Check Status:</strong> Every 15 minutes</p>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
          <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">Environment</h2>
          <div className="space-y-2 text-sm">
            <p className="text-gray-600 dark:text-gray-300">
              <strong>Supabase:</strong>{" "}
              <span className={process.env.NEXT_PUBLIC_SUPABASE_URL ? "text-green-500" : "text-red-500"}>
                {process.env.NEXT_PUBLIC_SUPABASE_URL ? "Connected" : "Not configured"}
              </span>
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              <strong>Analytics:</strong>{" "}
              <span className={process.env.NEXT_PUBLIC_GA_ID ? "text-green-500" : "text-yellow-500"}>
                {process.env.NEXT_PUBLIC_GA_ID ? "Configured" : "Not set"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
