import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "../components/Providers";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "TrustBid – Fund Traceability Platform",
    template: "%s | TrustBid",
  },
  description:
    "Transparent, immutable fund traceability for NGOs, donors, and auditors. " +
    "Every movement verified, every peso accounted for.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/*
          Skip-to-main-content — WCAG 2.4.1 Bypass Blocks (Level A).
          Visually hidden unless focused; revealed as a blue pill for keyboard users.
        */}
        <a
          href="#main-content"
          className={[
            "sr-only",
            "focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999]",
            "focus:px-4 focus:py-2",
            "focus:bg-trust-blue focus:text-white",
            "focus:rounded-lg focus:text-sm focus:font-bold focus:shadow-xl",
            "focus:outline-none focus:ring-2 focus:ring-white",
            "focus:ring-offset-2 focus:ring-offset-trust-blue",
          ].join(" ")}
        >
          Skip to main content
        </a>

        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
