#!/usr/bin/env bash
# Deploy TrustBid contract to Stellar via Soroban CLI
set -euo pipefail

NETWORK="${STELLAR_NETWORK:-testnet}"
SECRET_KEY="${STELLAR_SECRET_KEY:?STELLAR_SECRET_KEY is required}"

echo "[deploy] Building contract..."
cargo build --target wasm32-unknown-unknown --release

WASM="target/wasm32-unknown-unknown/release/trustbid_contract.wasm"

echo "[deploy] Deploying to $NETWORK..."
CONTRACT_ID=$(stellar contract deploy \
  --wasm "$WASM" \
  --source "$SECRET_KEY" \
  --network "$NETWORK")

echo "[deploy] Contract ID: $CONTRACT_ID"

echo "[deploy] Initializing with 2.5% platform fee..."
stellar contract invoke \
  --id "$CONTRACT_ID" \
  --source "$SECRET_KEY" \
  --network "$NETWORK" \
  -- initialize \
  --platform_fee 250

echo "[deploy] Done. CONTRACT_ID=$CONTRACT_ID"
