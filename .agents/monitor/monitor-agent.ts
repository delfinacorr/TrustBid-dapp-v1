/**
 * Monitor Agent
 * Listens to on-chain events and alerts on anomalies.
 */

import { ethers } from "ethers";

const TRUSTBID_ABI = [
  "event AuctionCreated(uint256 indexed auctionId, address indexed seller, uint256 startingPrice, uint256 endTime)",
  "event BidPlaced(uint256 indexed auctionId, address indexed bidder, uint256 amount)",
  "event AuctionSettled(uint256 indexed auctionId, address indexed winner, uint256 amount)",
  "event AuctionCancelled(uint256 indexed auctionId)",
];

interface MonitorConfig {
  rpcUrl: string;
  contractAddress: string;
}

async function startMonitor(config: MonitorConfig) {
  console.log("[monitor-agent] Starting event monitor...");
  console.log(`[monitor-agent] Contract: ${config.contractAddress}`);

  const provider = new ethers.WebSocketProvider(config.rpcUrl);
  const contract = new ethers.Contract(config.contractAddress, TRUSTBID_ABI, provider);

  contract.on("AuctionCreated", (auctionId, seller, startingPrice, endTime) => {
    console.log(`[AuctionCreated] id=${auctionId} seller=${seller} price=${ethers.formatEther(startingPrice)} ETH`);
  });

  contract.on("BidPlaced", (auctionId, bidder, amount) => {
    console.log(`[BidPlaced] auction=${auctionId} bidder=${bidder} amount=${ethers.formatEther(amount)} ETH`);
  });

  contract.on("AuctionSettled", (auctionId, winner, amount) => {
    console.log(`[AuctionSettled] auction=${auctionId} winner=${winner} amount=${ethers.formatEther(amount)} ETH`);
  });

  contract.on("AuctionCancelled", (auctionId) => {
    console.log(`[AuctionCancelled] auction=${auctionId}`);
  });

  provider.on("error", (err) => {
    console.error("[monitor-agent] Provider error:", err);
  });

  console.log("[monitor-agent] Listening for events...");
}

const rpcUrl = process.env.RPC_WS_URL ?? "ws://127.0.0.1:8545";
const contractAddress = process.env.TRUSTBID_ADDRESS ?? "";

if (!contractAddress) {
  console.error("[monitor-agent] TRUSTBID_ADDRESS env var required");
  process.exit(1);
}

startMonitor({ rpcUrl, contractAddress });
