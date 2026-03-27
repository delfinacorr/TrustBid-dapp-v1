#!/usr/bin/env bash
# Audit Agent - Runs static analysis on Solidity contracts

set -euo pipefail

CONTRACTS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../packages/contracts" && pwd)"
REPORT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/reports"

mkdir -p "$REPORT_DIR"

echo "[audit-agent] Running Slither analysis..."
echo "[audit-agent] Contracts dir: $CONTRACTS_DIR"

if command -v slither &>/dev/null; then
  slither "$CONTRACTS_DIR" \
    --json "$REPORT_DIR/slither-report.json" \
    --print human-summary 2>&1 | tee "$REPORT_DIR/slither-output.txt"
  echo "[audit-agent] Slither report saved to $REPORT_DIR/slither-report.json"
else
  echo "[audit-agent] Warning: slither not installed. Run: pip install slither-analyzer"
fi

echo "[audit-agent] Audit complete."
