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
    alchemyProvider({
      apiKey:
        process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || "GZnUwew-bar4JCUbJjVIt",
    }),
    publicProvider(),
  ],
  {
    pollingInterval: 4_000,
    stallTimeout: 20_000,
    retryCount: 5,
    retryDelay: 2000,
  }
);

const { connectors } = getDefaultWallets({
  appName: "Alvara NFT Platform",
  projectId: "2f05a4334d28b5a85b96a6b5b6c08e2f",
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: false,
  connectors,
  publicClient,
  webSocketPublicClient,
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        chains={chains}
        initialChain={mainnet}
        coolMode={false}
        showRecentTransactions={false}
      >
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
