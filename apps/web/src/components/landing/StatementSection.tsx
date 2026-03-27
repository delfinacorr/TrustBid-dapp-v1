"use client";

import React from "react";
import Image from "next/image";
import { Badge } from "@trustbid/ui";

export function StatementSection() {
  return (
    <section className="bg-trust-blue py-32 md:py-48 px-6 relative overflow-hidden">
      {/* Pattern Background Overlay */}
      <div className="absolute inset-0 opacity-20 mix-blend-overlay">
        <Image
          src="/identidad/pattern.jpg"
          alt="Pattern"
          fill
          className="object-cover"
        />
      </div>
      
      <div className="container mx-auto relative z-10">
        <div className="flex flex-col items-center text-center space-y-12">
          <Badge className="bg-white text-trust-blue hover:bg-white uppercase tracking-[0.2em] px-4 py-1 text-[10px] font-bold">
             THE PROTOCOL
          </Badge>
          <h2 className="text-6xl md:text-[100px] font-bold text-white tracking-tighter leading-[0.9] max-w-5xl">
            Trust every <br />
            <span className="opacity-40 italic">movement.</span>
          </h2>
          
          <div className="w-px h-24 bg-gradient-to-b from-white to-transparent opacity-30"></div>
          
          <div className="relative w-full max-w-sm md:max-w-md aspect-[9/19] rounded-[3rem] overflow-hidden border-[8px] border-white/10 shadow-[0_0_100px_-20px_rgba(255,255,255,0.2)] bg-trust-black">
             <Image
               src="/identidad/POSTER1.jpg"
               alt="Mobile App Interface"
               fill
               className="object-cover opacity-80"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-trust-black via-transparent to-transparent"></div>
             <div className="absolute bottom-12 left-0 right-0 p-8 text-left space-y-2">
                <p className="text-xs font-bold text-trust-blue uppercase tracking-widest">Live Trace</p>
                <p className="text-xl font-bold text-white leading-tight">Protocol synchronized with global ledger.</p>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
