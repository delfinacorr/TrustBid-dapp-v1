"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button, Badge } from "@trustbid/ui";

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-start justify-center px-6 pt-32 pb-20 overflow-hidden bg-trust-black">
      {/* Blue Glow Effect */}
      <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-trust-blue/15 rounded-full blur-[140px] -translate-x-1/2 animate-pulse-slow"></div>
      
      <div className="container mx-auto z-10 grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-center">
        <div className="max-w-3xl">
          <Badge variant="outline" className="text-trust-blue border-trust-blue/30 mb-8 bg-trust-blue/5 uppercase tracking-[0.2em] px-4 py-1.5 text-[10px] font-bold">
            TRANSPARENCY INFRASTRUCTURE
          </Badge>
          
          <h1 className="text-6xl md:text-8xl lg:text-[120px] font-bold text-white tracking-tighter leading-[0.95] mb-8 text-gradient">
            Every fund <br />
            <span className="text-trust-blue">leaves a trace.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-trust-gray/60 max-w-xl mb-12 leading-relaxed font-light">
            The first institutional-grade protocol for high-trust financial movements and auction-driven asset management.
          </p>
          
          <div className="flex flex-wrap gap-5">
            <Link href="/login">
              <Button size="lg" className="bg-trust-blue hover:bg-trust-blue/90 text-white rounded-full px-10 py-7 text-lg font-bold glow-blue transition-all hover:scale-105 active:scale-95">
                Get Started
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="border-white/10 text-white hover:bg-white/5 rounded-full px-10 py-7 text-lg font-bold backdrop-blur-sm transition-all hover:border-white/20">
                Explore Dashboard
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="relative h-[500px] md:h-[700px] flex items-center justify-end">
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[140%] md:w-[150%] h-auto opacity-90 md:opacity-100 rotate-6 md:rotate-0 translate-x-1/4 animate-float pointer-events-none">
            <div className="relative group">
               <div className="absolute inset-0 bg-trust-blue/20 blur-[100px] rounded-full scale-75 group-hover:scale-100 transition-transform duration-1000"></div>
               <Image
                 src="/identidad/ISO1_transp.png"
                 alt="TrustBid Isotype"
                 width={1000}
                 height={1000}
                 className="object-contain relative z-10"
                 priority
               />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
