"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useStore, EventType, Event } from "../../../../lib/store";
import { Button, Card, CardContent, Input, Label, Separator, Badge } from "@trustbid/ui";

const EVENT_TYPES: { value: EventType; label: string; icon: string; desc: string }[] = [
  { value: "fund_received",      label: "Fund Received",       icon: "◆", desc: "Grant or donation received" },
  { value: "expense_recorded",   label: "Expense Recorded",    icon: "◇", desc: "Payment or purchase made" },
  { value: "activity_started",   label: "Activity Started",    icon: "▶", desc: "New activity initiated" },
  { value: "activity_completed", label: "Activity Completed",  icon: "■", desc: "Activity milestone closed" },
  { value: "evidence_uploaded",  label: "Evidence Uploaded",   icon: "◉", desc: "Document or file attached" },
  { value: "milestone_reached",  label: "Milestone Reached",   icon: "★", desc: "Key project milestone achieved" },
  { value: "audit_request",      label: "Audit Request",       icon: "◐", desc: "Compliance or audit triggered" },
  { value: "payment_disbursed",  label: "Payment Disbursed",   icon: "◈", desc: "Funds sent to vendor or partner" },
  { value: "report_generated",   label: "Report Generated",    icon: "◑", desc: "Report compiled and shared" },
];

const VISIBILITY_OPTIONS = [
  { value: "public",     label: "Public",     desc: "Visible to all stakeholders" },
  { value: "donor_only", label: "Donor Only", desc: "Restricted to registered donors" },
  { value: "internal",   label: "Internal",   desc: "Team access only" },
];

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-1">
      {children}
      {required && <span className="text-red-400">*</span>}
    </label>
  );
}

export default function NewEventPage() {
  const { state, dispatch } = useStore();
  const router = useRouter();

  const [form, setForm] = useState({
    type:        "" as EventType | "",
    title:       "",
    description: "",
    projectId:   "",
    budgetAreaId:"",
    activityId:  "",
    amount:      "",
    actor:       "Jairo Amaya",
    date:        new Date().toISOString().split("T")[0],
    visibility:  "internal" as "public" | "donor_only" | "internal",
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors]       = useState<Partial<Record<keyof typeof form, string>>>({});

  const filteredAreas = useMemo(
    () => state.budgetAreas.filter((a) => a.projectId === form.projectId),
    [state.budgetAreas, form.projectId]
  );

  const filteredActivities = useMemo(
    () => state.activities.filter((a) => a.budgetAreaId === form.budgetAreaId),
    [state.activities, form.budgetAreaId]
  );

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "projectId") { next.budgetAreaId = ""; next.activityId = ""; }
      if (key === "budgetAreaId") { next.activityId = ""; }
      return next;
    });
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validate(): boolean {
    const errs: Partial<Record<keyof typeof form, string>> = {};
    if (!form.type)        errs.type        = "Select an event type";
    if (!form.title.trim()) errs.title       = "Title is required";
    if (!form.projectId)   errs.projectId   = "Select a project";
    if (!form.budgetAreaId) errs.budgetAreaId = "Select a budget area";
    if (!form.actor.trim()) errs.actor       = "Actor is required";
    if (!form.date)         errs.date        = "Date is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const newEvent: Event = {
      id:          `e${Date.now()}`,
      type:        form.type as EventType,
      title:       form.title.trim(),
      description: form.description.trim(),
      projectId:   form.projectId,
      budgetAreaId:form.budgetAreaId,
      activityId:  form.activityId,
      amount:      form.amount ? parseFloat(form.amount) : undefined,
      actor:       form.actor.trim(),
      date:        form.date,
      evidenceIds: [],
      visibility:  form.visibility,
      verified:    false,
      createdAt:   new Date().toISOString(),
    };

    dispatch({ type: "ADD_EVENT", payload: newEvent });
    setSubmitted(true);

    setTimeout(() => {
      router.push("/dashboard/traceability");
    }, 1200);
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto pt-16 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
          ★
        </div>
        <h2 className="text-2xl font-bold text-trust-dark tracking-tighter mb-2">Event Recorded</h2>
        <p className="text-sm text-neutral-500">
          The event has been added to the traceability chain. Redirecting to Traceability…
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">
            Fund Traceability
          </p>
          <h1 className="text-2xl font-bold text-trust-dark tracking-tighter">Record New Event</h1>
          <p className="text-sm text-neutral-500 mt-1">
            All recorded events are immutably logged to the traceability chain.
          </p>
        </div>
        <button
          onClick={() => router.back()}
          className="text-xs font-bold text-neutral-400 hover:text-trust-dark transition-colors"
        >
          ← Back
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main form */}
          <div className="lg:col-span-2 space-y-5">
            {/* Event Type */}
            <Card className="bg-white border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl overflow-hidden">
              <CardContent className="p-7">
                <FieldLabel required>Event Type</FieldLabel>
                {errors.type && <p className="text-[10px] text-red-500 mt-1">{errors.type}</p>}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 mt-3">
                  {EVENT_TYPES.map((et) => (
                    <button
                      key={et.value}
                      type="button"
                      onClick={() => set("type", et.value)}
                      className={`text-left p-3 rounded-xl border transition-all ${
                        form.type === et.value
                          ? "border-trust-blue bg-trust-blue/5 shadow-sm"
                          : "border-neutral-200 hover:border-neutral-300"
                      }`}
                    >
                      <span className="text-base block mb-1">{et.icon}</span>
                      <p className="text-[10px] font-bold text-trust-dark">{et.label}</p>
                      <p className="text-[9px] text-neutral-400 mt-0.5">{et.desc}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Core Info */}
            <Card className="bg-white border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl overflow-hidden">
              <CardContent className="p-7 space-y-5">
                <div className="space-y-2">
                  <FieldLabel required>Event Title</FieldLabel>
                  {errors.title && <p className="text-[10px] text-red-500">{errors.title}</p>}
                  <Input
                    value={form.title}
                    onChange={(e) => set("title", e.target.value)}
                    placeholder="e.g. Equipment Purchase – HydroTech Solutions"
                    className="bg-neutral-50 border-neutral-200 text-trust-dark placeholder:text-neutral-400 focus-visible:ring-trust-blue/20 focus-visible:border-trust-blue/40 rounded-xl h-11"
                  />
                </div>

                <div className="space-y-2">
                  <FieldLabel>Description</FieldLabel>
                  <textarea
                    value={form.description}
                    onChange={(e) => set("description", e.target.value)}
                    placeholder="Provide context about this event — what happened, why, and what it affects…"
                    rows={4}
                    className="w-full bg-neutral-50 border border-neutral-200 text-trust-dark placeholder:text-neutral-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-trust-blue/10 focus:border-trust-blue/40 transition-all resize-none"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Scope */}
            <Card className="bg-white border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl overflow-hidden">
              <CardContent className="p-7">
                <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-4">
                  Scope & Assignment
                </p>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Project */}
                    <div className="space-y-2">
                      <FieldLabel required>Project</FieldLabel>
                      {errors.projectId && <p className="text-[10px] text-red-500">{errors.projectId}</p>}
                      <select
                        value={form.projectId}
                        onChange={(e) => set("projectId", e.target.value)}
                        className="w-full bg-neutral-50 border border-neutral-200 text-trust-dark rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-trust-blue/10 focus:border-trust-blue/40"
                      >
                        <option value="">Select project…</option>
                        {state.projects.map((p) => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Budget Area */}
                    <div className="space-y-2">
                      <FieldLabel required>Budget Area</FieldLabel>
                      {errors.budgetAreaId && <p className="text-[10px] text-red-500">{errors.budgetAreaId}</p>}
                      <select
                        value={form.budgetAreaId}
                        onChange={(e) => set("budgetAreaId", e.target.value)}
                        disabled={!form.projectId}
                        className="w-full bg-neutral-50 border border-neutral-200 text-trust-dark rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-trust-blue/10 focus:border-trust-blue/40 disabled:opacity-40"
                      >
                        <option value="">Select budget area…</option>
                        {filteredAreas.map((a) => (
                          <option key={a.id} value={a.id}>{a.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Activity */}
                  <div className="space-y-2">
                    <FieldLabel>Activity</FieldLabel>
                    <select
                      value={form.activityId}
                      onChange={(e) => set("activityId", e.target.value)}
                      disabled={!form.budgetAreaId}
                      className="w-full bg-neutral-50 border border-neutral-200 text-trust-dark rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-trust-blue/10 focus:border-trust-blue/40 disabled:opacity-40"
                    >
                      <option value="">Select activity…</option>
                      {filteredActivities.map((a) => (
                        <option key={a.id} value={a.id}>{a.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right sidebar */}
          <div className="space-y-5">
            {/* Amount */}
            <Card className="bg-white border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl overflow-hidden">
              <CardContent className="p-6 space-y-5">
                <div className="space-y-2">
                  <FieldLabel>Amount (USD)</FieldLabel>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-neutral-400">$</span>
                    <Input
                      type="number"
                      value={form.amount}
                      onChange={(e) => set("amount", e.target.value)}
                      placeholder="0"
                      min="0"
                      step="0.01"
                      className="pl-7 bg-neutral-50 border-neutral-200 text-trust-dark placeholder:text-neutral-400 focus-visible:ring-trust-blue/20 focus-visible:border-trust-blue/40 rounded-xl h-11"
                    />
                  </div>
                  <p className="text-[10px] text-neutral-400">Optional – leave blank for non-financial events</p>
                </div>

                <Separator className="bg-neutral-100" />

                <div className="space-y-2">
                  <FieldLabel required>Actor / Responsible</FieldLabel>
                  {errors.actor && <p className="text-[10px] text-red-500">{errors.actor}</p>}
                  <Input
                    value={form.actor}
                    onChange={(e) => set("actor", e.target.value)}
                    placeholder="e.g. Finance Dept., Field Team"
                    className="bg-neutral-50 border-neutral-200 text-trust-dark placeholder:text-neutral-400 focus-visible:ring-trust-blue/20 focus-visible:border-trust-blue/40 rounded-xl h-11"
                  />
                </div>

                <div className="space-y-2">
                  <FieldLabel required>Event Date</FieldLabel>
                  {errors.date && <p className="text-[10px] text-red-500">{errors.date}</p>}
                  <Input
                    type="date"
                    value={form.date}
                    onChange={(e) => set("date", e.target.value)}
                    className="bg-neutral-50 border-neutral-200 text-trust-dark focus-visible:ring-trust-blue/20 focus-visible:border-trust-blue/40 rounded-xl h-11"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Visibility */}
            <Card className="bg-white border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl overflow-hidden">
              <CardContent className="p-6 space-y-3">
                <FieldLabel>Visibility</FieldLabel>
                {VISIBILITY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => set("visibility", opt.value as any)}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${
                      form.visibility === opt.value
                        ? "border-trust-blue bg-trust-blue/5"
                        : "border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    <p className={`text-xs font-bold ${form.visibility === opt.value ? "text-trust-blue" : "text-trust-dark"}`}>
                      {opt.label}
                    </p>
                    <p className="text-[10px] text-neutral-400 mt-0.5">{opt.desc}</p>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Evidence upload (UI only) */}
            <Card className="bg-white border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl overflow-hidden">
              <CardContent className="p-6">
                <FieldLabel>Attach Evidence</FieldLabel>
                <div className="mt-3 border-2 border-dashed border-neutral-200 rounded-xl p-6 text-center hover:border-trust-blue/30 transition-colors cursor-pointer">
                  <p className="text-2xl mb-2">◉</p>
                  <p className="text-xs font-bold text-neutral-500">Drop files here or click to upload</p>
                  <p className="text-[10px] text-neutral-400 mt-1">PDF, JPG, PNG · Max 25MB</p>
                </div>
                <p className="text-[10px] text-neutral-400 mt-2">
                  Evidence can also be linked after submission from the Evidence Library.
                </p>
              </CardContent>
            </Card>

            {/* Preview & Submit */}
            <Card className={`border rounded-2xl overflow-hidden transition-all ${
              form.type ? "bg-trust-blue border-trust-blue shadow-lg shadow-trust-blue/20" : "bg-neutral-100 border-neutral-200"
            }`}>
              <CardContent className="p-6">
                {form.type ? (
                  <div className="text-white space-y-3 mb-5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">Preview</p>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {EVENT_TYPES.find((t) => t.value === form.type)?.icon}
                      </span>
                      <p className="text-sm font-bold leading-tight">
                        {form.title || <span className="opacity-40">Untitled event</span>}
                      </p>
                    </div>
                    {form.amount && (
                      <p className="text-xl font-bold tracking-tighter">
                        ${parseFloat(form.amount).toLocaleString()}
                      </p>
                    )}
                    <div className="flex gap-2 flex-wrap">
                      {form.type && (
                        <Badge variant="outline" className="text-[9px] border border-white/20 bg-white/10 text-white">
                          {EVENT_TYPES.find((t) => t.value === form.type)?.label}
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-[9px] border border-white/20 bg-white/10 text-white">
                        {VISIBILITY_OPTIONS.find((o) => o.value === form.visibility)?.label}
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-neutral-400 mb-5">Select an event type to preview</p>
                )}

                <Button
                  type="submit"
                  variant="default"
                  className={`w-full h-12 font-bold rounded-xl transition-all ${
                    form.type
                      ? "bg-white text-trust-blue hover:bg-neutral-100"
                      : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                  }`}
                >
                  RECORD EVENT
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
