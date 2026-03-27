"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button, Separator } from "@trustbid/ui";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: "▦" },
  { label: "Execution", href: "/dashboard/execution", icon: "◎" },
  { label: "Traceability", href: "/dashboard/traceability", icon: "◈" },
  { label: "Evidence", href: "/dashboard/evidence", icon: "◻" },
  { label: "Reporting", href: "/dashboard/reporting", icon: "◑" },
];

function getPageTitle(pathname: string): string {
  if (pathname === "/dashboard/events/new") return "New Event";
  const found = navItems.find(
    (i) => pathname === i.href || (i.href !== "/dashboard" && pathname.startsWith(i.href))
  );
  return found?.label ?? "Dashboard";
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-trust-dark text-white hidden md:flex flex-col border-r border-white/5 flex-shrink-0">
        <div className="p-6 pb-4">
          <Link href="/">
            <Image
              src="/identidad/LOGO_transp.png"
              alt="TrustBid"
              width={140}
              height={40}
              className="h-8 w-auto brightness-0 invert"
            />
          </Link>
          <p className="text-[10px] text-white/20 font-bold uppercase tracking-[0.2em] mt-3">
            Fund Traceability Platform
          </p>
        </div>

        <div className="px-4 mb-2">
          <Separator className="bg-white/5" />
        </div>

        <nav className="flex-1 px-4 py-4 space-y-0.5">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-trust-blue text-white shadow-lg shadow-trust-blue/20"
                    : "text-white/40 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className="text-base leading-none">{item.icon}</span>
                {item.label}
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto space-y-4">
          <div className="bg-white/5 rounded-2xl p-4 space-y-3 border border-white/5">
            <p className="text-[9px] text-trust-blue font-bold uppercase tracking-[0.2em]">
              Protocol Status
            </p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-white/70 font-medium">All systems nominal</span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="bg-white/5 rounded-lg px-2 py-1.5 text-center">
                <p className="text-[9px] text-white/30 uppercase">Blocks</p>
                <p className="text-xs font-bold">2,841,203</p>
              </div>
              <div className="bg-white/5 rounded-lg px-2 py-1.5 text-center">
                <p className="text-[9px] text-white/30 uppercase">Events</p>
                <p className="text-xs font-bold">10</p>
              </div>
            </div>
          </div>

          <div className="px-2 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-trust-blue flex items-center justify-center font-bold text-xs flex-shrink-0">
              JA
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold truncate">Jairo Amaya</p>
              <p className="text-[10px] text-white/30 truncate">NGO Director · UN-HABITAT</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-neutral-100 flex items-center justify-between px-8 z-10 flex-shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="text-base font-bold text-trust-dark tracking-tight">
              {getPageTitle(pathname)}
            </h1>
            <div className="h-4 w-px bg-neutral-200" />
            <span className="text-xs text-neutral-400 font-medium">
              Clean Water Initiative · Phase 2
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs text-neutral-400 font-medium bg-neutral-50 border border-neutral-100 px-3 py-1.5 rounded-lg">
              Mar 2026 – Apr 2026
            </div>
            <Button
              onClick={() => router.push("/dashboard/events/new")}
              variant="default"
              className="h-9 px-5 bg-trust-blue text-xs font-bold text-white rounded-lg"
            >
              + NEW EVENT
            </Button>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto bg-[#F8F9FA] p-8">{children}</div>
      </main>
    </div>
  );
}
