"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  getAccessly,
  isAccesslyReady,
  ACCESSLY_API_KEY,
  type AccesslySettings,
} from "../lib/accessly";

// How often to poll for the widget global (ms)
const POLL_INTERVAL_MS = 300;
// Give up polling after this long — script likely failed or key not set (ms)
const POLL_TIMEOUT_MS = 12_000;

export interface UseAccesslyReturn {
  /** True once the Accessly widget has fully initialised on the client */
  isReady: boolean;
  /** Whether an API key is configured at all */
  isConfigured: boolean;
  /** Opens the accessibility widget panel */
  open: () => void;
  /** Closes the accessibility widget panel */
  close: () => void;
  /** Toggles the accessibility widget panel open/closed */
  toggle: () => void;
  /** Returns the user's current accessibility settings ({} if not ready) */
  getSettings: () => AccesslySettings;
}

/**
 * useAccessly
 *
 * Provides a type-safe, SSR-safe interface for interacting with the Accessly
 * accessibility widget that is loaded globally via <AccesslyScript />.
 *
 * The hook polls for `window.Accessly` to become available after the external
 * script loads and resolves automatically. All action methods are no-ops while
 * the widget is not yet ready, so they can be called unconditionally.
 *
 * @example
 * const { isReady, toggle } = useAccessly();
 * <button onClick={toggle} disabled={!isReady}>Accessibility options</button>
 */
export function useAccessly(): UseAccesslyReturn {
  const [isReady, setIsReady]       = useState<boolean>(false);
  const intervalRef                  = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef                   = useRef<ReturnType<typeof setTimeout>  | null>(null);

  const isConfigured = ACCESSLY_API_KEY !== null;

  useEffect(() => {
    // Bail early if no key — widget will never load
    if (!isConfigured) return;

    // Already available (e.g. fast network, script cached)
    if (isAccesslyReady()) {
      setIsReady(true);
      return;
    }

    // Poll until the widget global appears
    intervalRef.current = setInterval(() => {
      if (isAccesslyReady()) {
        setIsReady(true);
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (timeoutRef.current)  clearTimeout(timeoutRef.current);
      }
    }, POLL_INTERVAL_MS);

    // Stop polling after the timeout — avoids runaway intervals on load failure
    timeoutRef.current = setTimeout(() => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (process.env.NODE_ENV === "development" && !isAccesslyReady()) {
        console.warn(
          "[TrustBid/Accessly] Widget did not initialise within the expected time. " +
          "Check NEXT_PUBLIC_ACCESSLY_API_KEY and NEXT_PUBLIC_ACCESSLY_SCRIPT_URL."
        );
      }
    }, POLL_TIMEOUT_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current)  clearTimeout(timeoutRef.current);
    };
  }, [isConfigured]);

  // Action methods — all guard against "not ready" internally

  const open = useCallback(() => {
    getAccessly()?.open();
  }, []);

  const close = useCallback(() => {
    getAccessly()?.close();
  }, []);

  const toggle = useCallback(() => {
    getAccessly()?.toggle();
  }, []);

  const getSettings = useCallback((): AccesslySettings => {
    return getAccessly()?.getSettings() ?? {};
  }, []);

  return { isReady, isConfigured, open, close, toggle, getSettings };
}
