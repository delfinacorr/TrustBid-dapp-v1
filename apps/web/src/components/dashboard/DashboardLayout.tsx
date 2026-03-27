"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button, Separator } from "@trustbid/ui";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { label: "Overview", href: "/dashboard", icon: "📊" },
    { label: "Execution", href: "/dashboard/execution", icon: "⚙️" },
    { label: "Traceability", href: "/dashboard/traceability", icon: "⛓️" },
    { label: "Evidence", href: "/dashboard/evidence", icon: "📎" },
    { label: "Reporting", href: "/dashboard/reporting", icon: "📝" },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-trust-dark text-white hidden md:flex flex-col border-r border-white/5">
        <div className="p-6">
          <Link href="/">
            <Image
              src="/identidad/LOGO_transp.png"
              alt="TrustBid Logo"
              width={140}
              height={40}
              className="h-8 w-auto brightness-0 invert"
            />
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                pathname === item.href 
                  ? "bg-trust-blue text-white" 
                  : "text-trust-gray/40 hover:text-white hover:bg-white/5"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 mt-auto">
          <div className="bg-white/5 rounded-xl p-4 space-y-3">
            <p className="text-[10px] text-trust-blue font-bold uppercase tracking-widest">Protocol Status</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-white/80 font-medium">Node Synchronized</span>
            </div>
            <Separator className="bg-white/10" />
            <Button variant="outline" className="w-full text-[10px] py-1 h-auto border-white/10 text-white/40 hover:bg-white/5">
              SUPPORT
            </Button>
          </div>
          
          <div className="flex items-center gap-3 mt-6 px-4">
             <div className="w-8 h-8 rounded-full bg-trust-blue flex items-center justify-center font-bold text-xs">JA</div>
             <div className="flex-1 overflow-hidden">
                <p className="text-xs font-bold truncate">Jairo Amaya</p>
                <p className="text-[10px] text-trust-gray/40 truncate">NGO Director</p>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-8 z-10">
          <h1 className="text-lg font-bold text-trust-dark">
            {navItems.find(i => i.href === pathname)?.label || "Dashboard"}
          </h1>
          
          <div className="flex items-center gap-4">
            <Button variant="outline" className="h-9 px-4 text-xs font-bold border-neutral-200 text-neutral-500">
              MAR 2026 - APR 2026
            </Button>
            <Button variant="default" className="h-9 px-4 bg-trust-blue text-xs font-bold text-white">
               + NEW EVENT
            </Button>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto bg-[#F8F9FA] p-8">
           {children}
        </div>
      </main>
    </div>
  );
}
