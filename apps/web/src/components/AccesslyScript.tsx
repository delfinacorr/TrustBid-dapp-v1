"use client";

/**
 * AccesslyScript
 *
 * Injects the Accessly web accessibility widget script exactly once at the
 * application level. Render this component inside the root client Provider tree
 * so it is active on every route — including /login and /register.
 *
 * The widget is an accessibility toolbar. It is NOT an authentication provider.
 *
 * Environment variables consumed:
 *   NEXT_PUBLIC_ACCESSLY_API_KEY     — required to activate the widget
 *   NEXT_PUBLIC_ACCESSLY_SCRIPT_URL  — optional CDN URL override
 *
 * To disable:  remove / unset NEXT_PUBLIC_ACCESSLY_API_KEY
 * To replace:  swap this file; nothing else needs to change
 *
 * Next.js deduplicates <Script id="..."> across concurrent renders, so
 * duplicated mount/unmount cycles will not double-inject the script.
 */

import Script from "next/script";
import { ACCESSLY_API_KEY, ACCESSLY_SCRIPT_URL } from "../lib/accessly";

export function AccesslyScript() {
  // No-op when the API key is not configured — keeps the bundle clean and
  // avoids network requests to the Accessly CDN in environments that don't
  // need the widget (e.g. CI, test environments, preview deployments).
  if (!ACCESSLY_API_KEY) {
    return null;
  }

  return (
    <Script
      id="accessly-widget-loader"
      src={ACCESSLY_SCRIPT_URL}
      // afterInteractive: loads after page is interactive — widget is non-critical
      strategy="afterInteractive"
      // The Accessly script reads this attribute to identify the project account
      data-account={ACCESSLY_API_KEY}
      onError={() => {
        if (process.env.NODE_ENV === "development") {
          console.warn(
            "[TrustBid/Accessly] Failed to load widget script from:",
            ACCESSLY_SCRIPT_URL,
            "\nVerify NEXT_PUBLIC_ACCESSLY_SCRIPT_URL and network/CSP settings."
          );
        }
      }}
    />
  );
}
