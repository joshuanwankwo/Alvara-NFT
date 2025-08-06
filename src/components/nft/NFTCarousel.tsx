import React, { useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { NFTDesign } from "../../services/nftMetadata";
import NFTCard from "./NFTCard";

interface NFTCarouselProps {
  designs: NFTDesign[];
  selectedDesignId: number;
  onDesignSelect: (designId: number) => void;
  isLoading?: boolean;
}

export default function NFTCarousel({
  designs,
  selectedDesignId,
  onDesignSelect,
  isLoading = false,
}: NFTCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Update currentIndex when selectedDesignId changes
  useEffect(() => {
    const index = designs.findIndex((design) => design.id === selectedDesignId);
    if (index !== -1) {
      setCurrentIndex(index);
    }
  }, [selectedDesignId, designs]);

  const goToPrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : designs.length - 1;
    setCurrentIndex(newIndex);
    onDesignSelect(designs[newIndex].id);
  };

  const goToNext = () => {
    const newIndex = currentIndex < designs.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(newIndex);
    onDesignSelect(designs[newIndex].id);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    onDesignSelect(designs[index].id);
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="aspect-square bg-gray-800 rounded-xl animate-pulse flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading NFT designs...</p>
          </div>
        </div>
      </div>
    );
  }

  if (designs.length === 0) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="aspect-square bg-gray-800 rounded-xl flex items-center justify-center">
          <div className="text-center text-gray-400">
            <p>No NFT designs available</p>
          </div>
        </div>
      </div>
    );
  }

  const currentDesign = designs[currentIndex];

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      {/* Main NFT Display */}
      <div className="relative">
        <NFTCard
          design={currentDesign}
          isSelected={true}
          showFullDetails={true}
        />

        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm"
          aria-label="Previous NFT"
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </button>

        <button
          onClick={goToNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm"
          aria-label="Next NFT"
        >
          <ChevronRightIcon className="w-6 h-6" />
        </button>
      </div>

      {/* Thumbnail Indicators */}
      <div className="flex justify-center space-x-2 px-4">
        {designs.map((design, index) => (
          <button
            key={design.id}
            onClick={() => goToSlide(index)}
            className={`
              w-12 h-12 rounded-lg overflow-hidden border-2 transition-all duration-200
              ${
                index === currentIndex
                  ? "border-blue-500 scale-110"
                  : "border-gray-600 hover:border-gray-400 opacity-70 hover:opacity-100"
              }
            `}
            aria-label={`Select ${design.metadata.name}`}
          >
            <img
              src={design.imageUrl}
              alt={design.metadata.name}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Design Counter */}
      <div className="text-center text-gray-400 text-sm">
        {currentIndex + 1} of {designs.length} designs
      </div>

      {/* Keyboard Navigation Hint */}
      <div className="text-center text-xs text-gray-500">
        Use ← → arrow keys or click thumbnails to navigate
      </div>
    </div>
  );
}

// Add keyboard navigation
export function useKeyboardNavigation(
  designs: NFTDesign[],
  currentIndex: number,
  onNavigate: (direction: "prev" | "next") => void
) {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        onNavigate("prev");
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        onNavigate("next");
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [onNavigate]);
}
