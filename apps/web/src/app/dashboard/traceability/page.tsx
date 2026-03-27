"use client";

import React, { useState, useMemo } from "react";
import { useStore, Event, EventType } from "../../../lib/store";
import { Badge, Card, CardContent, Separator } from "@trustbid/ui";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

const fmtDate = (s: string) =>
  new Date(s).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const fmtDateTime = (s: string) =>
  new Date(s).toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

const eventTypeMeta: Record<EventType, { label: string; icon: string; color: string }> = {
  fund_received:      { label: "Fund Received",       icon: "◆", color: "bg-green-100 text-green-700 border-green-200" },
  expense_recorded:   { label: "Expense Recorded",    icon: "◇", color: "bg-neutral-100 text-neutral-600 border-neutral-200" },
  activity_started:   { label: "Activity Started",    icon: "▶", color: "bg-blue-100 text-blue-700 border-blue-200" },
  activity_completed: { label: "Activity Completed",  icon: "■", color: "bg-green-100 text-green-700 border-green-200" },
  evidence_uploaded:  { label: "Evidence Uploaded",   icon: "◉", color: "bg-purple-100 text-purple-700 border-purple-200" },
  milestone_reached:  { label: "Milestone Reached",   icon: "★", color: "bg-trust-blue/10 text-trust-blue border-trust-blue/20" },
  audit_request:      { label: "Audit Request",       icon: "◐", color: "bg-amber-100 text-amber-700 border-amber-200" },
  payment_disbursed:  { label: "Payment Disbursed",   icon: "◈", color: "bg-neutral-100 text-neutral-600 border-neutral-200" },
  report_generated:   { label: "Report Generated",    icon: "◑", color: "bg-indigo-100 text-indigo-700 border-indigo-200" },
};

const ALL_TYPES: EventType[] = [
  "fund_received", "expense_recorded", "activity_started", "activity_completed",
  "evidence_uploaded", "milestone_reached", "audit_request", "payment_disbursed", "report_generated",
];

const visibilityMeta: Record<string, { label: string; cls: string }> = {
  public:     { label: "Public",     cls: "bg-green-100 text-green-700" },
  donor_only: { label: "Donor Only", cls: "bg-blue-100 text-blue-700" },
  internal:   { label: "Internal",   cls: "bg-neutral-100 text-neutral-600" },
};

export default function TraceabilityPage() {
  const { state } = useStore();
  const [search, setSearch]         = useState("");
  const [typeFilter, setTypeFilter] = useState<EventType | "all">("all");
  const [verifiedFilter, setVerifiedFilter] = useState<"all" | "verified" | "unverified">("all");
  const [selected, setSelected]     = useState<Event | null>(null);
  const [sort, setSort]             = useState<"newest" | "oldest">("newest");

  const filtered = useMemo(() => {
    let list = [...state.events];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (e) => e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q)
      );
    }
    if (typeFilter !== "all") list = list.filter((e) => e.type === typeFilter);
    if (verifiedFilter === "verified")   list = list.filter((e) => e.verified);
    if (verifiedFilter === "unverified") list = list.filter((e) => !e.verified);
    list.sort((a, b) => {
      const diff = new Date(b.date).getTime() - new Date(a.date).getTime();
      return sort === "newest" ? diff : -diff;
    });
    return list;
  }, [state.events, search, typeFilter, verifiedFilter, sort]);

  const selectedProject  = selected ? state.projects.find((p) => p.id === selected.projectId)    : null;
  const selectedArea     = selected ? state.budgetAreas.find((a) => a.id === selected.budgetAreaId) : null;
  const selectedActivity = selected ? state.activities.find((a) => a.id === selected.activityId)  : null;
  const selectedEvidence = selected
    ? state.evidence.filter((e) => selected.evidenceIds.includes(e.id))
    : [];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Summary Strip */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Events",    value: state.events.length },
          { label: "Verified",        value: state.events.filter((e) => e.verified).length },
          { label: "Pending Review",  value: state.events.filter((e) => !e.verified).length },
          { label: "Evidence Linked", value: state.events.reduce((s, e) => s + e.evidenceIds.length, 0) },
        ].map((kpi) => (
          <Card key={kpi.label} className="bg-white border-neutral-100 shadow-[0_4px_20px_rgb(0,0,0,0.04)] rounded-2xl">
            <CardContent className="p-5">
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">{kpi.label}</p>
              <p className="text-2xl font-bold text-trust-dark tracking-tighter">{kpi.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="bg-white border-neutral-100 shadow-[0_4px_20px_rgb(0,0,0,0.04)] rounded-2xl">
        <CardContent className="p-5 space-y-4">
          <div className="flex gap-3 flex-wrap items-center">
            <div className="flex-1 min-w-[200px]">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search events by title or description…"
                className="w-full text-sm bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-trust-dark placeholder:text-neutral-400 focus:outline-none focus:border-trust-blue/40 focus:ring-2 focus:ring-trust-blue/10 transition-all"
              />
            </div>
            <select
              value={verifiedFilter}
              onChange={(e) => setVerifiedFilter(e.target.value as any)}
              className="text-xs font-bold bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 text-neutral-600 focus:outline-none focus:border-trust-blue/40"
            >
              <option value="all">All Statuses</option>
              <option value="verified">Verified</option>
              <option value="unverified">Pending</option>
            </select>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as any)}
              className="text-xs font-bold bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 text-neutral-600 focus:outline-none focus:border-trust-blue/40"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

          {/* Type pills */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setTypeFilter("all")}
              className={`text-[10px] font-bold px-3 py-1.5 rounded-full border transition-all ${
                typeFilter === "all"
                  ? "bg-trust-dark text-white border-trust-dark"
                  : "border-neutral-200 text-neutral-500 hover:border-neutral-400"
              }`}
            >
              All Types
            </button>
            {ALL_TYPES.map((t) => {
              const meta = eventTypeMeta[t];
              const active = typeFilter === t;
              return (
                <button
                  key={t}
                  onClick={() => setTypeFilter(active ? "all" : t)}
                  className={`text-[10px] font-bold px-3 py-1.5 rounded-full border transition-all ${
                    active ? "bg-trust-blue text-white border-trust-blue" : "border-neutral-200 text-neutral-500 hover:border-neutral-300"
                  }`}
                >
                  {meta.icon} {meta.label}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Timeline + Detail Panel */}
      <div className={`grid gap-6 ${selected ? "grid-cols-[1fr_380px]" : "grid-cols-1"}`}>
        {/* Timeline */}
        <Card className="bg-white border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl overflow-hidden">
          <CardContent className="p-8">
            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-3xl mb-3">◇</p>
                <p className="text-sm font-bold text-neutral-400">No events match your filters</p>
              </div>
            ) : (
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-5 top-6 bottom-6 w-px bg-neutral-100" />

                <div className="space-y-0">
                  {filtered.map((event, idx) => {
                    const meta = eventTypeMeta[event.type];
                    const isSelected = selected?.id === event.id;
                    return (
                      <div key={event.id} className={`relative flex gap-5 ${idx < filtered.length - 1 ? "pb-6" : ""}`}>
                        {/* Dot */}
                        <div className={`relative z-10 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                          isSelected
                            ? "bg-trust-blue text-white shadow-lg shadow-trust-blue/30"
                            : event.verified
                            ? "bg-trust-dark text-white"
                            : "bg-neutral-200 text-neutral-500"
                        }`}>
                          {meta.icon}
                        </div>

                        {/* Card */}
                        <button
                          onClick={() => setSelected(isSelected ? null : event)}
                          className={`flex-1 text-left p-5 rounded-2xl border transition-all ${
                            isSelected
                              ? "border-trust-blue bg-trust-blue/5 shadow-sm"
                              : "border-neutral-100 hover:border-trust-blue/30 hover:shadow-sm bg-white"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1.5">
                                <Badge variant="outline" className={`text-[9px] font-bold border px-2 py-0 ${meta.color}`}>
                                  {meta.label}
                                </Badge>
                                <Badge variant="outline" className={`text-[9px] font-bold border-none px-2 py-0 ${visibilityMeta[event.visibility].cls}`}>
                                  {visibilityMeta[event.visibility].label}
                                </Badge>
                                {!event.verified && (
                                  <Badge variant="outline" className="text-[9px] font-bold border-none px-2 py-0 bg-amber-100 text-amber-700">
                                    Pending
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm font-bold text-trust-dark leading-tight">{event.title}</p>
                            </div>
                            <span className="text-[10px] text-neutral-400 whitespace-nowrap font-medium">
                              {fmtDate(event.date)}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-500 line-clamp-2 mb-3">{event.description}</p>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] text-neutral-400">by <span className="font-bold text-neutral-600">{event.actor}</span></span>
                            {event.amount && (
                              <span className={`text-[10px] font-bold ${event.type === "fund_received" ? "text-green-600" : "text-neutral-600"}`}>
                                {event.type === "fund_received" ? "+" : "−"}{fmt(event.amount)}
                              </span>
                            )}
                            {event.evidenceIds.length > 0 && (
                              <span className="text-[10px] font-bold text-trust-blue ml-auto">
                                {event.evidenceIds.length} evidence
                              </span>
                            )}
                          </div>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Detail Panel */}
        {selected && (
          <div className="space-y-4">
            <Card className="bg-white border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl overflow-hidden sticky top-0">
              <CardContent className="p-7">
                <div className="flex items-start justify-between mb-4">
                  <Badge variant="outline" className={`text-[9px] font-bold border px-2.5 py-1 ${eventTypeMeta[selected.type].color}`}>
                    {eventTypeMeta[selected.type].icon} {eventTypeMeta[selected.type].label}
                  </Badge>
                  <button
                    onClick={() => setSelected(null)}
                    className="text-neutral-400 hover:text-neutral-600 text-lg leading-none"
                  >
                    ×
                  </button>
                </div>

                <h3 className="text-base font-bold text-trust-dark tracking-tight leading-snug mb-2">
                  {selected.title}
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed mb-5">{selected.description}</p>

                <Separator className="bg-neutral-100 mb-5" />

                <div className="space-y-3">
                  {[
                    { label: "Event Date",   value: fmtDate(selected.date) },
                    { label: "Recorded",     value: fmtDateTime(selected.createdAt) },
                    { label: "Actor",        value: selected.actor },
                    { label: "Project",      value: selectedProject?.name ?? "—" },
                    { label: "Budget Area",  value: selectedArea?.name ?? "—" },
                    { label: "Activity",     value: selectedActivity?.name ?? "—" },
                    { label: "Visibility",   value: visibilityMeta[selected.visibility].label },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-start">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">{label}</span>
                      <span className="text-xs font-bold text-trust-dark text-right max-w-[55%]">{value}</span>
                    </div>
                  ))}
                  {selected.amount && (
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Amount</span>
                      <span className={`text-sm font-bold ${selected.type === "fund_received" ? "text-green-600" : "text-trust-dark"}`}>
                        {selected.type === "fund_received" ? "+" : "−"}{fmt(selected.amount)}
                      </span>
                    </div>
                  )}
                </div>

                <Separator className="bg-neutral-100 my-5" />

                {/* Verification status */}
                <div className={`flex items-center gap-3 p-3 rounded-xl ${
                  selected.verified ? "bg-green-50 border border-green-100" : "bg-amber-50 border border-amber-100"
                }`}>
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${selected.verified ? "bg-green-500" : "bg-amber-500"}`} />
                  <div>
                    <p className={`text-xs font-bold ${selected.verified ? "text-green-700" : "text-amber-700"}`}>
                      {selected.verified ? "Verified & Immutable" : "Pending Verification"}
                    </p>
                    <p className={`text-[10px] ${selected.verified ? "text-green-600" : "text-amber-600"}`}>
                      {selected.verified ? "Registered on-chain" : "Under review by audit team"}
                    </p>
                  </div>
                </div>

                {/* Evidence */}
                {selectedEvidence.length > 0 && (
                  <div className="mt-5">
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-3">
                      Linked Evidence ({selectedEvidence.length})
                    </p>
                    <div className="space-y-2">
                      {selectedEvidence.map((ev) => (
                        <div key={ev.id} className="flex items-center gap-3 p-2.5 bg-neutral-50 rounded-xl border border-neutral-100">
                          <span className="text-base">◉</span>
                          <div className="flex-1 overflow-hidden">
                            <p className="text-[10px] font-bold text-trust-dark truncate">{ev.title}</p>
                            <p className="text-[9px] text-neutral-400">{ev.fileType} · {ev.uploadedBy}</p>
                          </div>
                          {ev.verified ? (
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          ) : (
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selected.evidenceIds.length === 0 && (
                  <div className="mt-5 p-3 bg-red-50 border border-red-100 rounded-xl">
                    <p className="text-[10px] font-bold text-red-600">No evidence attached to this event</p>
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
