"use client";

import React, { useState, useMemo } from "react";
import { useStore, Evidence, EvidenceType } from "../../../lib/store";
import { Badge, Card, CardContent, Progress, Separator } from "@trustbid/ui";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

const fmtDate = (s: string) =>
  new Date(s).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const evidenceTypeMeta: Record<EvidenceType, { label: string; icon: string; color: string }> = {
  invoice:     { label: "Invoice",     icon: "◇", color: "bg-blue-100 text-blue-700" },
  receipt:     { label: "Receipt",     icon: "◉", color: "bg-green-100 text-green-700" },
  photo:       { label: "Photo",       icon: "◈", color: "bg-purple-100 text-purple-700" },
  contract:    { label: "Contract",    icon: "■", color: "bg-neutral-100 text-neutral-700" },
  report:      { label: "Report",      icon: "◑", color: "bg-indigo-100 text-indigo-700" },
  certificate: { label: "Certificate", icon: "★", color: "bg-amber-100 text-amber-700" },
};

const ALL_TYPES: EvidenceType[] = ["invoice", "receipt", "photo", "contract", "report", "certificate"];

export default function EvidencePage() {
  const { state } = useStore();
  const [typeFilter, setTypeFilter]         = useState<EvidenceType | "all">("all");
  const [verifiedFilter, setVerifiedFilter] = useState<"all" | "verified" | "unverified">("all");
  const [areaFilter, setAreaFilter]         = useState<string>("all");
  const [selected, setSelected]             = useState<Evidence | null>(null);
  const [search, setSearch]                 = useState("");

  const missingEvidence = useMemo(() => {
    const linkedIds = new Set(state.financialMovements.flatMap((m) => m.evidenceIds));
    return state.financialMovements.filter((m) => m.evidenceIds.length === 0);
  }, [state.financialMovements]);

  const filtered = useMemo(() => {
    let list = [...state.evidence];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((e) => e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q));
    }
    if (typeFilter !== "all")           list = list.filter((e) => e.type === typeFilter);
    if (verifiedFilter === "verified")   list = list.filter((e) => e.verified);
    if (verifiedFilter === "unverified") list = list.filter((e) => !e.verified);
    if (areaFilter !== "all")           list = list.filter((e) => e.budgetAreaId === areaFilter);
    return list;
  }, [state.evidence, typeFilter, verifiedFilter, areaFilter, search]);

  const coveragePct = state.evidence.length
    ? Math.round((state.evidence.filter((e) => e.verified).length / state.evidence.length) * 100)
    : 0;

  const selectedArea     = selected ? state.budgetAreas.find((a) => a.id === selected.budgetAreaId) : null;
  const selectedActivity = selected ? state.activities.find((a) => a.id === selected.activityId)   : null;
  const linkedEvents     = selected
    ? state.events.filter((e) => e.evidenceIds.includes(selected.id))
    : [];

  const areaOptions = Array.from(new Set(state.evidence.map((e) => e.budgetAreaId)))
    .map((id) => state.budgetAreas.find((a) => a.id === id))
    .filter(Boolean);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Missing Evidence Alerts */}
      {missingEvidence.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-100 rounded-xl flex items-center justify-center text-red-600 font-bold text-sm">!</div>
            <div>
              <p className="text-sm font-bold text-red-900">
                {missingEvidence.length} Financial Movement{missingEvidence.length > 1 ? "s" : ""} Without Evidence
              </p>
              <p className="text-xs text-red-600">
                These transactions require supporting documentation for compliance verification.
              </p>
            </div>
          </div>
          <div className="grid gap-2">
            {missingEvidence.map((m) => {
              const area = state.budgetAreas.find((a) => a.id === m.budgetAreaId);
              return (
                <div key={m.id} className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-red-100">
                  <div>
                    <p className="text-xs font-bold text-neutral-800">{m.description}</p>
                    <p className="text-[10px] text-neutral-500">{area?.name} · {m.vendor} · {fmt(m.amount)}</p>
                  </div>
                  <Badge variant="outline" className="text-[9px] font-bold border-none px-2 py-0 bg-red-100 text-red-700">
                    No Evidence
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Evidence",    value: state.evidence.length,                                  sub: "all files" },
          { label: "Verified",          value: state.evidence.filter((e) => e.verified).length,        sub: `${coveragePct}% coverage` },
          { label: "Pending Review",    value: state.evidence.filter((e) => !e.verified).length,       sub: "awaiting approval" },
          { label: "Missing",           value: missingEvidence.length,                                 sub: "movements without docs" },
        ].map((kpi) => (
          <Card key={kpi.label} className="bg-white border-neutral-100 shadow-[0_4px_20px_rgb(0,0,0,0.04)] rounded-2xl">
            <CardContent className="p-5">
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">{kpi.label}</p>
              <p className="text-2xl font-bold text-trust-dark tracking-tighter">{kpi.value}</p>
              <p className="text-[10px] text-neutral-400 mt-1">{kpi.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Coverage Bar */}
      <Card className="bg-white border-neutral-100 shadow-[0_4px_20px_rgb(0,0,0,0.04)] rounded-2xl">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-trust-dark">Evidence Coverage</p>
            <span className="text-xs font-bold text-trust-blue">{coveragePct}%</span>
          </div>
          <Progress value={coveragePct} className="h-2 bg-neutral-100" />
          <p className="text-[10px] text-neutral-400 mt-2">
            {state.evidence.filter((e) => e.verified).length} verified of {state.evidence.length} total pieces
          </p>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="bg-white border-neutral-100 shadow-[0_4px_20px_rgb(0,0,0,0.04)] rounded-2xl">
        <CardContent className="p-5 space-y-4">
          <div className="flex gap-3 flex-wrap">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search evidence…"
              className="flex-1 min-w-[200px] text-sm bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-trust-dark placeholder:text-neutral-400 focus:outline-none focus:border-trust-blue/40 focus:ring-2 focus:ring-trust-blue/10 transition-all"
            />
            <select
              value={verifiedFilter}
              onChange={(e) => setVerifiedFilter(e.target.value as any)}
              className="text-xs font-bold bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 text-neutral-600 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="verified">Verified</option>
              <option value="unverified">Pending</option>
            </select>
            <select
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
              className="text-xs font-bold bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 text-neutral-600 focus:outline-none"
            >
              <option value="all">All Areas</option>
              {areaOptions.map((a) => a && (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>

          {/* Type pills */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setTypeFilter("all")}
              className={`text-[10px] font-bold px-3 py-1.5 rounded-full border transition-all ${
                typeFilter === "all" ? "bg-trust-dark text-white border-trust-dark" : "border-neutral-200 text-neutral-500 hover:border-neutral-400"
              }`}
            >
              All Types
            </button>
            {ALL_TYPES.map((t) => {
              const meta = evidenceTypeMeta[t];
              const active = typeFilter === t;
              return (
                <button
                  key={t}
                  onClick={() => setTypeFilter(active ? "all" : t)}
                  className={`text-[10px] font-bold px-3 py-1.5 rounded-full border transition-all ${
                    active ? "bg-trust-blue text-white border-trust-blue" : "border-neutral-200 text-neutral-500 hover:border-neutral-300"
                  }`}
                >
                  {meta.icon} {meta.label}s
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Grid + Detail Panel */}
      <div className={`grid gap-6 ${selected ? "grid-cols-[1fr_380px]" : "grid-cols-1"}`}>
        {/* Evidence Grid */}
        <div>
          {filtered.length === 0 ? (
            <Card className="bg-white border-neutral-100 shadow-[0_4px_20px_rgb(0,0,0,0.04)] rounded-2xl">
              <CardContent className="p-16 text-center">
                <p className="text-3xl mb-3">◉</p>
                <p className="text-sm font-bold text-neutral-400">No evidence matches your filters</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((ev) => {
                const meta = evidenceTypeMeta[ev.type];
                const isSelected = selected?.id === ev.id;
                const area = state.budgetAreas.find((a) => a.id === ev.budgetAreaId);
                return (
                  <button
                    key={ev.id}
                    onClick={() => setSelected(isSelected ? null : ev)}
                    className={`text-left bg-white rounded-2xl p-5 border transition-all group ${
                      isSelected
                        ? "border-trust-blue shadow-lg shadow-trust-blue/10"
                        : "border-neutral-100 hover:border-trust-blue/30 shadow-[0_4px_20px_rgb(0,0,0,0.04)] hover:shadow-md"
                    }`}
                  >
                    {/* File type icon block */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-4 ${meta.color}`}>
                      {meta.icon}
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className={`text-[9px] font-bold border-none px-2 py-0 ${meta.color}`}>
                        {meta.label}
                      </Badge>
                      <span className="text-[9px] font-bold text-neutral-400">{ev.fileType}</span>
                    </div>

                    <p className="text-xs font-bold text-trust-dark leading-snug mb-1 line-clamp-2">
                      {ev.title}
                    </p>
                    <p className="text-[10px] text-neutral-400 line-clamp-2 mb-3">
                      {ev.description}
                    </p>

                    <div className="border-t border-neutral-100 pt-3 flex items-center justify-between">
                      <span className="text-[10px] text-neutral-400">{fmtDate(ev.uploadedAt)}</span>
                      {ev.verified ? (
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          <span className="text-[9px] font-bold text-green-600">Verified</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          <span className="text-[9px] font-bold text-amber-600">Pending</span>
                        </div>
                      )}
                    </div>

                    {area && (
                      <p className="text-[10px] text-neutral-400 mt-2 truncate">{area.name}</p>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Detail Panel */}
        {selected && (
          <div className="sticky top-0">
            <Card className="bg-white border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl overflow-hidden">
              <CardContent className="p-7">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${evidenceTypeMeta[selected.type].color}`}>
                    {evidenceTypeMeta[selected.type].icon}
                  </div>
                  <button onClick={() => setSelected(null)} className="text-neutral-400 hover:text-neutral-600 text-lg">×</button>
                </div>

                <Badge variant="outline" className={`text-[9px] font-bold border-none px-2 py-0 mb-3 ${evidenceTypeMeta[selected.type].color}`}>
                  {evidenceTypeMeta[selected.type].label}
                </Badge>

                <h3 className="text-sm font-bold text-trust-dark tracking-tight leading-snug mb-2">
                  {selected.title}
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed mb-5">{selected.description}</p>

                <Separator className="bg-neutral-100 mb-5" />

                <div className="space-y-3">
                  {[
                    { label: "File Type",    value: selected.fileType },
                    { label: "Uploaded By",  value: selected.uploadedBy },
                    { label: "Upload Date",  value: fmtDate(selected.uploadedAt) },
                    { label: "Budget Area",  value: selectedArea?.name ?? "—" },
                    { label: "Activity",     value: selectedActivity?.name ?? "—" },
                    ...(selected.amount ? [{ label: "Amount", value: fmt(selected.amount) }] : []),
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">{label}</span>
                      <span className="text-xs font-bold text-trust-dark text-right">{value}</span>
                    </div>
                  ))}
                </div>

                <Separator className="bg-neutral-100 my-5" />

                {/* Verification */}
                <div className={`flex items-center gap-3 p-3 rounded-xl mb-5 ${
                  selected.verified ? "bg-green-50 border border-green-100" : "bg-amber-50 border border-amber-100"
                }`}>
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${selected.verified ? "bg-green-500" : "bg-amber-500"}`} />
                  <div>
                    <p className={`text-xs font-bold ${selected.verified ? "text-green-700" : "text-amber-700"}`}>
                      {selected.verified ? "Verified & Immutable" : "Pending Verification"}
                    </p>
                    <p className={`text-[10px] ${selected.verified ? "text-green-600" : "text-amber-600"}`}>
                      {selected.verified ? "Hash registered on-chain" : "Under review"}
                    </p>
                  </div>
                </div>

                {/* Linked Events */}
                {linkedEvents.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-3">
                      Linked Events ({linkedEvents.length})
                    </p>
                    <div className="space-y-2">
                      {linkedEvents.map((e) => (
                        <div key={e.id} className="flex items-center gap-2 p-2.5 bg-neutral-50 rounded-xl border border-neutral-100">
                          <span className="text-xs">{evidenceTypeMeta["report"].icon}</span>
                          <p className="text-[10px] font-bold text-trust-dark line-clamp-1 flex-1">{e.title}</p>
                          <span className="text-[9px] text-neutral-400">{fmtDate(e.date)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
