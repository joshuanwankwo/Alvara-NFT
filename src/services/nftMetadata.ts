// NFT Metadata fetching service
import axios from "axios";

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
  external_url?: string;
  background_color?: string;
}

// IPFS gateway URLs to try (in order of preference)
const IPFS_GATEWAYS = [
  "https://ipfs.io/ipfs/",
  "https://gateway.pinata.cloud/ipfs/",
  "https://cloudflare-ipfs.com/ipfs/",
  "https://dweb.link/ipfs/",
  "https://ipfs.fleek.co/ipfs/",
];

// Function to get IPFS URL from hash
export function getIPFSURL(hash: string): string {
  return `${IPFS_GATEWAYS[0]}${hash}`;
}

// Function to fetch metadata from IPFS with fallback gateways
export async function fetchNFTMetadata(
  metadataHash: string
): Promise<NFTMetadata | null> {
  for (const gateway of IPFS_GATEWAYS) {
    try {
      const url = `${gateway}${metadataHash}`;
      console.log(`🔍 Fetching metadata from: ${url}`);

      const response = await axios.get(url, {
        timeout: 10000, // 10 second timeout
        headers: {
          Accept: "application/json",
        },
      });

      if (response.status === 200 && response.data) {
        console.log(`✅ Metadata fetched successfully from ${gateway}`);
        return response.data as NFTMetadata;
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.warn(`⚠️ Failed to fetch from ${gateway}:`, errorMessage);
      continue;
    }
  }

  console.error(
    `❌ Failed to fetch metadata from all gateways for hash: ${metadataHash}`
  );
  return null;
}

// Function to get image URL from IPFS hash
export function getNFTImageURL(imageHash: string): string {
  return getIPFSURL(imageHash);
}

// Function to fetch multiple NFT metadata
export async function fetchMultipleNFTMetadata(
  metadataHashes: string[]
): Promise<(NFTMetadata | null)[]> {
  const promises = metadataHashes.map((hash) => fetchNFTMetadata(hash));
  return Promise.all(promises);
}

// Local metadata fallback (for development/testing)
export const LOCAL_METADATA: Record<number, NFTMetadata> = {
  1: {
    name: "Basket Beth",
    description:
      "A savvy trader who knows how to diversify her portfolio and manage risk in the volatile crypto markets.",
    image: "/images/nfts/Basket-Beth.png",
    attributes: [
      { trait_type: "Trading Style", value: "Conservative" },
      { trait_type: "Risk Level", value: "Low" },
      { trait_type: "Strategy", value: "Diversification" },
    ],
  },
  2: {
    name: "Degen Derrick",
    description:
      "The ultimate risk-taker who goes all-in on high-risk, high-reward opportunities in the crypto space.",
    image: "/images/nfts/Degen-Derrick.png",
    attributes: [
      { trait_type: "Trading Style", value: "Aggressive" },
      { trait_type: "Risk Level", value: "Extreme" },
      { trait_type: "Strategy", value: "All-in" },
    ],
  },
  3: {
    name: "Freddy FOMO",
    description:
      "Always chasing the next big thing, Freddy embodies the fear of missing out that drives market momentum.",
    image: "/images/nfts/Freddy-fomo.png",
    attributes: [
      { trait_type: "Trading Style", value: "FOMO" },
      { trait_type: "Risk Level", value: "High" },
      { trait_type: "Strategy", value: "Momentum" },
    ],
  },
  4: {
    name: "Gloria Gains",
    description:
      "A successful investor who has mastered the art of taking profits and building wealth through strategic trading.",
    image: "/images/nfts/Gloria-Gains.png",
    attributes: [
      { trait_type: "Trading Style", value: "Profitable" },
      { trait_type: "Risk Level", value: "Medium" },
      { trait_type: "Strategy", value: "Profit Taking" },
    ],
  },
  5: {
    name: "Henry Hodl",
    description:
      "The patient long-term holder who believes in the fundamentals and diamond hands through market cycles.",
    image: "/images/nfts/Henry-Hodl.png",
    attributes: [
      { trait_type: "Trading Style", value: "Long-term" },
      { trait_type: "Risk Level", value: "Low" },
      { trait_type: "Strategy", value: "HODL" },
    ],
  },
  6: {
    name: "Kate Candle",
    description:
      "A technical analysis expert who reads charts like a book and makes decisions based on market patterns.",
    image: "/images/nfts/Kate-Candle.png",
    attributes: [
      { trait_type: "Trading Style", value: "Technical" },
      { trait_type: "Risk Level", value: "Medium" },
      { trait_type: "Strategy", value: "Chart Analysis" },
    ],
  },
  7: {
    name: "Leroy Leverage",
    description:
      "The aggressive trader who uses leverage to amplify gains, but also risks amplified losses.",
    image: "/images/nfts/Leroy-leverage.png",
    attributes: [
      { trait_type: "Trading Style", value: "Leverage" },
      { trait_type: "Risk Level", value: "Extreme" },
      { trait_type: "Strategy", value: "Amplified" },
    ],
  },
  8: {
    name: "Max Effort",
    description:
      "A dedicated crypto enthusiast who puts maximum effort into research, analysis, and community building.",
    image: "/images/nfts/Max-Effort.png",
    attributes: [
      { trait_type: "Trading Style", value: "Research" },
      { trait_type: "Risk Level", value: "Medium" },
      { trait_type: "Strategy", value: "Fundamental" },
    ],
  },
  9: {
    name: "Sally Swaps",
    description:
      "A DeFi expert who navigates the world of decentralized exchanges and yield farming with ease.",
    image: "/images/nfts/Sally-Swaps.png",
    attributes: [
      { trait_type: "Trading Style", value: "DeFi" },
      { trait_type: "Risk Level", value: "High" },
      { trait_type: "Strategy", value: "Yield Farming" },
    ],
  },
  10: {
    name: "William Banker",
    description:
      "The traditional finance professional who brings institutional knowledge to the crypto revolution.",
    image: "/images/nfts/William-Banker.png",
    attributes: [
      { trait_type: "Trading Style", value: "Institutional" },
      { trait_type: "Risk Level", value: "Low" },
      { trait_type: "Strategy", value: "Traditional" },
    ],
  },
};

// Function to get metadata with fallback to local data
export async function getNFTMetadata(
  designId: number,
  metadataHash?: string
): Promise<NFTMetadata | null> {
  // Try to fetch from IPFS first if hash is provided
  if (metadataHash) {
    const ipfsMetadata = await fetchNFTMetadata(metadataHash);
    if (ipfsMetadata) {
      return ipfsMetadata;
    }
  }

  // Fallback to local metadata
  return LOCAL_METADATA[designId] || null;
}
