// NFT Metadata fetching service
import axios from "axios";

export interface NFTAttribute {
  trait_type: string;
  value: string | number;
  max_value?: number;
  display_type?: string;
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  external_url?: string;
  attributes: NFTAttribute[];
  background_color?: string;
}

export interface NFTDesign {
  id: number;
  metadata: NFTMetadata;
  ipfsHash: string;
  imageUrl: string;
}

// IPFS hashes for each design (from our deployed contract)
const DESIGN_METADATA_HASHES: { [key: number]: string } = {
  1: "QmXci1VZWjwJAmY28uuSPpCtfWg2BAt2PLjFZpC5Q5T8rr",
  2: "QmZYgMkkvAoG24TZmkBHbEZsqEjfacUECPF6sginF3Yu3r",
  3: "bafkreifeq5mioachviwmi47mjruharcn45t24trqctoj6czlffzdgmolr4",
  4: "QmUu5k6jL34K2UutvrbdPFVFMjU9Jz2NocuTW15uP1Dj7x",
  5: "QmVxkPDZEBd74XVimxPpNtWjPJ6NvFfnZrc5uvP3BTmL7C",
  6: "QmV37ntf4A6oFoQtouR8rjjkBLbitMPveDqpV33p4sYqhQ",
  7: "QmRGDXEwAW1yzktvQiMcc4ANu4vQ3wB6T4ZAF5B4TTZiYb",
  8: "QmayaiJDu9r9Twf5g5vxdM6tBs6paUW1Kw5tfy1jG3kaF7",
  9: "QmSeQoXAFLCi9APN1p65M8hpJkf2HAs14xufzsWatEss9r",
  10: "QmVhB2DvE4voqpEb42ptdVJA9mpNjiWuoUDRcjR2CAJQTh",
};

// Direct image IPFS hashes for fallback
const DESIGN_IMAGE_HASHES: { [key: number]: string } = {
  1: "QmQL5TA5vZnfPcuGadCCbLvKrFRLkMxUQJHMKkPtZNkqnC",
  2: "QmZQyHcMwBZAMdqibb6EvzGiMoyVWWshhL3e4oG8M2CwR9",
  3: "QmPh2sqsN6eVeCSkPmHBetXgJkn9eYxpG3aH4keBmhNjdy",
  4: "QmVFKDAU4ozwHxwCWuzcFfGeDg9pnhvPyJ4Nt9R9fmc3sH",
  5: "QmamjSetmP4uf5EzJMyLPAw1NfCxGyg9nLAE8jVZa7qn9N",
  6: "QmNrAcbzpyuU1kfQUrZwZnjPzMKathT94RgsiWQMPp3APJ",
  7: "QmPVUMX5kWExhf5iytChdbrGrCPyVSw2yUkqx15XvV6JTG",
  8: "QmerDFavFcjGJ76wt8xquUmPFu83SGqfmoTXsqt7mLd9jj",
  9: "QmVo5yLrxK4x6iYmAdo4o1KEufJhxyoNyRuR32S9bcs4S3",
  10: "QmeQLFFh2QcnaymSHoRnJqUJPXDDE61z33Yo8wRDEK3EgJ",
};

const PINATA_GATEWAY = "https://gateway.pinata.cloud/ipfs/";

/**
 * Fetch metadata for a specific NFT design from IPFS
 */
export async function fetchNFTMetadata(
  designId: number
): Promise<NFTDesign | null> {
  try {
    const ipfsHash = DESIGN_METADATA_HASHES[designId];

    // For designs without metadata (like #3), create fallback metadata
    if (!ipfsHash) {
      console.warn(
        `No metadata IPFS hash found for design ${designId}, using fallback`
      );
      const imageHash = DESIGN_IMAGE_HASHES[designId];

      if (!imageHash) {
        console.error(`No image hash found for design ${designId}`);
        return null;
      }

      // Create fallback metadata
      const fallbackMetadata: NFTMetadata = {
        name: `Alvara #${designId}`,
        description: `A unique Alvara NFT with design ${designId}. Part of the exclusive Alvara collection.`,
        image: `ipfs://${imageHash}`,
        attributes: [
          { trait_type: "Design ID", value: designId },
          { trait_type: "Rarity", value: "Common" },
          { trait_type: "Collection", value: "Alvara" },
        ],
      };

      return {
        id: designId,
        metadata: fallbackMetadata,
        ipfsHash: imageHash, // Use image hash as fallback
        imageUrl: `${PINATA_GATEWAY}${imageHash}`,
      };
    }

    const metadataUrl = `${PINATA_GATEWAY}${ipfsHash}`;
    console.log(`Fetching metadata for design ${designId}:`, metadataUrl);

    const response = await axios.get<NFTMetadata>(metadataUrl, {
      timeout: 10000, // 10 second timeout
    });

    const metadata = response.data;

    // Convert IPFS image URL to gateway URL for display
    let imageUrl = metadata.image;
    if (imageUrl.startsWith("ipfs://")) {
      const imageHash = imageUrl.replace("ipfs://", "");
      imageUrl = `${PINATA_GATEWAY}${imageHash}`;
    }

    return {
      id: designId,
      metadata,
      ipfsHash,
      imageUrl,
    };
  } catch (error) {
    console.error(`Failed to fetch metadata for design ${designId}:`, error);

    // Fallback: try to create design with just image
    const imageHash = DESIGN_IMAGE_HASHES[designId];
    if (imageHash) {
      console.log(`Using fallback image for design ${designId}`);
      const fallbackMetadata: NFTMetadata = {
        name: `Alvara #${designId}`,
        description: `A unique Alvara NFT with design ${designId}.`,
        image: `ipfs://${imageHash}`,
        attributes: [
          { trait_type: "Design ID", value: designId },
          { trait_type: "Rarity", value: "Common" },
        ],
      };

      return {
        id: designId,
        metadata: fallbackMetadata,
        ipfsHash: imageHash,
        imageUrl: `${PINATA_GATEWAY}${imageHash}`,
      };
    }

    return null;
  }
}

/**
 * Fetch metadata for all available NFT designs
 */
export async function fetchAllNFTDesigns(): Promise<NFTDesign[]> {
  console.log("Fetching metadata for all NFT designs...");

  const designIds = Object.keys(DESIGN_METADATA_HASHES).map(Number);
  const fetchPromises = designIds.map((id) => fetchNFTMetadata(id));

  try {
    const results = await Promise.allSettled(fetchPromises);

    const successfulDesigns = results
      .map((result, index) => {
        if (result.status === "fulfilled" && result.value) {
          return result.value;
        } else {
          console.error(`Failed to fetch design ${designIds[index]}`);
          return null;
        }
      })
      .filter((design): design is NFTDesign => design !== null)
      .sort((a, b) => a.id - b.id); // Sort by design ID

    console.log(`Successfully fetched ${successfulDesigns.length} NFT designs`);
    return successfulDesigns;
  } catch (error) {
    console.error("Error fetching NFT designs:", error);
    return [];
  }
}

/**
 * Get rarity color based on rarity level
 */
export function getRarityColor(rarity: string): string {
  switch (rarity.toLowerCase()) {
    case "legendary":
      return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
    case "epic":
      return "text-purple-400 bg-purple-400/10 border-purple-400/20";
    case "rare":
      return "text-blue-400 bg-blue-400/10 border-blue-400/20";
    case "uncommon":
      return "text-green-400 bg-green-400/10 border-green-400/20";
    case "common":
      return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    default:
      return "text-gray-400 bg-gray-400/10 border-gray-400/20";
  }
}

/**
 * Format attribute value for display
 */
export function formatAttributeValue(attribute: NFTAttribute): string {
  if (attribute.display_type === "boost_percentage") {
    return `${attribute.value}%`;
  }
  if (attribute.display_type === "date") {
    return new Date(Number(attribute.value) * 1000).toLocaleDateString();
  }
  if (attribute.max_value && typeof attribute.value === "number") {
    return `${attribute.value}/${attribute.max_value}`;
  }
  return String(attribute.value);
}
