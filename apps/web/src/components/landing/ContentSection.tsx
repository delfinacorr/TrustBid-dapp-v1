"use client";

import React from "react";
import Image from "next/image";
import { Badge } from "@trustbid/ui";

export function ContentSection() {
  return (
    <section className="bg-white rounded-t-[3rem] md:rounded-t-[5rem] -mt-12 relative z-20 py-32 md:py-48 px-6 overflow-hidden">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32 items-center">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] md:aspect-[4/5] group ring-1 ring-black/5">
          <Image
            src="/identidad/POSTER2.jpg"
            alt="Asset Management"
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-trust-dark/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
        
        <div className="space-y-12">
          <div className="space-y-4">
             <Badge variant="outline" className="text-trust-blue border-trust-blue/20 bg-trust-blue/5 uppercase tracking-[0.15em] px-3 py-0.5 text-[9px] font-bold">
                CORE PROBLEM
             </Badge>
             <h2 className="text-5xl md:text-7xl font-bold text-trust-dark tracking-tighter leading-[0.95]">
                ¿A dónde va el <br />
                <span className="text-trust-blue">dinero?</span>
             </h2>
          </div>
          
          <p className="text-xl md:text-2xl text-trust-dark/60 leading-relaxed max-w-xl font-light">
            Financial transparency is no longer an option, it is the new standard. 
            TrustBid provides the infrastructure to track, verify, and manage every movement with immutable precision.
          </p>
          
          <div className="grid grid-cols-2 gap-12 pt-12 border-t border-trust-gray/20">
            <div className="space-y-2">
              <p className="text-4xl md:text-5xl font-bold text-trust-dark tracking-tighter">100%</p>
              <p className="text-[10px] text-trust-dark/40 uppercase tracking-[0.2em] font-bold">Full Traceability</p>
              <div className="h-1 w-12 bg-trust-blue/20 rounded-full"></div>
            </div>
            <div className="space-y-2">
              <p className="text-4xl md:text-5xl font-bold text-trust-dark tracking-tighter">Verified</p>
              <p className="text-[10px] text-trust-dark/40 uppercase tracking-[0.2em] font-bold">Real-time Check</p>
              <div className="h-1 w-12 bg-trust-blue/20 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
