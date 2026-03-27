/**
 * Vulnerability Detector Agent
 * Inspects a transaction payload before submission and flags known risk patterns.
 * Designed for Soroban/Stellar transactions.
 */

// ── Types ────────────────────────────────────────────────────────────────────

interface TransactionPayload {
  function: string;   // contract function name, e.g. "place_bid"
  args: Record<string, unknown>;
  sender: string;     // Stellar public key (G...)
  contractId?: string;
}

interface VulnResult {
  safe: boolean;
  warnings: string[];
  blocked: boolean;
  blockedReason?: string;
}

// ── Rules ────────────────────────────────────────────────────────────────────

type Rule = (tx: TransactionPayload) => { warn?: string; block?: string } | null;

const rules: Rule[] = [
  // 1. Zero or negative bid amount
  (tx) => {
    if (tx.function === "place_bid") {
      const amount = Number(tx.args.amount ?? 0);
      if (amount <= 0) return { block: "Bid amount must be greater than 0" };
    }
    return null;
  },

  // 2. Suspiciously large bid (> 1 billion stroops — possible overflow attempt)
  (tx) => {
    if (tx.function === "place_bid") {
      const amount = Number(tx.args.amount ?? 0);
      if (amount > 1_000_000_000_000_000) {
        return { block: "Bid amount exceeds maximum safe value — possible overflow" };
      }
    }
    return null;
  },

  // 3. Sender matches seller (self-bid)
  (tx) => {
    if (tx.function === "place_bid") {
      if (tx.sender && tx.args.seller && tx.sender === tx.args.seller) {
        return { block: "Seller cannot bid on their own auction" };
      }
    }
    return null;
  },

  // 4. Missing contract ID
  (tx) => {
    if (!tx.contractId || tx.contractId.trim() === "") {
      return { block: "Missing contract ID — transaction would target unknown contract" };
    }
    return null;
  },

  // 5. Invalid Stellar public key format
  (tx) => {
    if (!/^G[A-Z2-7]{55}$/.test(tx.sender)) {
      return { warn: `Sender public key looks malformed: ${tx.sender}` };
    }
    return null;
  },

  // 6. Settle on active auction (timestamp not checked — warn to verify on-chain)
  (tx) => {
    if (tx.function === "settle_auction") {
      return { warn: "Verify auction end_time on-chain before settling to avoid wasted fees" };
    }
    return null;
  },
];

// ── Engine ───────────────────────────────────────────────────────────────────

export function detectVulnerabilities(tx: TransactionPayload): VulnResult {
  const warnings: string[] = [];
  let blocked = false;
  let blockedReason: string | undefined;

  for (const rule of rules) {
    const result = rule(tx);
    if (!result) continue;

    if (result.block) {
      blocked = true;
      blockedReason = result.block;
      break; // stop on first blocker
    }

    if (result.warn) {
      warnings.push(result.warn);
    }
  }

  return {
    safe: !blocked && warnings.length === 0,
    warnings,
    blocked,
    blockedReason,
  };
}

// ── CLI entry ────────────────────────────────────────────────────────────────

if (require.main === module) {
  // Example transaction — replace with real payload in production
  const tx: TransactionPayload = {
    function: "place_bid",
    args: { auction_id: 1, amount: 5_000_000 },
    sender: "GAHJJJKMOKYE4RVPZEWZTKH5FVI4PA3VL7GK2LFNUBSGBV3WVHJCEZ1",
    contractId: "CBXVHV3OKBFGY6XJXQNBQZJKDX7OAIM5JXQZ2ZKQZJKDX7OAIM5JXQ",
  };

  const result = detectVulnerabilities(tx);

  console.log("\n[vuln-detector] Transaction Analysis");
  console.log("=====================================");
  console.log("Function :", tx.function);
  console.log("Sender   :", tx.sender);
  console.log("Safe     :", result.safe);

  if (result.blocked) {
    console.log("\n🚫 BLOCKED:", result.blockedReason);
    process.exit(1);
  }

  if (result.warnings.length > 0) {
    console.log("\n⚠️  Warnings:");
    result.warnings.forEach((w) => console.log("  -", w));
  }

  if (result.safe) {
    console.log("\n✅ Transaction looks safe. Proceed.");
  }
}
