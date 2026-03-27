import React from "react";
import { Card, CardContent } from "@trustbid/ui";

interface KPICardProps {
  label: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  icon?: string;
  subtext?: string;
}

export function KPICard({ label, value, change, isPositive, icon, subtext }: KPICardProps) {
  return (
    <Card className="bg-white border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl overflow-hidden group hover:border-trust-blue/30 transition-all hover:-translate-y-1">
      <CardContent className="p-8">
        <div className="flex justify-between items-start mb-6">
          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">{label}</p>
          <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-xl group-hover:bg-trust-blue/5 group-hover:scale-110 transition-all pb-0.5">
             {icon}
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-3xl font-bold text-trust-dark tracking-tighter">{value}</h3>
          
          <div className="flex items-center gap-2">
            {change && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                isPositive ? "bg-green-100/50 text-green-700" : "bg-red-100/50 text-red-700"
              }`}>
                {change}
              </span>
            )}
            <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">{subtext || "Since last month"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
