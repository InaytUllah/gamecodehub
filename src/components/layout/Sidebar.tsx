import { NewsletterForm } from "../ads/NewsletterForm";

export function Sidebar() {
  return (
    <aside className="hidden w-80 shrink-0 lg:block">
      <div className="sticky top-20 space-y-6">
        <NewsletterForm />
        {/* AdSense sidebar slot */}
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-center text-xs text-gray-400 dark:border-gray-700 dark:bg-gray-800">
          Advertisement
        </div>
      </div>
    </aside>
  );
}
