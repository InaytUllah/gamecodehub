declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(
  action: string,
  category: string,
  label?: string,
  value?: number
) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value,
    });
  }
}

export function trackCodeCopy(gameSlug: string, code: string) {
  trackEvent("copy_code", "codes", `${gameSlug}:${code}`);
}

export function trackRedeemClick(gameSlug: string) {
  trackEvent("redeem_click", "codes", gameSlug);
}

export function trackNewsletterSignup(locale: string) {
  trackEvent("newsletter_signup", "engagement", locale);
}
