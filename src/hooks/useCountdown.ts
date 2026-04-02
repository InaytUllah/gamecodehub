"use client";

import { useState, useEffect } from "react";
import { getTimeRemaining } from "@/lib/utils/date";

export function useCountdown(expiresAt: string | null) {
  const [timeLeft, setTimeLeft] = useState(() =>
    expiresAt
      ? getTimeRemaining(expiresAt)
      : { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true }
  );

  useEffect(() => {
    if (!expiresAt) return;

    const interval = setInterval(() => {
      setTimeLeft(getTimeRemaining(expiresAt));
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  return timeLeft;
}
