"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { injected } from "wagmi/connectors";
import { AccesslyScript } from "./AccesslyScript";

const config = createConfig({
  chains: [mainnet, sepolia],
  connectors: [injected()],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
        {/*
          AccesslyScript renders the external accessibility widget loader.
          Placed at the end of the provider tree so it does not block rendering.
          Deduplication is handled by Next.js Script id="accessly-widget-loader".
        */}
        <AccesslyScript />
      </QueryClientProvider>
    </WagmiProvider>
  );
}
