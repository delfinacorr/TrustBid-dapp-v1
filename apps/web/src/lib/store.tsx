"use client";

import React, { createContext, useContext, useReducer, ReactNode } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

export type EventType =
  | "fund_received"
  | "expense_recorded"
  | "activity_started"
  | "activity_completed"
  | "evidence_uploaded"
  | "milestone_reached"
  | "audit_request"
  | "payment_disbursed"
  | "report_generated";

export type EvidenceType = "invoice" | "receipt" | "photo" | "contract" | "report" | "certificate";
export type ActivityStatus = "completed" | "in_progress" | "pending" | "not_started";
export type BudgetAreaCategory = "operations" | "field" | "training" | "logistics" | "admin";

export interface Project {
  id: string;
  name: string;
  donor: string;
  totalBudget: number;
  startDate: string;
  endDate: string;
  phase: string;
  description: string;
}

export interface BudgetArea {
  id: string;
  projectId: string;
  name: string;
  category: BudgetAreaCategory;
  totalBudget: number;
  executed: number;
  evidenceCount: number;
  status: "on-track" | "warning" | "alert";
}

export interface Activity {
  id: string;
  budgetAreaId: string;
  projectId: string;
  name: string;
  description: string;
  status: ActivityStatus;
  startDate: string;
  endDate: string;
  technicalProgress: number;
  financialBudget: number;
  financialExecuted: number;
  responsible: string;
}

export interface FinancialMovement {
  id: string;
  budgetAreaId: string;
  activityId: string;
  type: "income" | "expense" | "transfer";
  amount: number;
  date: string;
  description: string;
  vendor: string;
  evidenceIds: string[];
  verified: boolean;
}

export interface Evidence {
  id: string;
  type: EvidenceType;
  title: string;
  description: string;
  fileType: string;
  uploadedBy: string;
  uploadedAt: string;
  activityId: string;
  budgetAreaId: string;
  projectId: string;
  verified: boolean;
  amount?: number;
}

export interface Event {
  id: string;
  type: EventType;
  title: string;
  description: string;
  projectId: string;
  budgetAreaId: string;
  activityId: string;
  amount?: number;
  actor: string;
  date: string;
  evidenceIds: string[];
  visibility: "public" | "donor_only" | "internal";
  verified: boolean;
  createdAt: string;
}

export interface AppState {
  projects: Project[];
  budgetAreas: BudgetArea[];
  activities: Activity[];
  financialMovements: FinancialMovement[];
  evidence: Evidence[];
  events: Event[];
}

type Action =
  | { type: "ADD_EVENT"; payload: Event }
  | { type: "ADD_EVIDENCE"; payload: Evidence };

// ─── Mock Data ───────────────────────────────────────────────────────────────

const initialState: AppState = {
  projects: [
    {
      id: "p1",
      name: "Clean Water Initiative",
      donor: "UN-HABITAT",
      totalBudget: 1240000,
      startDate: "2025-01-15",
      endDate: "2026-06-30",
      phase: "Phase 2",
      description: "Community water access infrastructure and technical training for 12 municipalities.",
    },
    {
      id: "p2",
      name: "Digital Literacy Program",
      donor: "UNICEF",
      totalBudget: 450000,
      startDate: "2025-06-01",
      endDate: "2026-03-31",
      phase: "Phase 1",
      description: "Digital skills training and infrastructure deployment for underserved communities.",
    },
  ],

  budgetAreas: [
    { id: "ba1", projectId: "p1", name: "Field Operations", category: "field", totalBudget: 500000, executed: 320000, evidenceCount: 24, status: "on-track" },
    { id: "ba2", projectId: "p1", name: "Technical Training", category: "training", totalBudget: 250000, executed: 120000, evidenceCount: 12, status: "on-track" },
    { id: "ba3", projectId: "p1", name: "Logistics & Supply", category: "logistics", totalBudget: 300000, executed: 280000, evidenceCount: 45, status: "warning" },
    { id: "ba4", projectId: "p1", name: "Admin & Governance", category: "admin", totalBudget: 190000, executed: 122500, evidenceCount: 8, status: "on-track" },
    { id: "ba5", projectId: "p2", name: "Program Operations", category: "operations", totalBudget: 200000, executed: 87000, evidenceCount: 11, status: "on-track" },
    { id: "ba6", projectId: "p2", name: "Field Deployment", category: "field", totalBudget: 250000, executed: 145000, evidenceCount: 19, status: "on-track" },
  ],

  activities: [
    { id: "a1", budgetAreaId: "ba1", projectId: "p1", name: "Community Water Access", description: "Infrastructure for clean water access in 8 communities", status: "completed", startDate: "2025-01-20", endDate: "2025-08-30", technicalProgress: 100, financialBudget: 240000, financialExecuted: 240000, responsible: "Field Ops Team" },
    { id: "a2", budgetAreaId: "ba2", projectId: "p1", name: "Technical Training Program", description: "Engineering skills for local maintenance teams", status: "in_progress", startDate: "2025-03-01", endDate: "2026-02-28", technicalProgress: 45, financialBudget: 180000, financialExecuted: 81000, responsible: "Training Division" },
    { id: "a3", budgetAreaId: "ba3", projectId: "p1", name: "Logistics Hub Setup", description: "Regional distribution and storage facility", status: "pending", startDate: "2025-02-15", endDate: "2025-12-31", technicalProgress: 85, financialBudget: 120500, financialExecuted: 102425, responsible: "Logistics Dept." },
    { id: "a4", budgetAreaId: "ba1", projectId: "p1", name: "Phase 2 Field Surveys", description: "Community needs assessment for expansion zones", status: "in_progress", startDate: "2025-09-01", endDate: "2026-04-30", technicalProgress: 35, financialBudget: 80000, financialExecuted: 28000, responsible: "Field Ops Team" },
    { id: "a5", budgetAreaId: "ba4", projectId: "p1", name: "Compliance & Reporting", description: "Regulatory compliance and donor reporting", status: "in_progress", startDate: "2025-01-15", endDate: "2026-06-30", technicalProgress: 60, financialBudget: 90000, financialExecuted: 54000, responsible: "Admin Team" },
    { id: "a6", budgetAreaId: "ba5", projectId: "p2", name: "Program Coordination", description: "Central coordination and stakeholder management", status: "in_progress", startDate: "2025-06-01", endDate: "2026-03-31", technicalProgress: 50, financialBudget: 100000, financialExecuted: 50000, responsible: "Program Director" },
    { id: "a7", budgetAreaId: "ba6", projectId: "p2", name: "Device Distribution", description: "Tablet and equipment distribution to 40 schools", status: "in_progress", startDate: "2025-07-01", endDate: "2026-02-28", technicalProgress: 40, financialBudget: 150000, financialExecuted: 60000, responsible: "Field Team B" },
  ],

  financialMovements: [
    { id: "fm1", budgetAreaId: "ba1", activityId: "a1", type: "income", amount: 620000, date: "2025-01-20", description: "Initial grant disbursement Q1", vendor: "UN-HABITAT Foundation", evidenceIds: ["ev1"], verified: true },
    { id: "fm2", budgetAreaId: "ba1", activityId: "a1", type: "expense", amount: 180000, date: "2025-03-10", description: "Equipment purchase – water infrastructure", vendor: "HydroTech Solutions", evidenceIds: ["ev2", "ev3"], verified: true },
    { id: "fm3", budgetAreaId: "ba2", activityId: "a2", type: "expense", amount: 45000, date: "2025-04-05", description: "Training materials and instructor fees Q1", vendor: "TechEdu Institute", evidenceIds: ["ev4"], verified: true },
    { id: "fm4", budgetAreaId: "ba3", activityId: "a3", type: "expense", amount: 95000, date: "2025-04-20", description: "Warehouse lease and initial setup costs", vendor: "LogiSpace S.A.", evidenceIds: ["ev5"], verified: true },
    { id: "fm5", budgetAreaId: "ba1", activityId: "a1", type: "expense", amount: 60000, date: "2025-05-15", description: "Community installation labor costs", vendor: "CivEngineers Group", evidenceIds: ["ev6"], verified: true },
    { id: "fm6", budgetAreaId: "ba4", activityId: "a5", type: "expense", amount: 32000, date: "2025-05-30", description: "Legal and compliance advisory fees", vendor: "Lexicon Legal", evidenceIds: ["ev7"], verified: true },
    { id: "fm7", budgetAreaId: "ba2", activityId: "a2", type: "expense", amount: 36000, date: "2025-06-20", description: "Training Q2 – Advanced Module", vendor: "TechEdu Institute", evidenceIds: ["ev8"], verified: false },
    { id: "fm8", budgetAreaId: "ba3", activityId: "a3", type: "expense", amount: 78000, date: "2025-07-10", description: "Vehicle fleet maintenance and fuel Q2", vendor: "FleetPro Services", evidenceIds: [], verified: false },
    { id: "fm9", budgetAreaId: "ba1", activityId: "a4", type: "income", amount: 620000, date: "2025-07-15", description: "Second grant tranche – Phase 2 activation", vendor: "UN-HABITAT Foundation", evidenceIds: ["ev9"], verified: true },
    { id: "fm10", budgetAreaId: "ba1", activityId: "a4", type: "expense", amount: 52000, date: "2025-08-05", description: "Field survey equipment and team costs", vendor: "FieldWork Technologies", evidenceIds: ["ev10"], verified: true },
  ],

  evidence: [
    { id: "ev1", type: "contract", title: "Grant Agreement – UN-HABITAT 2025", description: "Signed grant agreement for Clean Water Initiative, covering scope, milestones and reporting requirements.", fileType: "PDF", uploadedBy: "Finance Dept.", uploadedAt: "2025-01-20", activityId: "a1", budgetAreaId: "ba1", projectId: "p1", verified: true, amount: 620000 },
    { id: "ev2", type: "invoice", title: "Invoice #HT-2025-0089 – HydroTech Solutions", description: "Water infrastructure equipment: 8 pump systems, pipes, installation hardware.", fileType: "PDF", uploadedBy: "Procurement", uploadedAt: "2025-03-12", activityId: "a1", budgetAreaId: "ba1", projectId: "p1", verified: true, amount: 180000 },
    { id: "ev3", type: "receipt", title: "Payment Confirmation – HydroTech Q1", description: "Bank transfer confirmation for HydroTech equipment payment.", fileType: "PDF", uploadedBy: "Finance Dept.", uploadedAt: "2025-03-14", activityId: "a1", budgetAreaId: "ba1", projectId: "p1", verified: true },
    { id: "ev4", type: "contract", title: "Training Services Agreement – TechEdu", description: "Service contract for Q1 technical training modules.", fileType: "PDF", uploadedBy: "HR Dept.", uploadedAt: "2025-04-01", activityId: "a2", budgetAreaId: "ba2", projectId: "p1", verified: true, amount: 45000 },
    { id: "ev5", type: "contract", title: "Warehouse Lease – LogiSpace S.A.", description: "12-month warehouse lease with setup services included.", fileType: "PDF", uploadedBy: "Logistics Dept.", uploadedAt: "2025-04-22", activityId: "a3", budgetAreaId: "ba3", projectId: "p1", verified: true, amount: 95000 },
    { id: "ev6", type: "invoice", title: "Labor Invoice – CivEngineers Group", description: "Installation labor for community water infrastructure Phase 1.", fileType: "PDF", uploadedBy: "Field Ops", uploadedAt: "2025-05-18", activityId: "a1", budgetAreaId: "ba1", projectId: "p1", verified: true, amount: 60000 },
    { id: "ev7", type: "receipt", title: "Legal Services Receipt – Lexicon Legal", description: "Advisory fees for compliance review and donor reporting framework.", fileType: "PDF", uploadedBy: "Admin Team", uploadedAt: "2025-06-01", activityId: "a5", budgetAreaId: "ba4", projectId: "p1", verified: true },
    { id: "ev8", type: "invoice", title: "Training Q2 Invoice – TechEdu Institute", description: "Advanced module training – pending final delivery confirmation.", fileType: "PDF", uploadedBy: "Training Division", uploadedAt: "2025-06-22", activityId: "a2", budgetAreaId: "ba2", projectId: "p1", verified: false, amount: 36000 },
    { id: "ev9", type: "contract", title: "Grant Tranche 2 – UN-HABITAT Disbursement", description: "Authorization and confirmation for second funding tranche, Phase 2.", fileType: "PDF", uploadedBy: "Finance Dept.", uploadedAt: "2025-07-16", activityId: "a4", budgetAreaId: "ba1", projectId: "p1", verified: true, amount: 620000 },
    { id: "ev10", type: "receipt", title: "Field Equipment Receipt – FieldWork Tech", description: "GPS devices, tablets, and safety equipment for Phase 2 surveys.", fileType: "PDF", uploadedBy: "Field Ops", uploadedAt: "2025-08-06", activityId: "a4", budgetAreaId: "ba1", projectId: "p1", verified: true },
    { id: "ev11", type: "photo", title: "Community Installation – Los Cedros Zone", description: "Site photo documentation of water pump installation at Los Cedros community.", fileType: "JPG", uploadedBy: "Field Ops", uploadedAt: "2025-05-25", activityId: "a1", budgetAreaId: "ba1", projectId: "p1", verified: true },
    { id: "ev12", type: "report", title: "Phase 1 Completion Report", description: "Comprehensive technical and financial report for Phase 1 activities, verified by independent auditor.", fileType: "PDF", uploadedBy: "Audit Team", uploadedAt: "2025-09-01", activityId: "a1", budgetAreaId: "ba1", projectId: "p1", verified: true },
    { id: "ev13", type: "photo", title: "Training Session – Module 3", description: "Photo documentation of technical training session, 24 participants.", fileType: "JPG", uploadedBy: "Training Division", uploadedAt: "2025-07-10", activityId: "a2", budgetAreaId: "ba2", projectId: "p1", verified: false },
    { id: "ev14", type: "receipt", title: "Vehicle Fleet Receipt Q2 – PENDING", description: "FleetPro services receipt under verification for compliance review.", fileType: "PDF", uploadedBy: "Logistics Dept.", uploadedAt: "2025-07-12", activityId: "a3", budgetAreaId: "ba3", projectId: "p1", verified: false },
  ],

  events: [
    { id: "e1", type: "fund_received", title: "Grant Received: UN-HABITAT Phase 1", description: "Initial disbursement of $620,000 from UN-HABITAT Foundation for Clean Water Initiative Phase 1.", projectId: "p1", budgetAreaId: "ba1", activityId: "a1", amount: 620000, actor: "Finance Dept.", date: "2025-01-20", evidenceIds: ["ev1"], visibility: "public", verified: true, createdAt: "2025-01-20T09:15:00Z" },
    { id: "e2", type: "expense_recorded", title: "Equipment Purchase: HydroTech Solutions", description: "Water infrastructure equipment procurement for 8 community installations.", projectId: "p1", budgetAreaId: "ba1", activityId: "a1", amount: 180000, actor: "Procurement", date: "2025-03-10", evidenceIds: ["ev2", "ev3"], visibility: "donor_only", verified: true, createdAt: "2025-03-10T14:30:00Z" },
    { id: "e3", type: "activity_started", title: "Technical Training Program – Launch", description: "First module of the technical training program initiated with 28 participants.", projectId: "p1", budgetAreaId: "ba2", activityId: "a2", actor: "Training Division", date: "2025-03-01", evidenceIds: ["ev4"], visibility: "public", verified: true, createdAt: "2025-03-01T08:00:00Z" },
    { id: "e4", type: "milestone_reached", title: "Milestone: Phase 1 Foundations Complete", description: "All Phase 1 foundation activities completed and verified by independent auditor.", projectId: "p1", budgetAreaId: "ba1", activityId: "a1", actor: "Field Ops", date: "2025-05-28", evidenceIds: ["ev11", "ev12"], visibility: "public", verified: true, createdAt: "2025-05-28T16:45:00Z" },
    { id: "e5", type: "payment_disbursed", title: "Payment: Logistics Provider – LogiSpace", description: "Warehouse lease and setup costs paid to LogiSpace S.A.", projectId: "p1", budgetAreaId: "ba3", activityId: "a3", amount: 95000, actor: "Procurement", date: "2025-04-20", evidenceIds: ["ev5"], visibility: "internal", verified: true, createdAt: "2025-04-20T11:00:00Z" },
    { id: "e6", type: "evidence_uploaded", title: "Phase 1 Completion Report Uploaded", description: "Comprehensive Phase 1 completion report submitted to donor portal and verified.", projectId: "p1", budgetAreaId: "ba1", activityId: "a1", actor: "Audit Team", date: "2025-09-01", evidenceIds: ["ev12"], visibility: "public", verified: true, createdAt: "2025-09-01T10:30:00Z" },
    { id: "e7", type: "fund_received", title: "Grant Tranche 2: Phase 2 Activation", description: "Second funding tranche of $620,000 received for Phase 2 field activities.", projectId: "p1", budgetAreaId: "ba1", activityId: "a4", amount: 620000, actor: "Finance Dept.", date: "2025-07-15", evidenceIds: ["ev9"], visibility: "public", verified: true, createdAt: "2025-07-15T09:00:00Z" },
    { id: "e8", type: "audit_request", title: "Q3 Compliance Audit Initiated", description: "Internal audit team initiated Q3 compliance review for all budget areas.", projectId: "p1", budgetAreaId: "ba4", activityId: "a5", actor: "Audit Team", date: "2025-10-01", evidenceIds: [], visibility: "internal", verified: false, createdAt: "2025-10-01T08:00:00Z" },
    { id: "e9", type: "expense_recorded", title: "Fleet Services Q2 – Pending Verification", description: "Vehicle maintenance and fuel costs for logistics operations – under compliance review.", projectId: "p1", budgetAreaId: "ba3", activityId: "a3", amount: 78000, actor: "Logistics Dept.", date: "2025-07-10", evidenceIds: ["ev14"], visibility: "donor_only", verified: false, createdAt: "2025-07-10T15:00:00Z" },
    { id: "e10", type: "report_generated", title: "Monthly Transparency Statement – March 2026", description: "Automated transparency report generated and dispatched to all registered stakeholders.", projectId: "p1", budgetAreaId: "ba4", activityId: "a5", actor: "System", date: "2026-03-01", evidenceIds: [], visibility: "public", verified: true, createdAt: "2026-03-01T00:01:00Z" },
  ],
};

// ─── Reducer ─────────────────────────────────────────────────────────────────

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "ADD_EVENT":
      return { ...state, events: [action.payload, ...state.events] };
    case "ADD_EVIDENCE":
      return { ...state, evidence: [action.payload, ...state.evidence] };
    default:
      return state;
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────

const StoreContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
