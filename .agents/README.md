# Agents

This directory contains AI agents that automate tasks across the TrustBid monorepo.

## Structure

```
.agents/
├── README.md          # This file
├── deploy/            # Deployment automation agents
├── monitor/           # On-chain monitoring agents
├── audit/             # Smart contract audit helpers
└── scripts/           # Shared agent utilities
```

## Agent Types

### Deploy Agent (`deploy/`)
Automates contract deployment across networks.
- Reads deployment config from `packages/contracts/.env`
- Verifies contracts on Etherscan post-deployment
- Updates frontend contract addresses automatically

### Monitor Agent (`monitor/`)
Watches on-chain events and alerts on anomalies.
- Tracks `BidPlaced`, `AuctionCreated`, `AuctionSettled` events
- Alerts on unusual bid patterns or price manipulation attempts

### Audit Agent (`audit/`)
Runs automated security checks on Solidity contracts.
- Integrates with Slither / Mythril
- Generates audit reports before deployments

## Usage

Agents are invoked via the root `scripts/` directory or through CI/CD pipelines.

```bash
# Run deploy agent
pnpm agents:deploy --network sepolia

# Run monitor agent
pnpm agents:monitor --chain mainnet
```
