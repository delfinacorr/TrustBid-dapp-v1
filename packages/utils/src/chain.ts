export const SUPPORTED_CHAINS = {
  MAINNET: 1,
  SEPOLIA: 11155111,
  LOCALHOST: 31337,
} as const;

export type SupportedChainId = (typeof SUPPORTED_CHAINS)[keyof typeof SUPPORTED_CHAINS];

export const CHAIN_NAMES: Record<SupportedChainId, string> = {
  [SUPPORTED_CHAINS.MAINNET]: "Ethereum Mainnet",
  [SUPPORTED_CHAINS.SEPOLIA]: "Sepolia Testnet",
  [SUPPORTED_CHAINS.LOCALHOST]: "Localhost",
};

export const CHAIN_EXPLORERS: Record<SupportedChainId, string> = {
  [SUPPORTED_CHAINS.MAINNET]: "https://etherscan.io",
  [SUPPORTED_CHAINS.SEPOLIA]: "https://sepolia.etherscan.io",
  [SUPPORTED_CHAINS.LOCALHOST]: "",
};

export function isSupportedChain(chainId: number): chainId is SupportedChainId {
  return Object.values(SUPPORTED_CHAINS).includes(chainId as SupportedChainId);
}

export function getExplorerTxUrl(chainId: SupportedChainId, txHash: string): string {
  const base = CHAIN_EXPLORERS[chainId];
  if (!base) return "";
  return `${base}/tx/${txHash}`;
}

export function getExplorerAddressUrl(chainId: SupportedChainId, address: string): string {
  const base = CHAIN_EXPLORERS[chainId];
  if (!base) return "";
  return `${base}/address/${address}`;
}
