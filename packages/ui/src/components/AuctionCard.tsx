import React from "react";
import { Button } from "./Button";

interface AuctionCardProps {
  id: number;
  title: string;
  description: string;
  highestBid: string;
  endTime: Date;
  seller: string;
  onBid: (id: number) => void;
  onSettle?: (id: number) => void;
  isEnded?: boolean;
}

function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function formatTimeLeft(endTime: Date): string {
  const now = new Date();
  const diff = endTime.getTime() - now.getTime();

  if (diff <= 0) return "Ended";

  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);

  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
  }
  return `${hours}h ${minutes}m`;
}

export function AuctionCard({
  id,
  title,
  description,
  highestBid,
  endTime,
  seller,
  onBid,
  onSettle,
  isEnded = false,
}: AuctionCardProps) {
  const timeLeft = formatTimeLeft(endTime);

  return (
    <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bold text-lg text-gray-900 truncate pr-2">{title}</h3>
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 ${
            isEnded
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {isEnded ? "Ended" : "Active"}
        </span>
      </div>

      <p className="text-sm text-gray-500 mb-4 line-clamp-2">{description}</p>

      <div className="flex justify-between text-sm mb-4">
        <div>
          <p className="text-gray-400">Highest Bid</p>
          <p className="font-semibold text-gray-900">{highestBid} ETH</p>
        </div>
        <div className="text-right">
          <p className="text-gray-400">Time Left</p>
          <p className={`font-semibold ${isEnded ? "text-red-600" : "text-gray-900"}`}>
            {timeLeft}
          </p>
        </div>
      </div>

      <p className="text-xs text-gray-400 mb-4">
        Seller: <span className="font-mono">{truncateAddress(seller)}</span>
      </p>

      {isEnded ? (
        onSettle && (
          <Button variant="secondary" size="sm" className="w-full" onClick={() => onSettle(id)}>
            Settle Auction
          </Button>
        )
      ) : (
        <Button size="sm" className="w-full" onClick={() => onBid(id)}>
          Place Bid
        </Button>
      )}
    </div>
  );
}
