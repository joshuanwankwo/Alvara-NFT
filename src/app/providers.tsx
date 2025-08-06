"use client";

import {
  RainbowKitProvider,
  getDefaultWallets,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import {
  sepolia,
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  zora,
} from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { alchemyProvider } from "wagmi/providers/alchemy";
import "@rainbow-me/rainbowkit/styles.css";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [sepolia, mainnet, polygon, optimism, arbitrum, base, zora],
  [
    // Use Alchemy as primary provider for better reliability
    alchemyProvider({
      apiKey:
        process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || "GZnUwew-bar4JCUbJjVIt",
    }),
    // Fallback to public provider
    publicProvider(),
  ],
  {
    pollingInterval: 4_000, // Faster polling for better UX
    stallTimeout: 20_000, // Longer timeout for slow networks
    retryCount: 5, // More retries for reliability
    retryDelay: 2000, // Wait 2 seconds between retries
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
        initialChain={sepolia} // Set Sepolia as the default network
        coolMode={false} // Disable cool mode to reduce unnecessary features
        showRecentTransactions={false} // Disable recent transactions to reduce API calls
      >
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
