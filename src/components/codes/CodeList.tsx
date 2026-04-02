import { CodeCard } from "./CodeCard";
import type { Code } from "@/types/database";

interface CodeListProps {
  codes: Code[];
  gameSlug: string;
  emptyMessage?: string;
}

export function CodeList({ codes, gameSlug, emptyMessage = "No active codes right now." }: CodeListProps) {
  if (codes.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center dark:border-gray-600">
        <p className="text-gray-500 dark:text-gray-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {codes.map((code) => (
        <CodeCard key={code.id} code={code} gameSlug={gameSlug} />
      ))}
    </div>
  );
}
