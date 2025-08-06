"use client";

import {
  RainbowKitProvider,
  getDefaultWallets,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, base, zora } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import "@rainbow-me/rainbowkit/styles.css";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, polygon, optimism, arbitrum, base, zora],
  [publicProvider()],
  {
    pollingInterval: 30_000, // Increase polling interval to reduce requests
    stallTimeout: 10_000, // Increase stall timeout
  }
);

const { connectors } = getDefaultWallets({
  appName: "Alvara NFT Platform",
  projectId: "2f05a4334d28b5a85b96a6b5b6c08e2f", // Valid demo project ID
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: false, // Disable auto-connect to prevent immediate connection attempts
  connectors,
  publicClient,
  webSocketPublicClient,
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        chains={chains}
        coolMode={false} // Disable cool mode to reduce unnecessary features
        showRecentTransactions={false} // Disable recent transactions to reduce API calls
      >
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
