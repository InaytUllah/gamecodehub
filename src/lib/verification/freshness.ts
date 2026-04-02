export interface VerificationBadgeData {
  text: string;
  color: "green" | "amber" | "red" | "gray";
  pulse: boolean;
  method?: string;
}

export function getVerificationBadge(
  lastVerifiedAt: string | null,
  failCount: number
): VerificationBadgeData {
  if (failCount >= 3) {
    return { text: "Likely Expired", color: "red", pulse: false };
  }

  if (!lastVerifiedAt) {
    return { text: "Unverified", color: "gray", pulse: false };
  }

  const mins = Math.floor(
    (Date.now() - new Date(lastVerifiedAt).getTime()) / 60000
  );

  if (mins < 60) {
    return { text: `Verified ${mins}m ago`, color: "green", pulse: true };
  }
  if (mins < 360) {
    return {
      text: `Verified ${Math.floor(mins / 60)}h ago`,
      color: "green",
      pulse: false,
    };
  }
  if (mins < 1440) {
    return {
      text: `Last checked ${Math.floor(mins / 60)}h ago`,
      color: "amber",
      pulse: false,
    };
  }

  return { text: "Unverified", color: "gray", pulse: false };
}

export function getNextCheckTime(lastVerifiedAt: string | null): string {
  if (!lastVerifiedAt) return "soon";

  const mins = Math.floor(
    (Date.now() - new Date(lastVerifiedAt).getTime()) / 60000
  );

  const nextCheckMins = 30 - (mins % 30);
  if (nextCheckMins <= 0) return "now";
  return `${nextCheckMins}m`;
}

export function getOldestVerificationTime(
  codes: { last_verified_at: string | null }[]
): string | null {
  const verifiedCodes = codes.filter((c) => c.last_verified_at);
  if (verifiedCodes.length === 0) return null;

  return verifiedCodes.reduce((oldest, code) => {
    if (!oldest || (code.last_verified_at && code.last_verified_at < oldest)) {
      return code.last_verified_at;
    }
    return oldest;
  }, null as string | null);
}
