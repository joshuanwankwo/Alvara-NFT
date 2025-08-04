import { useState, useEffect } from "react";
import { NFTDesign, fetchAllNFTDesigns } from "../services/nftMetadata";

interface UseNFTDesignsResult {
  designs: NFTDesign[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useNFTDesigns(): UseNFTDesignsResult {
  const [designs, setDesigns] = useState<NFTDesign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDesigns = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log("Fetching NFT designs from IPFS...");
      const fetchedDesigns = await fetchAllNFTDesigns();

      if (fetchedDesigns.length === 0) {
        setError(
          "No NFT designs could be loaded. Please check your connection."
        );
      } else {
        setDesigns(fetchedDesigns);
        console.log(`Successfully loaded ${fetchedDesigns.length} NFT designs`);
      }
    } catch (err) {
      console.error("Error fetching NFT designs:", err);
      setError("Failed to load NFT designs. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = async () => {
    await fetchDesigns();
  };

  useEffect(() => {
    fetchDesigns();
  }, []);

  return {
    designs,
    isLoading,
    error,
    refetch,
  };
}
