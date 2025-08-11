import { Alchemy, Network, OwnedNftsResponse, Nft } from "alchemy-sdk";
import { CONTRACT_ADDRESSES } from "@/contracts/addresses";

// Get the correct Alchemy network based on environment or default to mainnet
const getAlchemyNetwork = () => {
  // You can add logic here to detect current network
  // For now, defaulting to mainnet since you mentioned everything is on mainnet
  return Network.ETH_MAINNET;
};

// Alchemy configuration
const config = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || "demo", // Demo key for development
  network: getAlchemyNetwork(), // Dynamic network selection
};

const alchemy = new Alchemy(config);

export interface AlchemyNFT {
  tokenId: string;
  name: string;
  description?: string;
  imageUrl?: string;
  contractAddress: string;
  tokenType: string;
  rawMetadata?: any;
}

/**
 * Fetch all NFTs owned by a wallet address
 */
export async function fetchWalletNFTs(
  walletAddress: string,
  contractAddress?: string
): Promise<AlchemyNFT[]> {
  try {
    console.log(`🔍 Fetching NFTs for wallet: ${walletAddress}`);

    // Fetch NFTs owned by the wallet
    const options = contractAddress
      ? {
          contractAddresses: [contractAddress],
          withMetadata: true,
          pageSize: 100,
        }
      : { withMetadata: true, pageSize: 100 };

    const response: OwnedNftsResponse = await alchemy.nft.getNftsForOwner(
      walletAddress,
      options
    );

    console.log(`📦 Found ${response.ownedNfts.length} NFTs`);

    // Transform Alchemy NFTs to our format
    const nfts: AlchemyNFT[] = response.ownedNfts.map((nft: any) => {
      const imageUrl =
        nft.image?.pngUrl ||
        nft.image?.thumbnailUrl ||
        nft.image?.gateway ||
        nft.image?.originalUrl ||
        nft.media?.[0]?.gateway ||
        nft.media?.[0]?.raw ||
        nft.rawMetadata?.image;

      return {
        tokenId: nft.tokenId,
        name: nft.title || nft.name || `NFT #${nft.tokenId}`,
        description: nft.description || nft.rawMetadata?.description,
        imageUrl,
        contractAddress: nft.contract.address,
        tokenType: nft.tokenType,
        rawMetadata: nft.rawMetadata,
      };
    });

    return nfts;
  } catch (error) {
    console.error("Error fetching NFTs from Alchemy:", error);
    throw new Error("Failed to fetch NFTs from wallet");
  }
}

/**
 * Fetch only Alvara NFTs from the user's wallet
 */
export async function fetchAlvaraNFTs(
  walletAddress: string
): Promise<AlchemyNFT[]> {
  try {
    // Get the current contract address for mainnet (since everything is on mainnet now)
    const contractAddress = CONTRACT_ADDRESSES.mainnet;

    if (!contractAddress) {
      console.warn("❌ No Alvara contract address found for mainnet");
      return [];
    }

    if (!isAlchemyConfigured()) {
      console.warn("❌ Alchemy API key not configured");
      return [];
    }

    console.log(
      `🎨 Fetching Alvara NFTs from contract: ${contractAddress} for wallet: ${walletAddress}`
    );

    const alvaraNFTs = await fetchWalletNFTs(walletAddress, contractAddress);

    // STRICT FILTERING: Double-check that all NFTs are from the correct contract
    const filteredNFTs = alvaraNFTs.filter((nft) => {
      const isFromCorrectContract =
        nft.contractAddress.toLowerCase() === contractAddress.toLowerCase();
      if (!isFromCorrectContract) {
        console.warn(
          `❌ FILTERING OUT NFT ${nft.tokenId} from wrong contract: ${nft.contractAddress} (expected: ${contractAddress})`
        );
      }
      return isFromCorrectContract;
    });

    console.log(
      `✅ Alchemy found ${alvaraNFTs.length} NFTs, ${filteredNFTs.length} from correct contract: ${contractAddress}`
    );

    // Log details of each NFT found
    filteredNFTs.forEach((nft, index) => {
      console.log(
        `📝 NFT ${index + 1}: Token ID ${nft.tokenId}, Name: "${
          nft.name
        }", Contract: ${nft.contractAddress}, Has Image: ${!!nft.imageUrl}`
      );
    });

    return filteredNFTs;
  } catch (error) {
    if (error instanceof Error) {
      console.error("❌ Error fetching Alvara NFTs:", error);
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        walletAddress,
        contractAddress: CONTRACT_ADDRESSES.mainnet,
      });
    } else {
      console.error("❌ Error fetching Alvara NFTs:", error);
      console.error("Error details:", {
        message: String(error),
        walletAddress,
        contractAddress: CONTRACT_ADDRESSES.mainnet,
      });
    }
    return [];
  }
}

/**
 * Get metadata for a specific NFT
 */
export async function fetchNFTMetadata(
  contractAddress: string,
  tokenId: string
): Promise<any> {
  try {
    const metadata: any = await alchemy.nft.getNftMetadata(
      contractAddress,
      tokenId
    );

    return {
      name: metadata.name,
      description: metadata.description,
      image: metadata.image?.originalUrl || metadata.rawMetadata?.image,
      attributes: metadata.rawMetadata?.attributes || [],
      rawMetadata: metadata.rawMetadata,
    };
  } catch (error) {
    console.error(
      `Error fetching metadata for ${contractAddress}:${tokenId}:`,
      error
    );
    return null;
  }
}

/**
 * Check if Alchemy is properly configured
 */
export function isAlchemyConfigured(): boolean {
  const apiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
  return !!(apiKey && apiKey !== "demo");
}

/**
 * Get Alchemy setup instructions
 */
export function getAlchemySetupInstructions(): string[] {
  return [
    "1. Sign up for a free account at https://alchemy.com",
    "2. Create a new app for Ethereum Sepolia testnet",
    "3. Copy your API key from the dashboard",
    "4. Add NEXT_PUBLIC_ALCHEMY_API_KEY=your_api_key to your .env file",
    "5. Restart your development server",
  ];
}
