import React from "react";
import { Button } from "./Button";

interface ConnectWalletProps {
  address?: string;
  onConnect: () => void;
  onDisconnect: () => void;
  loading?: boolean;
}

function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function ConnectWallet({
  address,
  onConnect,
  onDisconnect,
  loading = false,
}: ConnectWalletProps) {
  if (address) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full font-mono">
          {truncateAddress(address)}
        </span>
        <Button variant="outline" size="sm" onClick={onDisconnect}>
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={onConnect} loading={loading}>
      Connect Wallet
    </Button>
  );
}
