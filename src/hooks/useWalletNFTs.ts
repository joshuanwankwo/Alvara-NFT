import { useState, useEffect } from "react";
import { useAccount, useContractRead, useNetwork } from "wagmi";
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
  const { chain } = useNetwork();
  const [ownedNFTs, setOwnedNFTs] = useState<WalletNFT[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get contract address based on current network
  const getContractAddress = () => {
    if (chain?.id === 11155111) return CONTRACT_ADDRESSES.sepolia;
    if (chain?.id === 5) return CONTRACT_ADDRESSES.goerli;
    if (chain?.id === 1) return CONTRACT_ADDRESSES.mainnet;
    return CONTRACT_ADDRESSES.mainnet; // Default to mainnet
  };

  const contractAddress = getContractAddress() as `0x${string}`;

  // Get user's NFT balance
  const { data: balance, refetch: refetchBalance } = useContractRead({
    address: contractAddress,
    abi: ALVARA_MINT_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    enabled: !!address && isConnected,
  });

  const fetchUserNFTs = async () => {
    if (!address) {
      setOwnedNFTs([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let walletNFTs: WalletNFT[] = [];

      if (isAlchemyConfigured()) {
        console.log(
          `🔍 Using Alchemy to fetch Alvara NFTs for wallet: ${address}`
        );
        console.log(`📊 Contract balance shows: ${Number(balance)} NFTs`);
        console.log(
          `🔑 Alchemy API Key configured: ${!!process.env
            .NEXT_PUBLIC_ALCHEMY_API_KEY}`
        );

        // Fetch actual NFTs from the user's wallet using Alchemy
        const alchemyNFTs: AlchemyNFT[] = await fetchAlvaraNFTs(address);

        console.log(`📦 Alchemy API returned ${alchemyNFTs.length} NFTs`);
        console.log(
          "Raw Alchemy data:",
          alchemyNFTs.map((nft) => ({
            tokenId: nft.tokenId,
            name: nft.name,
            contractAddress: nft.contractAddress,
            hasMetadata: !!nft.rawMetadata,
          }))
        );

        // STRICT FILTERING: Only show NFTs from the current contract
        const filteredNFTs = alchemyNFTs.filter((nft) => {
          const isFromCurrentContract =
            nft.contractAddress.toLowerCase() === contractAddress.toLowerCase();
          if (!isFromCurrentContract) {
            console.warn(
              `❌ FILTERING OUT NFT ${nft.tokenId} from wrong contract: ${nft.contractAddress} (current: ${contractAddress})`
            );
          }
          return isFromCurrentContract;
        });

        console.log(
          `🔍 Filtered ${alchemyNFTs.length} NFTs to ${filteredNFTs.length} from current contract`
        );

        // Transform AlchemyNFT to WalletNFT format
        walletNFTs = filteredNFTs.map((nft) => {
          // Extract design ID from token metadata if available
          const designId =
            nft.rawMetadata?.attributes?.find(
              (attr: any) => attr.trait_type === "Design ID"
            )?.value || extractDesignIdFromTokenId(Number(nft.tokenId));

          console.log(
            `🎨 Processing NFT ${nft.tokenId}: "${nft.name}" with design ID ${designId}`
          );

          return {
            tokenId: Number(nft.tokenId),
            designId: designId,
            name: nft.name || `Alvara NFT #${nft.tokenId}`,
            imageUrl: nft.imageUrl || `/images/nfts/Basket-Beth.png`,
            contractAddress: nft.contractAddress,
            metadata: nft.rawMetadata
              ? {
                  name: nft.name || `Alvara NFT #${nft.tokenId}`,
                  description: nft.description || "Alvara NFT from your wallet",
                  image: nft.imageUrl || `/images/nfts/Basket-Beth.png`,
                  attributes: nft.rawMetadata.attributes || [],
                }
              : undefined,
          };
        });

        console.log(
          `✅ Successfully processed ${walletNFTs.length} Alvara NFTs from Alchemy`
        );
      } else {
        console.log("🔑 Alchemy API key not configured. Using fallback mode.");
        console.log("🔧 To fix this on Vercel:");
        console.log(
          "1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables"
        );
        console.log(
          "2. Add: NEXT_PUBLIC_ALCHEMY_API_KEY = your_alchemy_api_key"
        );
        console.log("3. Redeploy your application");
        console.log(
          "4. For local development, add NEXT_PUBLIC_ALCHEMY_API_KEY to your .env.local file"
        );

        // Fallback: Create placeholder NFTs based on balance
        const balanceNum = Number(balance);
        walletNFTs = Array.from({ length: balanceNum }, (_, index) => ({
          tokenId: index + 1,
          designId: extractDesignIdFromTokenId(index + 1),
          name: `Alvara NFT #${index + 1}`,
          imageUrl: `/images/nfts/Basket-Beth.png`, // Fallback image
          contractAddress: contractAddress,
        }));

        console.log(
          `📦 Created ${walletNFTs.length} fallback NFTs based on balance`
        );
      }

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
