import React from "react";
import { Badge } from "@trustbid/ui";

interface ActivityItem {
  id: string;
  type: "fund" | "payment" | "activity" | "evidence" | "report";
  title: string;
  timestamp: string;
  user: string;
  verified: boolean;
}

const activities: ActivityItem[] = [
  { id: "1", type: "fund", title: "New Grant Received: UN-HABITAT", timestamp: "2h ago", user: "Finance Dept.", verified: true },
  { id: "2", type: "activity", title: "Milestone Reached: Phase 1 Foundations", timestamp: "5h ago", user: "Field Ops", verified: true },
  { id: "3", type: "payment", title: "Payment Disbursed: Logistics Provider", timestamp: "Yesterday", user: "Procurement", verified: false },
  { id: "4", type: "evidence", title: "Technical Report Uploaded", timestamp: "Yesterday", user: "Audit Team", verified: true },
  { id: "5", type: "report", title: "Monthly Transparency Statement Ready", timestamp: "2 days ago", user: "System", verified: true },
];

export function ActivityFeed() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <h4 className="text-sm font-bold text-trust-dark uppercase tracking-widest">Traceability Feed</h4>
         <button className="text-[10px] font-bold text-trust-blue hover:underline">VIEW ALL</button>
      </div>
      
      <div className="space-y-0">
        {activities.map((item, idx) => (
          <div key={item.id} className={`flex gap-4 p-4 border-l-2 relative transition-colors hover:bg-neutral-50 ${
            idx < activities.length - 1 ? "border-neutral-100" : "border-transparent"
          }`}>
             {/* Indicator dot */}
             <div className={`absolute -left-[5px] top-5 w-2 h-2 rounded-full ${
               item.verified ? "bg-trust-blue shadow-[0_0_8px_rgba(11,40,254,0.5)]" : "bg-neutral-300"
             }`}></div>
             
             <div className="flex-1 space-y-1">
                <div className="flex justify-between items-start">
                   <p className="text-xs font-bold text-trust-dark leading-tight">{item.title}</p>
                   <span className="text-[10px] text-neutral-400 whitespace-nowrap">{item.timestamp}</span>
                </div>
                
                <div className="flex items-center gap-2">
                   <p className="text-[10px] text-neutral-500">by {item.user}</p>
                   {item.verified && (
                     <Badge className="bg-trust-blue/5 text-trust-blue border-none h-4 px-1 text-[8px] font-bold">VERIFIED</Badge>
                   )}
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
