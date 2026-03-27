"use client";

import React from "react";
import { KPICard } from "./KPICard";
import { WalletCard } from "./WalletCard";
import { ActivityFeed } from "./ActivityFeed";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow,
  Tabs,
  TabsList,
  TabsTrigger,
  Badge,
  Progress,
  Separator,
  Button
} from "@trustbid/ui";

export function DashboardContent() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Alert Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
           <span className="text-xl">⚠️</span>
           <div>
              <p className="text-sm font-bold text-amber-900">3 Evidence Pieces Missing</p>
              <p className="text-xs text-amber-700">Milestone "Phase 1 Logistics" requires proof of delivery to be verified.</p>
           </div>
        </div>
        <button className="text-xs font-bold text-amber-900 underline">UPLOAD NOW</button>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          label="Total Funds Received" 
          value="$1,240,000" 
          change="+12%" 
          isPositive={true} 
          icon="🏦" 
          subtext="vs last quarter"
        />
        <KPICard 
          label="Expenses Executed" 
          value="$842,500" 
          change="+18%" 
          isPositive={true} 
          icon="💸" 
          subtext="On-track"
        />
        <KPICard 
          label="Remaining Balance" 
          value="$397,500" 
          icon="⚖️" 
          subtext="Available for Phase 3"
        />
        <KPICard 
          label="Milestone Progress" 
          value="68%" 
          change="+5%" 
          isPositive={true} 
          icon="🎯" 
          subtext="Technical execution"
        />
      </div>

      {/* Main Grid: Execution & Traceability */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Execution Overview & Budgets */}
        <div className="lg:col-span-2 space-y-10">
           <Card className="bg-white border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl overflow-hidden">
             <CardHeader className="flex flex-row items-center justify-between space-y-0 p-10 pb-4">
                <div>
                   <Badge variant="outline" className="text-trust-blue border-trust-blue/20 bg-trust-blue/5 mb-2 px-2 py-0 h-5 text-[9px] font-bold">
                      LIVE SYNC
                   </Badge>
                   <CardTitle className="text-2xl font-bold text-trust-dark tracking-tighter">Combined Execution Overview</CardTitle>
                   <p className="text-sm text-neutral-400 font-medium mt-1">Comparing Financial vs Technical Progress</p>
                </div>
                <Tabs defaultValue="chart" className="w-[180px]">
                   <TabsList className="grid w-full grid-cols-2 h-10 bg-neutral-100 p-1">
                      <TabsTrigger value="chart" className="text-[10px] font-bold">CHART</TabsTrigger>
                      <TabsTrigger value="table" className="text-[10px] font-bold">DATA</TabsTrigger>
                   </TabsList>
                </Tabs>
             </CardHeader>
             <CardContent className="p-10 pt-6">
                <div className="space-y-12">
                   {/* Sync Visualization Mock */}
                   <div className="space-y-6">
                      <div className="flex justify-between items-end">
                         <div className="space-y-1">
                            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Financial Execution</p>
                            <p className="text-3xl font-bold text-trust-dark tracking-tighter">$842k <span className="text-neutral-300 font-light text-xl">/ $1.2M</span></p>
                         </div>
                         <div className="text-right space-y-1">
                            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Technical Progress</p>
                            <p className="text-3xl font-bold text-trust-blue tracking-tighter">68% Reached</p>
                         </div>
                      </div>
                      <div className="relative pt-2">
                        <div className="h-4 bg-neutral-50 rounded-full overflow-hidden flex ring-1 ring-black/5">
                           <div className="h-full bg-trust-dark/10 w-[70%] border-r border-white/50"></div>
                           <div className="h-full bg-trust-blue w-[68%] -ml-[68%] shadow-[0_0_20px_rgba(11,40,254,0.3)]"></div>
                        </div>
                      </div>
                      <div className="flex justify-between text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                         <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-neutral-200"></div> Phase 1 [100%]</span>
                         <span className="text-trust-blue flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-trust-blue animate-pulse"></div> Phase 2 [40%]</span>
                         <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-neutral-200"></div> Phase 3 [0%]</span>
                      </div>
                   </div>

                   <Separator className="bg-neutral-100" />

                   {/* Milestone Table */}
                   <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-trust-dark uppercase tracking-[0.2em]">Key Milestones</h4>
                        <button className="text-[10px] font-bold text-trust-blue hover:underline">VIEW ALL TRACKS</button>
                      </div>
                      <div className="rounded-xl border border-neutral-100 overflow-hidden">
                        <Table>
                          <TableHeader className="bg-neutral-50/50">
                            <TableRow className="hover:bg-transparent border-neutral-100">
                              <TableHead className="w-[300px] h-12 text-[10px] font-bold uppercase tracking-wider px-6">Milestone Name</TableHead>
                              <TableHead className="h-12 text-[10px] font-bold uppercase tracking-wider px-6">Status</TableHead>
                              <TableHead className="h-12 text-[10px] font-bold uppercase tracking-wider px-6">Financial</TableHead>
                              <TableHead className="text-right h-12 text-[10px] font-bold uppercase tracking-wider px-6">Technical</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow className="border-neutral-100 hover:bg-neutral-50/30 transition-colors">
                              <TableCell className="font-bold py-5 px-6">Community Water Access</TableCell>
                              <TableCell className="px-6"><Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none rounded-md px-2 py-0 text-[10px]">Completed</Badge></TableCell>
                              <TableCell className="text-neutral-500 font-medium px-6">$240,000</TableCell>
                              <TableCell className="text-right font-bold px-6">100%</TableCell>
                            </TableRow>
                            <TableRow className="border-neutral-100 hover:bg-neutral-50/30 transition-colors">
                              <TableCell className="font-bold py-5 px-6">Technical Training Progr.</TableCell>
                              <TableCell className="px-6"><Badge className="bg-trust-blue/5 text-trust-blue hover:bg-trust-blue/5 border-none rounded-md px-2 py-0 text-[10px]">In Progress</Badge></TableCell>
                              <TableCell className="text-neutral-500 font-medium px-6">$180,000</TableCell>
                              <TableCell className="text-right font-bold px-6">45%</TableCell>
                            </TableRow>
                            <TableRow className="border-none hover:bg-neutral-50/30 transition-colors">
                              <TableCell className="font-bold py-5 px-6">Logistics Hub Setup</TableCell>
                              <TableCell className="px-6"><Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none rounded-md px-2 py-0 text-[10px]">Pending Evid.</Badge></TableCell>
                              <TableCell className="text-neutral-500 font-medium px-6">$120,500</TableCell>
                              <TableCell className="text-right font-bold px-6">85%</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                   </div>
                </div>
             </CardContent>
           </Card>

           {/* Budget Areas / Wallets */}
           <div className="space-y-6">
              <h4 className="text-xs font-bold text-trust-dark uppercase tracking-[0.2em] px-2">Budget Areas & Status</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <WalletCard 
                  name="Field Operations" 
                  budget="$500,000" 
                  executed="$320,000" 
                  remaining="$180,000" 
                  evidenceCount={24} 
                  status="on-track" 
                />
                <WalletCard 
                  name="Technical Training" 
                  budget="$250,000" 
                  executed="$120,000" 
                  remaining="$130,000" 
                  evidenceCount={12} 
                  status="on-track" 
                />
                <WalletCard 
                  name="Logistics & Supply" 
                  budget="$300,000" 
                  executed="$280,000" 
                  remaining="$20,000" 
                  evidenceCount={45} 
                  status="warning" 
                />
                <WalletCard 
                  name="Admin & Governance" 
                  budget="$190,000" 
                  executed="$122,500" 
                  remaining="$67,500" 
                  evidenceCount={8} 
                  status="on-track" 
                />
              </div>
           </div>
        </div>

        {/* Right Sidebar Column */}
        <div className="space-y-8">
           <Card className="bg-white border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full rounded-3xl overflow-hidden">
             <CardContent className="p-8">
                <ActivityFeed />
             </CardContent>
           </Card>

           <Card className="bg-trust-blue border-none shadow-2xl shadow-trust-blue/30 text-white rounded-3xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
              <CardHeader className="p-8 pb-4 relative z-10">
                 <CardTitle className="text-xl font-bold tracking-tight">Donor Summary</CardTitle>
                 <p className="text-xs text-white/50 font-medium">Transparency report for UN-HABITAT</p>
              </CardHeader>
              <CardContent className="p-8 pt-4 space-y-8 relative z-10">
                 <div className="space-y-3">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/60">
                       <span>Evidence Coverage</span>
                       <span className="text-white">92%</span>
                    </div>
                    <Progress value={92} className="h-2 bg-white/10" />
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                       <p className="text-[10px] font-bold uppercase text-white/40 tracking-widest">Verified</p>
                       <p className="text-2xl font-bold">142</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                       <p className="text-[10px] font-bold uppercase text-white/40 tracking-widest">Traceable</p>
                       <p className="text-2xl font-bold">100%</p>
                    </div>
                 </div>

                 <Button className="w-full bg-white text-trust-blue border-none hover:bg-neutral-100 font-bold h-12 rounded-xl transition-all hover:scale-[1.02] active:scale-95">
                    GENERATE AUDIT REPORT
                 </Button>
              </CardContent>
           </Card>
        </div>

      </div>
    </div>
  );
}
