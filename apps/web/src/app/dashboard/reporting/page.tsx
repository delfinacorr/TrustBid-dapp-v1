"use client";

import React, { useState, useMemo } from "react";
import { useStore } from "../../../lib/store";
import { Badge, Card, CardContent, CardHeader, CardTitle, Progress, Separator, Button } from "@trustbid/ui";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

interface ReportCard {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  completeness: number;
  status: "ready" | "in_progress" | "blocked";
  lastUpdated: string;
  blockers: string[];
}

export default function ReportingPage() {
  const { state } = useStore();
  const [generated, setGenerated] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<ReportCard | null>(null);

  // Compute readiness from actual store data
  const evidenceCoverage = useMemo(() => {
    if (!state.evidence.length) return 0;
    return Math.round((state.evidence.filter((e) => e.verified).length / state.evidence.length) * 100);
  }, [state.evidence]);

  const activityCompletion = useMemo(() => {
    if (!state.activities.length) return 0;
    return Math.round(
      state.activities.reduce((s, a) => s + a.technicalProgress, 0) / state.activities.length
    );
  }, [state.activities]);

  const financialVerification = useMemo(() => {
    if (!state.financialMovements.length) return 0;
    return Math.round(
      (state.financialMovements.filter((m) => m.verified).length / state.financialMovements.length) * 100
    );
  }, [state.financialMovements]);

  const pendingEvents = state.events.filter((e) => !e.verified).length;
  const missingEvidence = state.financialMovements.filter((m) => m.evidenceIds.length === 0).length;

  const overallReadiness = Math.round(
    (evidenceCoverage * 0.35 + activityCompletion * 0.35 + financialVerification * 0.30)
  );

  const reportCards: ReportCard[] = [
    {
      id: "executive",
      title: "Executive Summary",
      subtitle: "High-level overview for leadership",
      icon: "◆",
      completeness: Math.min(97, overallReadiness + 12),
      status: overallReadiness > 85 ? "ready" : "in_progress",
      lastUpdated: "Mar 20, 2026",
      blockers: [
        "Q3 audit pending closure",
      ],
    },
    {
      id: "financial",
      title: "Financial Report",
      subtitle: "Full expenditure and budget analysis",
      icon: "◇",
      completeness: financialVerification,
      status: financialVerification < 85 ? "blocked" : "in_progress",
      lastUpdated: "Mar 18, 2026",
      blockers: [
        `${missingEvidence} movement(s) without supporting evidence`,
        `${state.financialMovements.filter((m) => !m.verified).length} transactions pending verification`,
        "Fleet Services Q2 compliance review outstanding",
      ].filter((_, i) => i < (missingEvidence > 0 ? 3 : 1)),
    },
    {
      id: "activity",
      title: "Activity Report",
      subtitle: "Technical progress per milestone",
      icon: "◑",
      completeness: activityCompletion,
      status: activityCompletion < 70 ? "in_progress" : "ready",
      lastUpdated: "Mar 22, 2026",
      blockers: [
        "Technical Training Module 4 completion pending",
        "Phase 2 Field Surveys at 35% — below threshold",
      ],
    },
    {
      id: "donor",
      title: "Donor Report — UN-HABITAT",
      subtitle: "Transparency package for primary donor",
      icon: "★",
      completeness: Math.min(95, evidenceCoverage + 3),
      status: evidenceCoverage > 88 ? "ready" : "in_progress",
      lastUpdated: "Mar 25, 2026",
      blockers: [
        "Training Q2 invoice verification pending",
      ],
    },
  ];

  const allBlockers = [
    {
      severity: "high" as const,
      area: "Financial",
      description: `${missingEvidence} financial movements without supporting evidence documentation`,
      impact: "Blocks Financial Report generation",
    },
    {
      severity: "medium" as const,
      area: "Compliance",
      description: "Fleet Services Q2 payment ($78,000) under compliance review — FleetPro Services",
      impact: "Delays donor reporting",
    },
    {
      severity: "medium" as const,
      area: "Evidence",
      description: "Training Q2 invoice and photo documentation pending auditor verification",
      impact: "Reduces evidence coverage by ~8pp",
    },
    {
      severity: "low" as const,
      area: "Technical",
      description: `${pendingEvents} events not yet verified and registered`,
      impact: "May affect traceability completeness score",
    },
  ];

  const severityConfig = {
    high:   { cls: "bg-red-100 text-red-700",    dot: "bg-red-500",    label: "High" },
    medium: { cls: "bg-amber-100 text-amber-700", dot: "bg-amber-500",  label: "Medium" },
    low:    { cls: "bg-neutral-100 text-neutral-600", dot: "bg-neutral-400", label: "Low" },
  };

  const statusConfig = {
    ready:       { label: "Ready",       cls: "bg-green-100 text-green-700" },
    in_progress: { label: "In Progress", cls: "bg-trust-blue/10 text-trust-blue" },
    blocked:     { label: "Blocked",     cls: "bg-red-100 text-red-700" },
  };

  function handleGenerate(reportId: string) {
    setGenerated(reportId);
    setTimeout(() => setGenerated(null), 3000);
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Readiness Score */}
      <Card className="bg-trust-dark text-white border-none shadow-2xl rounded-3xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-trust-blue/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/3 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
        <CardContent className="p-10 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Big score */}
            <div className="flex flex-col justify-center">
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.25em] mb-4">
                Overall Reporting Readiness
              </p>
              <div className="flex items-end gap-4 mb-4">
                <span className="text-7xl font-bold tracking-tighter leading-none">{overallReadiness}</span>
                <span className="text-3xl text-white/40 pb-2">/ 100</span>
              </div>
              <Progress value={overallReadiness} className="h-2 bg-white/10 mb-3" />
              <p className="text-xs text-white/40">
                {overallReadiness >= 90 ? "Excellent — ready to generate all reports" :
                 overallReadiness >= 75 ? "Good — minor blockers remain" :
                 overallReadiness >= 60 ? "Fair — several items need attention" :
                 "Attention required before generating reports"}
              </p>
            </div>

            {/* Breakdown */}
            <div className="lg:col-span-2 grid grid-cols-3 gap-6 items-center">
              {[
                { label: "Evidence Coverage",      value: evidenceCoverage, desc: "Verified docs", weight: "35%" },
                { label: "Activity Completion",    value: activityCompletion, desc: "Tech. progress", weight: "35%" },
                { label: "Financial Verification", value: financialVerification, desc: "Verified movements", weight: "30%" },
              ].map((item) => (
                <div key={item.label} className="bg-white/5 rounded-2xl p-5 border border-white/10">
                  <div className="flex items-start justify-between mb-3">
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider leading-tight">
                      {item.label}
                    </p>
                    <span className="text-[9px] text-white/20 font-bold">{item.weight}</span>
                  </div>
                  <p className="text-3xl font-bold tracking-tighter mb-2">{item.value}%</p>
                  <Progress value={item.value} className="h-1.5 bg-white/10 mb-2" />
                  <p className="text-[10px] text-white/30">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Cards */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold text-trust-dark uppercase tracking-[0.2em]">Report Templates</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {reportCards.map((report) => {
            const sCfg = statusConfig[report.status];
            const isGenerating = generated === report.id;
            return (
              <Card
                key={report.id}
                onClick={() => setSelectedReport(selectedReport?.id === report.id ? null : report)}
                className={`bg-white border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl overflow-hidden cursor-pointer transition-all ${
                  selectedReport?.id === report.id ? "border-trust-blue shadow-trust-blue/10 shadow-lg" : "hover:border-trust-blue/30"
                }`}
              >
                <CardContent className="p-7">
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-neutral-50 rounded-xl flex items-center justify-center text-xl text-trust-dark">
                        {report.icon}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-trust-dark">{report.title}</h3>
                        <p className="text-[10px] text-neutral-400 mt-0.5">{report.subtitle}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className={`text-[9px] font-bold border-none px-2 py-0 ${sCfg.cls}`}>
                      {sCfg.label}
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-5">
                    <div className="flex justify-between text-[10px] font-bold uppercase text-neutral-400">
                      <span>Completeness</span>
                      <span className="text-trust-dark">{report.completeness}%</span>
                    </div>
                    <Progress value={report.completeness} className="h-2 bg-neutral-100" />
                  </div>

                  {report.blockers.length > 0 && (
                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 mb-5">
                      <p className="text-[9px] font-bold text-amber-700 uppercase tracking-wider mb-2">
                        {report.blockers.length} Blocker{report.blockers.length > 1 ? "s" : ""}
                      </p>
                      {report.blockers.slice(0, 2).map((b, i) => (
                        <p key={i} className="text-[10px] text-amber-700 leading-relaxed">{b}</p>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-neutral-400">Updated {report.lastUpdated}</span>
                    <Button
                      onClick={(e) => { e.stopPropagation(); handleGenerate(report.id); }}
                      variant={report.status === "blocked" ? "outline" : "default"}
                      className={`h-8 px-4 text-[10px] font-bold rounded-lg transition-all ${
                        report.status === "blocked"
                          ? "border-neutral-200 text-neutral-400"
                          : isGenerating
                          ? "bg-green-600 text-white"
                          : "bg-trust-blue text-white hover:bg-trust-blue/90"
                      }`}
                      disabled={report.status === "blocked"}
                    >
                      {isGenerating ? "✓ Queued" : report.status === "blocked" ? "BLOCKED" : "GENERATE"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Blockers */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-trust-dark uppercase tracking-[0.2em]">Active Blockers</h2>
          <span className="text-[10px] text-neutral-400 font-medium">
            {allBlockers.filter((b) => b.severity === "high").length} high severity
          </span>
        </div>
        <Card className="bg-white border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl overflow-hidden">
          <CardContent className="p-0">
            {allBlockers.map((blocker, idx) => {
              const cfg = severityConfig[blocker.severity];
              return (
                <div key={idx}>
                  <div className="flex items-start gap-4 p-6">
                    <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className={`text-[9px] font-bold border-none px-2 py-0 ${cfg.cls}`}>
                          {cfg.label}
                        </Badge>
                        <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                          {blocker.area}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-trust-dark mb-1">{blocker.description}</p>
                      <p className="text-[10px] text-neutral-400">{blocker.impact}</p>
                    </div>
                    <button className="text-[10px] font-bold text-trust-blue hover:underline whitespace-nowrap">
                      RESOLVE →
                    </button>
                  </div>
                  {idx < allBlockers.length - 1 && <Separator className="bg-neutral-100 mx-6" />}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Master Generate */}
      <Card className="bg-white border-trust-blue/20 shadow-[0_8px_30px_rgb(11,40,254,0.05)] rounded-2xl overflow-hidden">
        <CardContent className="p-7 flex items-center justify-between gap-6">
          <div>
            <h3 className="text-sm font-bold text-trust-dark mb-1">Generate Full Transparency Package</h3>
            <p className="text-xs text-neutral-500">
              Compiles all available reports into a single PDF package for donors, auditors, and stakeholders.
              Current readiness: <span className="font-bold text-trust-blue">{overallReadiness}%</span>
            </p>
          </div>
          <Button
            onClick={() => handleGenerate("full")}
            variant="default"
            className={`flex-shrink-0 h-12 px-8 font-bold rounded-xl transition-all ${
              generated === "full"
                ? "bg-green-600 text-white"
                : "bg-trust-blue text-white hover:bg-trust-blue/90 hover:shadow-lg hover:shadow-trust-blue/20"
            }`}
          >
            {generated === "full" ? "✓ Package Queued" : "GENERATE PACKAGE"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
