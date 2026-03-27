import { formatEther, parseEther } from "ethers";

export function formatEth(wei: bigint, decimals = 4): string {
  const eth = formatEther(wei);
  return parseFloat(eth).toFixed(decimals);
}

export function parseEth(eth: string): bigint {
  return parseEther(eth);
}

export function truncateAddress(address: string, start = 6, end = 4): string {
  if (address.length <= start + end) return address;
  return `${address.slice(0, start)}...${address.slice(-end)}`;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatTimeLeft(endTime: Date): string {
  const now = new Date();
  const diff = endTime.getTime() - now.getTime();

  if (diff <= 0) return "Ended";

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  return `${minutes}m ${seconds % 60}s`;
}
