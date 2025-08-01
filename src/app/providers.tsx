"use client";

import { RainbowKitProvider, getDefaultWallets } from "@rainbow-me/rainbowkit";
import { createConfig, http, WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  zora,
  sepolia,
} from "wagmi/chains";
import "@rainbow-me/rainbowkit/styles.css";

const { connectors } = getDefaultWallets({
  appName: "Alvara NFT Platform",
  projectId: "2f05a4334d28b5a85b96a6b5b6c08e2f", // Valid demo project ID
});

const wagmiConfig = createConfig({
  chains: [sepolia, mainnet, polygon, optimism, arbitrum, base, zora],
  connectors,
  transports: {
    [sepolia.id]: http(),
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
    [base.id]: http(),
    [zora.id]: http(),
  },
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          coolMode={false} // Disable cool mode to reduce unnecessary features
          showRecentTransactions={false} // Disable recent transactions to reduce API calls
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
