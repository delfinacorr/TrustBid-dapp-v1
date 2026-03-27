# TrustBid dApp

Decentralized auction platform built on Ethereum. Trustless, transparent, and permissionless.

## Monorepo Structure

```
trustbid-dapp/
├── .agents/                 # AI automation agents
│   ├── deploy/              # Deployment agents
│   ├── monitor/             # On-chain event monitors
│   ├── audit/               # Security audit agents
│   └── scripts/             # Shared agent utilities
├── apps/
│   ├── web/                 # Next.js frontend (wagmi + viem)
│   └── docs/                # Documentation site
├── packages/
│   ├── contracts/           # Solidity smart contracts (Hardhat)
│   ├── ui/                  # Shared React component library
│   ├── utils/               # Shared utilities (format, chain, validation)
│   └── config/              # Shared ESLint + TypeScript config
├── scripts/                 # Repo-level scripts
├── turbo.json               # Turborepo pipeline config
└── pnpm-workspace.yaml      # pnpm workspaces
```

## Prerequisites

- Node.js >= 18
- pnpm >= 8 (`npm install -g pnpm`)

## Getting Started

```bash
# Install dependencies
pnpm install

# Start local blockchain
pnpm --filter @trustbid/contracts node

# Deploy contracts locally (in another terminal)
pnpm --filter @trustbid/contracts deploy:local

# Start frontend
pnpm --filter @trustbid/web dev
```

## Smart Contracts

The core contract is `TrustBid.sol`, an on-chain auction system with:
- Trustless bid management with automatic refunds
- Platform fee collection
- Reentrancy protection
- Owner-controlled fee updates

### Deploy to Sepolia

```bash
cp packages/contracts/.env.example packages/contracts/.env
# Fill in PRIVATE_KEY, INFURA_API_KEY, ETHERSCAN_API_KEY
pnpm --filter @trustbid/contracts deploy:testnet
```

## Agents

Automated agents live in `.agents/`. See [.agents/README.md](.agents/README.md) for details.

## Tech Stack

| Layer | Tech |
|-------|------|
| Smart Contracts | Solidity 0.8.24, Hardhat, OpenZeppelin |
| Frontend | Next.js 14, React 18, Tailwind CSS |
| Web3 | wagmi v2, viem, ethers v6 |
| Build | Turborepo, pnpm workspaces |
| Language | TypeScript |

## License

MIT
