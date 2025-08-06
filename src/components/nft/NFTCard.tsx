import React from "react";
import {
  NFTDesign,
  getRarityColor,
  formatAttributeValue,
} from "../../services/nftMetadata";

interface NFTCardProps {
  design: NFTDesign;
  isSelected?: boolean;
  onSelect?: () => void;
  showFullDetails?: boolean;
}

export default function NFTCard({
  design,
  isSelected = false,
  onSelect,
  showFullDetails = false,
}: NFTCardProps) {
  const { metadata, imageUrl } = design;

  // Get rarity attribute for styling
  const rarityAttribute = metadata.attributes.find(
    (attr) => attr.trait_type.toLowerCase() === "rarity"
  );
  const rarity = (rarityAttribute?.value as string) || "Common";
  const rarityClasses = getRarityColor(rarity);

  return (
    <div
      className={`
        relative rounded-xl overflow-hidden transition-all duration-300 cursor-pointer
        ${
          isSelected
            ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-900 scale-105"
            : "hover:scale-102 hover:shadow-lg"
        }
        bg-gray-800/50 backdrop-blur-sm border border-gray-700/50
      `}
      onClick={onSelect}
      style={{
        backgroundColor: metadata.background_color
          ? `#${metadata.background_color}20`
          : undefined,
      }}
    >
      {/* NFT Image */}
      <div className="aspect-square relative overflow-hidden">
        <img
          src={imageUrl}
          alt={metadata.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          loading="lazy"
          onError={(e) => {
            // Fallback if image fails to load
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder-nft.png";
          }}
        />

        {/* Rarity Badge */}
        <div
          className={`
          absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-semibold
          border backdrop-blur-sm ${rarityClasses}
        `}
        >
          {rarity}
        </div>

        {/* Selection Indicator */}
        {isSelected && (
          <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
            <div className="bg-blue-500 rounded-full p-2">
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* NFT Info */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-white mb-2 truncate">
          {metadata.name}
        </h3>

        <p className="text-gray-300 text-sm mb-3 line-clamp-2">
          {metadata.description}
        </p>

        {/* Key Attributes */}
        <div className="space-y-2">
          {metadata.attributes
            .filter((attr) =>
              ["Collection", "Element", "Color Scheme"].includes(
                attr.trait_type
              )
            )
            .slice(0, showFullDetails ? 10 : 3)
            .map((attribute, index) => (
              <div
                key={index}
                className="flex justify-between items-center text-sm"
              >
                <span className="text-gray-400">{attribute.trait_type}:</span>
                <span className="text-white font-medium">
                  {formatAttributeValue(attribute)}
                </span>
              </div>
            ))}
        </div>

        {/* Energy Level Progress Bar */}
        {(() => {
          const energyAttr = metadata.attributes.find(
            (attr) => attr.trait_type === "Energy Level"
          );
          if (energyAttr && typeof energyAttr.value === "number") {
            const percentage = energyAttr.max_value
              ? (energyAttr.value / energyAttr.max_value) * 100
              : energyAttr.value;

            return (
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Energy Level</span>
                  <span>
                    {energyAttr.value}
                    {energyAttr.max_value ? `/${energyAttr.max_value}` : ""}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
              </div>
            );
          }
          return null;
        })()}

        {/* External URL */}
        {metadata.external_url && (
          <a
            href={metadata.external_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            View Details →
          </a>
        )}
      </div>
    </div>
  );
}
