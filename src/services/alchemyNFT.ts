import { Alchemy, Network, OwnedNftsResponse, Nft } from "alchemy-sdk";
import { CONTRACT_ADDRESSES } from "@/contracts/addresses";

// Alchemy configuration
const config = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || "demo", // Demo key for development
  network: Network.ETH_SEPOLIA, // Sepolia testnet
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
      ? { contractAddresses: [contractAddress] }
      : undefined;

    const response: OwnedNftsResponse = await alchemy.nft.getNftsForOwner(
      walletAddress,
      options
    );

    console.log(`📦 Found ${response.ownedNfts.length} NFTs`);

    // Transform Alchemy NFTs to our format
    const nfts: AlchemyNFT[] = response.ownedNfts.map((nft: any) => ({
      tokenId: nft.tokenId,
      name: nft.name || `NFT #${nft.tokenId}`,
      description: nft.description,
      imageUrl:
        nft.image?.pngUrl || nft.image?.originalUrl || nft.rawMetadata?.image,
      contractAddress: nft.contract.address,
      tokenType: nft.tokenType,
      rawMetadata: nft.rawMetadata,
    }));

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
    // Get the current contract address for Sepolia
    const contractAddress = CONTRACT_ADDRESSES.sepolia;

    if (!contractAddress) {
      console.warn("No Alvara contract address found for Sepolia");
      return [];
    }

    console.log(`🎨 Fetching Alvara NFTs from contract: ${contractAddress}`);

    const alvaraNFTs = await fetchWalletNFTs(walletAddress, contractAddress);

    console.log(`✅ Found ${alvaraNFTs.length} Alvara NFTs`);

    return alvaraNFTs;
  } catch (error) {
    console.error("Error fetching Alvara NFTs:", error);
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
