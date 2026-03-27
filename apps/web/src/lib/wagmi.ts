import { createConfig, http } from "wagmi";
import { mainnet, sepolia, hardhat } from "wagmi/chains";
import { injected, metaMask, coinbaseWallet } from "wagmi/connectors";

export const wagmiConfig = createConfig({
  chains: [mainnet, sepolia, hardhat],
  connectors: [
    injected(),
    metaMask(),
    coinbaseWallet({ appName: "TrustBid" }),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [hardhat.id]: http("http://127.0.0.1:8545"),
  },
});
