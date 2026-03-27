import React from "react";
import { Card, CardContent, Progress, Badge } from "@trustbid/ui";

interface WalletCardProps {
  name: string;
  budget: string;
  executed: string;
  remaining: string;
  evidenceCount: number;
  status: "on-track" | "warning" | "alert";
}

export function WalletCard({ name, budget, executed, remaining, evidenceCount, status }: WalletCardProps) {
  const percentage = (parseFloat(executed.replace(/[^0-9.]/g, '')) / parseFloat(budget.replace(/[^0-9.]/g, ''))) * 100;
  
  const statusColors = {
    "on-track": "bg-green-100 text-green-700 border-green-200",
    "warning": "bg-amber-100 text-amber-700 border-amber-200",
    "alert": "bg-red-100 text-red-700 border-red-200",
  };

  return (
    <Card className="bg-white border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl overflow-hidden hover:border-trust-blue/30 transition-all group">
      <CardContent className="p-8 space-y-6">
        <div className="flex justify-between items-center">
          <h4 className="font-bold text-trust-dark tracking-tighter text-lg">{name}</h4>
          <Badge variant="outline" className={`text-[9px] font-bold uppercase tracking-[0.15em] px-2 py-0 border-none ${statusColors[status]}`}>
            {status}
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-1">
            <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Budget</p>
            <p className="text-lg font-bold text-trust-dark tracking-tighter">{budget}</p>
          </div>
          <div className="space-y-1 text-right">
            <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Remaining</p>
            <p className="text-lg font-bold text-trust-blue tracking-tighter">{remaining}</p>
          </div>
        </div>
        
        <div className="space-y-2">
           <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
              <span className="text-neutral-400">Execution</span>
              <span className="text-trust-dark">{Math.round(percentage)}%</span>
           </div>
           <Progress value={percentage} className="h-2 bg-neutral-100/50" />
        </div>
        
        <div className="pt-6 border-t border-neutral-50 flex items-center justify-between">
           <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-neutral-50 flex items-center justify-center text-xs pb-0.5">📎</div>
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">{evidenceCount} Pieces</span>
           </div>
           <button className="text-[10px] font-bold text-trust-blue hover:underline uppercase tracking-widest">VIEW DETAILS</button>
        </div>
      </CardContent>
    </Card>
  );
}
