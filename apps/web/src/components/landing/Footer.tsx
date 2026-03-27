"use client";

import React from "react";
import Image from "next/image";
import { Separator } from "@trustbid/ui";

export function Footer() {
  return (
    <footer className="bg-trust-dark py-24 px-6 text-white overflow-hidden">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2 space-y-6">
            <Image
              src="/identidad/LOGO_transp.png"
              alt="TrustBid Logo"
              width={160}
              height={50}
              className="h-10 w-auto object-contain brightness-0 invert"
            />
            <p className="text-xl text-trust-gray/40 max-w-sm leading-relaxed">
              Institutional transparency infrastructure for high-trust financial movements.
            </p>
          </div>
          
          <div className="space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-widest text-trust-blue">Protocol</h4>
            <ul className="space-y-4 text-trust-gray/60">
              <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Governance</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Partners</a></li>
            </ul>
          </div>
          
          <div className="space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-widest text-trust-blue">Company</h4>
            <ul className="space-y-4 text-trust-gray/60">
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <Separator className="bg-white/10 mb-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-trust-gray/30 font-medium uppercase tracking-tighter">
          <p>© 2026 TrustBid. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
