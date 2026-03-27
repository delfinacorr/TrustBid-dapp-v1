"use client";

import React, { useState, useMemo } from "react";
import { useStore } from "../../../lib/store";
import {
  Card, CardContent, CardHeader, CardTitle,
  Badge, Progress,
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
  Separator,
} from "@trustbid/ui";
import { KPICard } from "../../../components/dashboard/KPICard";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

const fmtDate = (s: string) =>
  new Date(s).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const statusCfg: Record<string, { label: string; cls: string }> = {
  completed:    { label: "Completed",      cls: "bg-green-100 text-green-700" },
  in_progress:  { label: "In Progress",    cls: "bg-trust-blue/10 text-trust-blue" },
  pending:      { label: "Pending Evid.",  cls: "bg-amber-100 text-amber-700" },
  not_started:  { label: "Not Started",    cls: "bg-neutral-100 text-neutral-500" },
};

const categoryColor: Record<string, string> = {
  field:      "bg-blue-500",
  training:   "bg-purple-500",
  logistics:  "bg-amber-500",
  admin:      "bg-neutral-500",
  operations: "bg-green-500",
};

export default function ExecutionPage() {
  const { state } = useStore();
  const [selectedProjectId, setSelectedProjectId] = useState("p1");
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null);

  const project = state.projects.find((p) => p.id === selectedProjectId);
  const areas = state.budgetAreas.filter((ba) => ba.projectId === selectedProjectId);
  const activities = state.activities.filter((a) => a.projectId === selectedProjectId);
  const movements = state.financialMovements.filter((fm) =>
    areas.some((ba) => ba.id === fm.budgetAreaId)
  );

  const totalBudget  = areas.reduce((s, a) => s + a.totalBudget, 0);
  const totalExec    = areas.reduce((s, a) => s + a.executed, 0);
  const remaining    = totalBudget - totalExec;
  const execPct      = totalBudget ? Math.round((totalExec / totalBudget) * 100) : 0;
  const techProgress = activities.length
    ? Math.round(activities.reduce((s, a) => s + a.technicalProgress, 0) / activities.length)
    : 0;

  const filteredActivities = useMemo(
    () => (selectedAreaId ? activities.filter((a) => a.budgetAreaId === selectedAreaId) : activities),
    [activities, selectedAreaId]
  );

  const movementsForArea = useMemo(
    () => (selectedAreaId ? movements.filter((m) => m.budgetAreaId === selectedAreaId) : movements),
    [movements, selectedAreaId]
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Project Selector */}
      <div className="flex items-center gap-2">
        {state.projects.map((p) => (
          <button
            key={p.id}
            onClick={() => { setSelectedProjectId(p.id); setSelectedAreaId(null); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedProjectId === p.id
                ? "bg-trust-dark text-white shadow"
                : "bg-white text-neutral-500 border border-neutral-200 hover:border-trust-blue/30"
            }`}
          >
            {p.name}
            <span className={`ml-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
              selectedProjectId === p.id ? "bg-white/20 text-white" : "bg-neutral-100 text-neutral-400"
            }`}>
              {p.phase}
            </span>
          </button>
        ))}
        {project && (
          <span className="ml-auto text-xs text-neutral-400 font-medium">
            Donor: <span className="font-bold text-trust-dark">{project.donor}</span>
          </span>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <KPICard label="Total Budget"       value={fmt(totalBudget)} icon="🏦" subtext={project?.phase ?? ""} />
        <KPICard label="Executed"           value={fmt(totalExec)}   change={`${execPct}%`} isPositive icon="💸" subtext="of total budget" />
        <KPICard label="Remaining Balance"  value={fmt(remaining)}   icon="⚖️" subtext="Available funds" />
        <KPICard label="Tech. Progress"     value={`${techProgress}%`} icon="🎯" subtext="Avg. across activities" />
      </div>

      {/* Budget Areas */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-trust-dark uppercase tracking-[0.2em]">Budget Areas</h2>
          {selectedAreaId && (
            <button
              onClick={() => setSelectedAreaId(null)}
              className="text-[10px] font-bold text-trust-blue hover:underline"
            >
              CLEAR FILTER
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {areas.map((area) => {
            const pct = area.totalBudget ? Math.round((area.executed / area.totalBudget) * 100) : 0;
            const isSelected = selectedAreaId === area.id;
            return (
              <button
                key={area.id}
                onClick={() => setSelectedAreaId(isSelected ? null : area.id)}
                className={`text-left bg-white rounded-2xl p-5 border transition-all ${
                  isSelected
                    ? "border-trust-blue shadow-lg shadow-trust-blue/10"
                    : "border-neutral-100 hover:border-trust-blue/30 shadow-[0_4px_20px_rgb(0,0,0,0.04)]"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-2 h-2 rounded-full ${categoryColor[area.category] ?? "bg-neutral-400"}`} />
                  <Badge
                    variant="outline"
                    className={`text-[9px] font-bold border-none px-1.5 py-0 ${
                      area.status === "on-track" ? "bg-green-100 text-green-700" :
                      area.status === "warning"  ? "bg-amber-100 text-amber-700" :
                      "bg-red-100 text-red-700"
                    }`}
                  >
                    {area.status}
                  </Badge>
                </div>
                <p className="text-xs font-bold text-trust-dark mb-1 leading-tight">{area.name}</p>
                <p className="text-[10px] text-neutral-400 mb-3">{area.evidenceCount} evidence pieces</p>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[9px] font-bold text-neutral-400 uppercase">
                    <span>Executed</span>
                    <span className="text-trust-dark">{pct}%</span>
                  </div>
                  <Progress value={pct} className="h-1.5 bg-neutral-100" />
                </div>
                <div className="mt-3 flex justify-between">
                  <div>
                    <p className="text-[9px] text-neutral-400">Budget</p>
                    <p className="text-xs font-bold text-trust-dark">{fmt(area.totalBudget)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] text-neutral-400">Remaining</p>
                    <p className="text-xs font-bold text-trust-blue">{fmt(area.totalBudget - area.executed)}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Technical vs Financial Alignment */}
      <Card className="bg-white border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl overflow-hidden">
        <CardHeader className="p-8 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Alignment Analysis</p>
              <CardTitle className="text-xl font-bold text-trust-dark tracking-tighter">
                Technical vs. Financial Progress
              </CardTitle>
            </div>
            <Badge variant="outline" className="text-trust-blue border-trust-blue/20 bg-trust-blue/5 text-[9px] font-bold">
              LIVE SYNC
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-8 pt-4">
          <div className="space-y-5">
            {areas.map((area) => {
              const finPct = area.totalBudget ? Math.round((area.executed / area.totalBudget) * 100) : 0;
              const areaActs = state.activities.filter((a) => a.budgetAreaId === area.id);
              const techPct = areaActs.length
                ? Math.round(areaActs.reduce((s, a) => s + a.technicalProgress, 0) / areaActs.length)
                : 0;
              const delta = finPct - techPct;

              return (
                <div key={area.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${categoryColor[area.category] ?? "bg-neutral-400"}`} />
                      <span className="text-xs font-bold text-trust-dark">{area.name}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      Math.abs(delta) <= 10 ? "bg-green-100 text-green-700" :
                      delta > 10 ? "bg-amber-100 text-amber-700" :
                      "bg-red-100 text-red-700"
                    }`}>
                      {delta > 0 ? `+${delta}` : delta}pp gap
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] text-neutral-400 font-bold uppercase">
                        <span>Financial</span><span>{finPct}%</span>
                      </div>
                      <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                        <div className="h-full bg-trust-dark rounded-full transition-all" style={{ width: `${finPct}%` }} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] text-neutral-400 font-bold uppercase">
                        <span>Technical</span><span>{techPct}%</span>
                      </div>
                      <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                        <div className="h-full bg-trust-blue rounded-full transition-all" style={{ width: `${techPct}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-6 mt-6 pt-6 border-t border-neutral-100">
            <div className="flex items-center gap-2 text-[10px] font-bold text-neutral-500 uppercase">
              <div className="w-3 h-1 bg-trust-dark rounded-full" /> Financial
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-neutral-500 uppercase">
              <div className="w-3 h-1 bg-trust-blue rounded-full" /> Technical
            </div>
            <span className="ml-auto text-[10px] text-neutral-400">
              Gap &gt;10pp may indicate execution risk
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Activities */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold text-trust-dark uppercase tracking-[0.2em]">
          Activities {selectedAreaId && `— ${areas.find((a) => a.id === selectedAreaId)?.name}`}
        </h2>
        <Card className="bg-white border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl overflow-hidden">
          <Table>
            <TableHeader className="bg-neutral-50/50">
              <TableRow className="border-neutral-100 hover:bg-transparent">
                <TableHead className="h-11 px-6 text-[10px] font-bold uppercase tracking-wider w-[280px]">Activity</TableHead>
                <TableHead className="h-11 px-6 text-[10px] font-bold uppercase tracking-wider">Budget Area</TableHead>
                <TableHead className="h-11 px-6 text-[10px] font-bold uppercase tracking-wider">Status</TableHead>
                <TableHead className="h-11 px-6 text-[10px] font-bold uppercase tracking-wider">Budget</TableHead>
                <TableHead className="h-11 px-6 text-[10px] font-bold uppercase tracking-wider">Executed</TableHead>
                <TableHead className="h-11 px-6 text-[10px] font-bold uppercase tracking-wider">Tech. Progress</TableHead>
                <TableHead className="h-11 px-6 text-[10px] font-bold uppercase tracking-wider">Responsible</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredActivities.map((act) => {
                const area = areas.find((a) => a.id === act.budgetAreaId);
                const cfg = statusCfg[act.status] ?? statusCfg.not_started;
                return (
                  <TableRow key={act.id} className="border-neutral-100 hover:bg-neutral-50/30 transition-colors">
                    <TableCell className="px-6 py-4">
                      <p className="text-xs font-bold text-trust-dark">{act.name}</p>
                      <p className="text-[10px] text-neutral-400 mt-0.5 line-clamp-1">{act.description}</p>
                    </TableCell>
                    <TableCell className="px-6">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${categoryColor[area?.category ?? ""] ?? "bg-neutral-300"}`} />
                        <span className="text-[10px] font-medium text-neutral-600">{area?.name ?? "—"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-6">
                      <Badge variant="outline" className={`text-[9px] font-bold border-none px-2 py-0 ${cfg.cls}`}>
                        {cfg.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 text-xs font-medium text-neutral-600">{fmt(act.financialBudget)}</TableCell>
                    <TableCell className="px-6 text-xs font-bold text-trust-dark">{fmt(act.financialExecuted)}</TableCell>
                    <TableCell className="px-6">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                          <div className="h-full bg-trust-blue rounded-full" style={{ width: `${act.technicalProgress}%` }} />
                        </div>
                        <span className="text-[10px] font-bold text-trust-dark w-8 text-right">{act.technicalProgress}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 text-[10px] text-neutral-500 font-medium">{act.responsible}</TableCell>
                  </TableRow>
                );
              })}
              {filteredActivities.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="px-6 py-8 text-center text-xs text-neutral-400">
                    No activities for this filter.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Financial Movements */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-trust-dark uppercase tracking-[0.2em]">Financial Movements</h2>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-neutral-400 font-medium">
              {movementsForArea.filter((m) => !m.verified).length} pending verification
            </span>
          </div>
        </div>
        <Card className="bg-white border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl overflow-hidden">
          <Table>
            <TableHeader className="bg-neutral-50/50">
              <TableRow className="border-neutral-100 hover:bg-transparent">
                <TableHead className="h-11 px-6 text-[10px] font-bold uppercase tracking-wider">Date</TableHead>
                <TableHead className="h-11 px-6 text-[10px] font-bold uppercase tracking-wider w-[300px]">Description</TableHead>
                <TableHead className="h-11 px-6 text-[10px] font-bold uppercase tracking-wider">Vendor / Entity</TableHead>
                <TableHead className="h-11 px-6 text-[10px] font-bold uppercase tracking-wider">Type</TableHead>
                <TableHead className="h-11 px-6 text-[10px] font-bold uppercase tracking-wider text-right">Amount</TableHead>
                <TableHead className="h-11 px-6 text-[10px] font-bold uppercase tracking-wider">Evidence</TableHead>
                <TableHead className="h-11 px-6 text-[10px] font-bold uppercase tracking-wider">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movementsForArea
                .slice()
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((m) => (
                  <TableRow key={m.id} className="border-neutral-100 hover:bg-neutral-50/30 transition-colors">
                    <TableCell className="px-6 py-4 text-[10px] text-neutral-500 font-medium whitespace-nowrap">
                      {fmtDate(m.date)}
                    </TableCell>
                    <TableCell className="px-6">
                      <p className="text-xs font-medium text-trust-dark line-clamp-1">{m.description}</p>
                    </TableCell>
                    <TableCell className="px-6 text-[10px] text-neutral-500">{m.vendor}</TableCell>
                    <TableCell className="px-6">
                      <Badge
                        variant="outline"
                        className={`text-[9px] font-bold border-none px-2 py-0 ${
                          m.type === "income"   ? "bg-green-100 text-green-700" :
                          m.type === "expense"  ? "bg-neutral-100 text-neutral-600" :
                          "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {m.type}
                      </Badge>
                    </TableCell>
                    <TableCell className={`px-6 text-right text-xs font-bold ${
                      m.type === "income" ? "text-green-700" : "text-trust-dark"
                    }`}>
                      {m.type === "income" ? "+" : "−"}{fmt(m.amount)}
                    </TableCell>
                    <TableCell className="px-6">
                      {m.evidenceIds.length > 0 ? (
                        <span className="text-[10px] font-bold text-trust-blue">{m.evidenceIds.length} file(s)</span>
                      ) : (
                        <span className="text-[10px] font-bold text-red-500">Missing</span>
                      )}
                    </TableCell>
                    <TableCell className="px-6">
                      {m.verified ? (
                        <Badge variant="outline" className="text-[9px] font-bold border-none px-2 py-0 bg-green-100 text-green-700">
                          Verified
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[9px] font-bold border-none px-2 py-0 bg-amber-100 text-amber-700">
                          Pending
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
