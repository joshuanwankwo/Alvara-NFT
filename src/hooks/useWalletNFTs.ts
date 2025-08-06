import { useState, useEffect } from "react";
import { useAccount, useReadContract } from "wagmi";
import { ALVARA_MINT_ABI } from "@/contracts/AlvaraMint";
import { CONTRACT_ADDRESSES } from "@/contracts/addresses";
import axios from "axios";
import {
  fetchAlvaraNFTs,
  isAlchemyConfigured,
  AlchemyNFT,
} from "@/services/alchemyNFT";

interface WalletNFT {
  tokenId: number;
  designId?: number;
  name: string;
  imageUrl?: string;
  contractAddress?: string;
  metadata?: {
    name: string;
    description: string;
    image: string;
    attributes: Array<{
      trait_type: string;
      value: string | number;
    }>;
  };
}

export function useWalletNFTs() {
  const { address, isConnected } = useAccount();
  const [ownedNFTs, setOwnedNFTs] = useState<WalletNFT[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get contract address for Sepolia
  const contractAddress = CONTRACT_ADDRESSES.sepolia as `0x${string}`;

  // Get user's NFT balance
  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: contractAddress,
    abi: ALVARA_MINT_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address && isConnected },
  });

  const fetchUserNFTs = async () => {
    if (!address || !balance || Number(balance) === 0) {
      setOwnedNFTs([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (!isAlchemyConfigured()) {
        console.log("🔑 Alchemy API key not configured. Using demo mode.");
        console.log("To see actual wallet NFTs:");
        console.log("1. Sign up at https://alchemy.com");
        console.log("2. Create a Sepolia testnet app");
        console.log("3. Add NEXT_PUBLIC_ALCHEMY_API_KEY to your .env file");
        setOwnedNFTs([]);
        return;
      }

      console.log(`🔍 Fetching Alvara NFTs for wallet: ${address}`);

      // Fetch actual NFTs from the user's wallet using Alchemy
      const alchemyNFTs: AlchemyNFT[] = await fetchAlvaraNFTs(address);

      // Transform AlchemyNFT to WalletNFT format
      const walletNFTs: WalletNFT[] = alchemyNFTs.map((nft) => {
        // Extract design ID from token metadata if available
        const designId =
          nft.rawMetadata?.attributes?.find(
            (attr: any) => attr.trait_type === "Design ID"
          )?.value || extractDesignIdFromTokenId(Number(nft.tokenId));

        return {
          tokenId: Number(nft.tokenId),
          designId: designId,
          name: nft.name,
          imageUrl: nft.imageUrl,
          contractAddress: nft.contractAddress,
          metadata: nft.rawMetadata
            ? {
                name: nft.name,
                description: nft.description || "",
                image: nft.imageUrl || "",
                attributes: nft.rawMetadata.attributes || [],
              }
            : undefined,
        };
      });

      console.log(
        `✅ Successfully loaded ${walletNFTs.length} Alvara NFTs from wallet`
      );
      setOwnedNFTs(walletNFTs);
    } catch (err) {
      console.error("Error fetching user NFTs:", err);
      setError("Failed to load NFTs from wallet. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to extract design ID from token ID (fallback)
  const extractDesignIdFromTokenId = (tokenId: number): number => {
    // If no design ID in metadata, try to infer from token ID
    // This is a fallback - ideally the metadata should contain this
    return ((tokenId - 1) % 10) + 1; // Distribute across 10 designs
  };

  // Fetch NFTs when user connects or balance changes
  useEffect(() => {
    if (isConnected && address) {
      fetchUserNFTs();
    } else {
      setOwnedNFTs([]);
      setIsLoading(false);
    }
  }, [address, isConnected, balance]);

  return {
    ownedNFTs,
    isLoading,
    error,
    refetch: fetchUserNFTs,
    refetchBalance,
    totalNFTs: Number(balance || 0),
  };
}
