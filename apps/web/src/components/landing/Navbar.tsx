"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@trustbid/ui";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b border-trust-gray/20">
      <div className="flex items-center gap-2">
        <Image
          src="/identidad/LOGO_transp.png"
          alt="TrustBid Logo"
          width={120}
          height={40}
          className="h-8 w-auto object-contain"
        />
      </div>
      
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-trust-dark/70">
        <Link href="#problem" className="hover:text-trust-blue transition-colors">Problem</Link>
        <Link href="#how-it-works" className="hover:text-trust-blue transition-colors">How It Works</Link>
        <Link href="#about" className="hover:text-trust-blue transition-colors">About</Link>
      </div>

      <div className="flex items-center gap-4">
        <Link href="/login">
          <Button variant="outline" className="text-trust-blue border-trust-blue/20 hover:bg-trust-blue/5 rounded-full px-6">
            Login
          </Button>
        </Link>
        <Button variant="default" className="bg-trust-blue hover:bg-trust-blue/90 text-white rounded-full px-6">
          JOIN WAITLIST
        </Button>
      </div>
    </nav>
  );
}
