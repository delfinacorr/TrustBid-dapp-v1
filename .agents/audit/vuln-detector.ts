/**
 * TrustBid — Vulnerability Detector Agent
 * Capa 1: reglas estáticas (sin costo, sin red)
 * Capa 2: Gemini Flash como agente de análisis semántico
 */

import * as dotenv from "dotenv";
dotenv.config({ path: `${__dirname}/.env` });

// ── Types ────────────────────────────────────────────────────────────────────

export interface TransactionPayload {
  function: string;
  args: Record<string, unknown>;
  sender: string;
  contractId?: string;
}

export interface AuditResult {
  safe: boolean;
  warnings: string[];
  blocked: boolean;
  blockedReason?: string;
  geminiAnalysis?: string;
  source: "static" | "gemini" | "combined";
}

// ── Capa 1: Reglas estáticas ─────────────────────────────────────────────────

type Rule = (tx: TransactionPayload) => { warn?: string; block?: string } | null;

const STATIC_RULES: Rule[] = [
  (tx) => {
    if (tx.function === "place_bid") {
      const amount = Number(tx.args.amount ?? 0);
      if (amount <= 0) return { block: "Bid amount must be greater than 0" };
    }
    return null;
  },
  (tx) => {
    if (tx.function === "place_bid") {
      const amount = Number(tx.args.amount ?? 0);
      if (amount > 1_000_000_000_000_000)
        return { block: "Bid amount exceeds safe limit — possible overflow attempt" };
    }
    return null;
  },
  (tx) => {
    if (tx.function === "place_bid" && tx.sender === tx.args.seller)
      return { block: "Seller cannot bid on their own auction" };
    return null;
  },
  (tx) => {
    if (!tx.contractId?.trim())
      return { block: "Missing contractId — transaction would target unknown contract" };
    return null;
  },
  (tx) => {
    if (!/^G[A-Z2-7]{55}$/.test(tx.sender))
      return { warn: `Sender public key looks malformed: ${tx.sender}` };
    return null;
  },
  (tx) => {
    if (tx.function === "settle_auction")
      return { warn: "Verify auction end_time on-chain before settling to avoid wasted fees" };
    return null;
  },
];

function runStaticRules(tx: TransactionPayload): Omit<AuditResult, "geminiAnalysis" | "source"> {
  const warnings: string[] = [];
  for (const rule of STATIC_RULES) {
    const r = rule(tx);
    if (!r) continue;
    if (r.block) return { safe: false, warnings, blocked: true, blockedReason: r.block };
    if (r.warn) warnings.push(r.warn);
  }
  return { safe: warnings.length === 0, warnings, blocked: false };
}

// ── Capa 2: Gemini Flash agent ───────────────────────────────────────────────

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

function buildPrompt(tx: TransactionPayload): string {
  return `
You are a smart contract security agent for a Soroban/Stellar dApp called TrustBid.
Analyze the following transaction and detect potential vulnerabilities or suspicious patterns.

Transaction:
- Function  : ${tx.function}
- Arguments : ${JSON.stringify(tx.args, null, 2)}
- Sender    : ${tx.sender}
- ContractId: ${tx.contractId ?? "NOT PROVIDED"}

Focus on:
1. Reentrancy or repeated call patterns
2. Unexpected or extreme argument values
3. Authorization issues (wrong sender, missing fields)
4. Logic inconsistencies for this function
5. Any other Soroban-specific risks

Reply strictly in this format (one line):
SAFE | WARNING: <reason> | BLOCK: <reason>
`.trim();
}

async function analyzeWithGemini(tx: TransactionPayload): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not set in .env");

  const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: buildPrompt(tx) }] }],
      generationConfig: {
        temperature: 0.1,       // low temp → deterministic security responses
        maxOutputTokens: 256,
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "SAFE";
}

function parseGeminiVerdict(
  verdict: string
): { blocked: boolean; blockedReason?: string; warning?: string } {
  const upper = verdict.toUpperCase();
  if (upper.startsWith("BLOCK")) {
    return { blocked: true, blockedReason: verdict.replace(/^BLOCK:\s*/i, "") };
  }
  if (upper.startsWith("WARNING")) {
    return { blocked: false, warning: verdict.replace(/^WARNING:\s*/i, "") };
  }
  return { blocked: false };
}

// ── Main: pipeline completo ──────────────────────────────────────────────────

export async function runAudit(tx: TransactionPayload): Promise<AuditResult> {
  // Capa 1 — reglas estáticas
  const staticResult = runStaticRules(tx);
  if (staticResult.blocked) {
    return { ...staticResult, source: "static" };
  }

  // Capa 2 — Gemini Flash
  let geminiRaw: string;
  try {
    geminiRaw = await analyzeWithGemini(tx);
  } catch (e: any) {
    console.warn("[vuln-detector] Gemini unavailable, using static only:", e.message);
    return { ...staticResult, source: "static" };
  }

  const gemini = parseGeminiVerdict(geminiRaw);
  const warnings = [...staticResult.warnings];
  if (gemini.warning) warnings.push(`[Gemini] ${gemini.warning}`);

  return {
    safe: !gemini.blocked && warnings.length === 0,
    warnings,
    blocked: gemini.blocked,
    blockedReason: gemini.blockedReason,
    geminiAnalysis: geminiRaw,
    source: "combined",
  };
}

// ── CLI ──────────────────────────────────────────────────────────────────────

async function main() {
  const tx: TransactionPayload = {
    function: "place_bid",
    args: { auction_id: 1, amount: 5_000_000, seller: "GABC123" },
    sender: "GAHJJJKMOKYE4RVPZEWZTKH5FVI4PA3VL7GK2LFNUBSGBV3WVHJCEZ1",
    contractId: "CBXVHV3OKBFGY6XJXQNBQZJKDX7OAIM5JXQZ2ZKQZJKDX7OAIM5JXQ",
  };

  console.log("\n[vuln-detector] Analyzing transaction...");
  console.log("Function :", tx.function);
  console.log("Sender   :", tx.sender);

  const result = await runAudit(tx);

  console.log("\n─────────────────────────────────");
  console.log("Source   :", result.source);
  console.log("Safe     :", result.safe);

  if (result.blocked) {
    console.log("BLOCKED  :", result.blockedReason);
    process.exit(1);
  }
  if (result.warnings.length > 0) {
    console.log("Warnings :");
    result.warnings.forEach((w) => console.log("  -", w));
  }
  if (result.geminiAnalysis) {
    console.log("Gemini   :", result.geminiAnalysis);
  }
  if (result.safe) {
    console.log("Status   : Transaction looks safe. Proceed.");
  }
}

if (require.main === module) main();
