/**
 * Accessly Web Accessibility Widget — Integration Layer
 *
 * Accessly is used strictly as an accessibility toolbar / enhancement widget.
 * It is NOT an authentication provider.
 *
 * Configuration:
 *   NEXT_PUBLIC_ACCESSLY_API_KEY   — Project API key (required to load the widget)
 *   NEXT_PUBLIC_ACCESSLY_SCRIPT_URL — CDN URL (optional, has a default)
 *
 * To disable:   remove NEXT_PUBLIC_ACCESSLY_API_KEY from environment.
 * To replace:   swap AccesslyScript component + update types below.
 * Documentation: https://accessly.io/docs  (update with actual docs URL)
 */

// ─── Public API surface ───────────────────────────────────────────────────────
//
// This interface reflects the expected runtime API exposed by the widget after
// initialization. Update these types once the official Accessly docs are
// consulted; all call-sites use `getAccessly()` so the update is one place only.

export interface AccesslySettings {
  /** Visual contrast mode */
  contrast?: "normal" | "high" | "inverted";
  /** Text size preference */
  fontSize?: "normal" | "large" | "larger";
  /** Pointer / cursor size */
  cursor?: "default" | "large" | "reading";
  /** Whether animations are reduced */
  animations?: boolean;
  /** Enhanced focus indicator */
  focusIndicator?: boolean;
  /** Screen-reader-specific optimisations */
  screenReader?: boolean;
  [key: string]: unknown;
}

export type AccesslyEvent =
  | "open"
  | "close"
  | "initialized"
  | "settingsChanged";

export interface AccesslyAPI {
  /** Opens the accessibility widget panel */
  open: () => void;
  /** Closes the accessibility widget panel */
  close: () => void;
  /** Toggles the accessibility widget panel open/closed */
  toggle: () => void;
  /** Returns true when the widget panel is currently visible */
  isOpen: () => boolean;
  /** Returns the accessibility settings the user has applied */
  getSettings: () => AccesslySettings;
  /** Subscribes to a widget lifecycle event */
  on: (event: AccesslyEvent, handler: () => void) => void;
  /** Removes a widget lifecycle event subscription */
  off: (event: AccesslyEvent, handler: () => void) => void;
}

// ─── Window augmentation ─────────────────────────────────────────────────────

declare global {
  interface Window {
    /**
     * Accessly widget global — available after the external script has
     * initialised. Guard every access with `getAccessly()` or `isAccesslyReady()`.
     */
    Accessly?: AccesslyAPI;
  }
}

// ─── Runtime helpers ─────────────────────────────────────────────────────────

/**
 * Safely returns the Accessly global API instance.
 * Returns `null` during SSR or before the script has finished loading.
 */
export function getAccessly(): AccesslyAPI | null {
  if (typeof window === "undefined") return null;
  return window.Accessly ?? null;
}

/**
 * Returns `true` only when the Accessly widget is fully initialised on the
 * client side. Safe to call during SSR — always returns `false` there.
 */
export function isAccesslyReady(): boolean {
  return typeof window !== "undefined" && typeof window.Accessly !== "undefined";
}

// ─── Environment configuration ────────────────────────────────────────────────

/**
 * Project-specific Accessly API key.
 * Set via NEXT_PUBLIC_ACCESSLY_API_KEY.  `null` means the widget will not load.
 */
export const ACCESSLY_API_KEY: string | null =
  process.env.NEXT_PUBLIC_ACCESSLY_API_KEY ?? null;

/**
 * CDN URL for the Accessly widget loader script.
 * Can be overridden via NEXT_PUBLIC_ACCESSLY_SCRIPT_URL.
 */
export const ACCESSLY_SCRIPT_URL: string =
  process.env.NEXT_PUBLIC_ACCESSLY_SCRIPT_URL ?? "https://cdn.accessly.io/widget.js";
