"use client";

import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { trackCodeCopy } from "@/lib/utils/analytics";

interface CopyButtonProps {
  text: string;
  gameSlug?: string;
  className?: string;
}

export function CopyButton({ text, gameSlug, className = "" }: CopyButtonProps) {
  const { copied, copy } = useCopyToClipboard();

  const handleCopy = () => {
    copy(text);
    if (gameSlug) trackCodeCopy(gameSlug, text);
  };

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
        copied
          ? "bg-green-500 text-white"
          : "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
      } ${className}`}
      aria-label={copied ? "Copied!" : `Copy code ${text}`}
    >
      {copied ? (
        <>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          Copy
        </>
      )}
    </button>
  );
}
