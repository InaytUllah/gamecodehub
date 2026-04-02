"use client";

import { useCountdown } from "@/hooks/useCountdown";

interface CountdownProps {
  expiresAt: string | null;
  className?: string;
}

export function Countdown({ expiresAt, className = "" }: CountdownProps) {
  const { days, hours, minutes, isExpired } = useCountdown(expiresAt);

  if (!expiresAt || isExpired) return null;

  return (
    <span className={`inline-flex items-center gap-1 text-sm ${className}`}>
      <svg className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span className="text-orange-600 dark:text-orange-400">
        {days > 0 && `${days}d `}
        {hours}h {minutes}m
      </span>
    </span>
  );
}
