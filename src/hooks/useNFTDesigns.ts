"use client";

import { useState, useEffect } from "react";
import { getNFTMetadata, NFTMetadata } from "@/services/nftMetadata";

export function useNFTDesigns() {
  const [designs, setDesigns] = useState<Record<number, NFTMetadata>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDesigns() {
      try {
        setLoading(true);
        setError(null);

        const fetchedDesigns: Record<number, NFTMetadata> = {};

        // Fetch metadata for all 10 designs
        for (let i = 1; i <= 10; i++) {
          try {
            const metadata = await getNFTMetadata(i);
            if (metadata) {
              fetchedDesigns[i] = metadata;
            }
          } catch (err) {
            console.warn(`Failed to fetch metadata for design ${i}:`, err);
          }
        }

        setDesigns(fetchedDesigns);
      } catch (err) {
        console.error("Error fetching NFT designs:", err);
        setError("Failed to load NFT designs");
      } finally {
        setLoading(false);
      }
    }

    fetchDesigns();
  }, []);

  const getDesign = (designId: number): NFTMetadata | null => {
    return designs[designId] || null;
  };

  const getAllDesigns = (): NFTMetadata[] => {
    return Object.values(designs).sort((a, b) => {
      // Extract number from name for sorting
      const aNum = parseInt(a.name.match(/\d+/)?.[0] || "0");
      const bNum = parseInt(b.name.match(/\d+/)?.[0] || "0");
      return aNum - bNum;
    });
  };

  return {
    designs,
    loading,
    error,
    getDesign,
    getAllDesigns,
  };
}
