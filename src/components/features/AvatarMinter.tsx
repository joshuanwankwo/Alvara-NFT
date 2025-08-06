"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Check,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { useAccount } from "wagmi";
import { Notification } from "../ui/Notification";
import Image from "next/image";
import logo from "../../../public/images/nft.png";

interface AlvaraNFT {
  id: string;
  number: number;
  name: string;
  description: string;
  price: number;
}

const alvaraNFTs = [
  {
    id: "001",
    number: 1,
    name: "Radiant Alvara #001",
    description:
      "This is a unique Alvara NFT. Its rarity is unmatched, and its brilliance is captured forever on the blockchain. A true digital gem.",
    price: 0.01,
  },
  {
    id: "002",
    number: 2,
    name: "Radiant Alvara #002",
    description:
      "A rare diamond with exceptional clarity and brilliance. Each facet reflects the future of digital art and blockchain technology.",
    price: 0.01,
  },
  {
    id: "003",
    number: 3,
    name: "Radiant Alvara #003",
    description:
      "The perfect combination of rarity and beauty. This diamond represents the pinnacle of digital collectibles and NFT innovation.",
    price: 0.01,
  },
];

export function AvatarMinter() {
  const { isConnected } = useAccount();
  const [currentNFTIndex, setCurrentNFTIndex] = useState(0);
  const [isMinting, setIsMinting] = useState(false);
  const [mintQuantity, setMintQuantity] = useState(1);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    title: string;
    message?: string;
  } | null>(null);
  const [mintedNFTs, setMintedNFTs] = useState<AlvaraNFT[]>([]);
  const maxQuantity = 3;
  const basePrice = 0.01;
  const alvaDiscount = 0.1;

  const currentNFT = alvaraNFTs[currentNFTIndex];
  const totalPrice = (basePrice * mintQuantity * (1 - alvaDiscount)).toFixed(3);

  const nextNFT = () => {
    setCurrentNFTIndex((prev) => (prev + 1) % alvaraNFTs.length);
  };

  const prevNFT = () => {
    setCurrentNFTIndex(
      (prev) => (prev - 1 + alvaraNFTs.length) % alvaraNFTs.length
    );
  };

  const handleMint = async () => {
    if (!isConnected) return;

    setIsMinting(true);
    setNotification(null);

    setTimeout(() => {
      setIsMinting(false);
      const isSuccess = Math.random() > 0.3;

      if (isSuccess) {
        const newMintedNFTs = Array.from({ length: mintQuantity }, (_, i) => ({
          ...currentNFT,
          id: `${currentNFT.id}-${Date.now()}-${i}`,
        }));
        setMintedNFTs((prev) => [...prev, ...newMintedNFTs]);

        setNotification({
          type: "success",
          title: "Transaction Confirmed!",
          message: `Successfully minted ${mintQuantity} Alvara NFT${
            mintQuantity > 1 ? "s" : ""
          }`,
        });
      } else {
        setNotification({
          type: "error",
          title: "Transaction Failed",
          message: "You rejected the transaction in your wallet.",
        });
      }
    }, 3000);
  };

  const increaseQuantity = () => {
    if (mintQuantity < maxQuantity) {
      setMintQuantity((prev) => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    if (mintQuantity > 1) {
      setMintQuantity((prev) => prev - 1);
    }
  };

  const isMintDisabled = !isConnected || isMinting;

  const closeNotification = () => {
    setNotification(null);
  };

  return (
    <div className="w-full max-w-7xl mt-16">
      <div className="w-full ">
        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
          {/* Left Side - NFT Display */}
          <div className="space-y-4 md:space-y-6 ">
            {/* NFT Card with Navigation */}
            <div className="relative flex items-center justify-center gap-4 sm:gap-6 md:gap-8">
              {/* Left Navigation Arrow */}
              <button
                onClick={prevNFT}
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-[#13061F]/80 hover:bg-[#13061F] rounded-full flex items-center justify-center transition-colors backdrop-blur-sm flex-shrink-0"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
              </button>

              {/* NFT Card */}
              <div className="relative bg-[#13061F]/80 border border-[#D8CDE2]/20 rounded-xl sm:rounded-2xl p-2 sm:p-3 md:p-4 w-full aspect-square max-w-xs sm:max-w-sm md:max-w-md">
                {/* NFT Number Badge - Top Right */}
                <div className="absolute top-3 sm:top-4 md:top-6 right-3 sm:right-4 md:right-6 bg-[#13061F]/60 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-md sm:rounded-lg">
                  <span className="text-white text-xs sm:text-sm font-mono">
                    #{String(currentNFT.number).padStart(3, "0")} / 1000
                  </span>
                </div>

                {/* Glowing Neon Green Alvara */}
                <div className="flex justify-center items-center w-full h-full">
                  <div className="relative w-full h-full">
                    {/* Glowing Alvara Wireframe */}
                    <div className="absolute inset-0">
                      <Image
                        src={logo}
                        alt="Logo"
                        fill
                        className="object-contain"
                        priority
                      />
                    </div>

                    {/* Subtle inner glow */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-32 h-32 bg-gradient-to-br from-neon-green/10 to-transparent rounded-full blur-xl"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Navigation Arrow */}
              <button
                onClick={nextNFT}
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-[#13061F]/80 hover:bg-[#13061F] rounded-full flex items-center justify-center transition-colors backdrop-blur-sm flex-shrink-0"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
              </button>
            </div>

            {/* NFT Title and Description */}
            <div className="text-center space-y-2 sm:space-y-3 md:space-y-4">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                {currentNFT.name}
              </h3>
              <p className="text-[#D8CDE2] leading-relaxed max-w-xs sm:max-w-sm md:max-w-md mx-auto text-xs sm:text-sm md:text-base">
                {currentNFT.description}
              </p>
            </div>
          </div>

          {/* Right Side - Minting Controls */}
          <div className="space-y-4 md:space-y-6 flex justify-center  h-full">
            <div className="bg-[#13061F]/80 border border-[#D8CDE2]/20 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 lg:p-8 space-y-3 sm:space-y-4 max-w-xs sm:max-w-sm md:max-w-md w-full flex flex-col justify-between">
              {/* Price Per NFT */}
              <div className="space-y-4">
                <h3 className="text-[#D8CDE2] text-lg">Price Per NFT</h3>
                <div className="flex items-center">
                  {/* Purple Ethereum Alvara Logo */}
                  <div className="relative w-6 h-6">
                    <Image
                      src={require("../../../public/images/ethlogo.png")}
                      alt="Ethereum Logo"
                      width={28}
                      height={28}
                      className="w-6 h-6 object-contain"
                      priority
                    />
                  </div>
                  <span className="text-white font-bold text-xl md:text-3xl">
                    0.01 ETH
                  </span>
                </div>
                <div className="w-full h-px bg-[#D8CDE2]/30"></div>
              </div>

              {/* Quantity Selector */}
              <div className="flex justify-between items-center">
                <span className="text-[#D8CDE2] text-lg">Quantity</span>
                <div className="flex items-center bg-[#13061F]/60 rounded-lg">
                  <button
                    onClick={decreaseQuantity}
                    disabled={mintQuantity <= 1}
                    className="w-10 h-10 hover:bg-[#D8CDE2]/30 disabled:opacity-50 disabled:cursor-not-allowed rounded-l-lg flex items-center justify-center transition-colors"
                  >
                    <Minus className="w-6 h-6 text-white" />
                  </button>

                  <span className="text-lg md:text-xl font-bold text-white px-4 md:px-6 py-2 min-w-[50px] md:min-w-[60px] text-center">
                    {mintQuantity}
                  </span>

                  <button
                    onClick={increaseQuantity}
                    disabled={mintQuantity >= maxQuantity}
                    className="w-10 h-10 hover:bg-[#D8CDE2]/30 disabled:opacity-50 disabled:cursor-not-allowed rounded-r-lg flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>

              {/* ALVA Holder Discount */}
              <div className="flex justify-between items-center">
                <span className="text-[#D8CDE2] text-lg">
                  $ALVA Holder Discount
                </span>
                <span className="text-[#FC9FB7] font-semibold text-base md:text-lg">
                  -50%
                </span>
              </div>

              {/* Total */}
              <div className="space-y-4">
                <div className="w-full h-px bg-[#D8CDE2]/30"></div>
                <div className="flex justify-between items-center">
                  <span className="text-[#D8CDE2] text-lg">Total</span>
                  <div className="flex items-center ">
                    {/* Purple Ethereum Alvara Logo */}
                    <div className="relative w-6 h-6">
                      <Image
                        src={require("../../../public/images/ethlogo.png")}
                        alt="Ethereum Logo"
                        width={24}
                        height={24}
                        className="w-6 h-6"
                        priority
                      />
                    </div>
                    <span className="text-white font-bold text-xl md:text-3xl">
                      {totalPrice} ETH
                    </span>
                  </div>
                </div>
              </div>

              {/* Mint Button */}
              <button
                onClick={handleMint}
                disabled={isMintDisabled}
                className="w-full bg-[#D73D80] hover:bg-[#D73D80]/80 text-white font-bold py-3 md:py-4 px-4 md:px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-base md:text-lg"
              >
                {isMinting ? "MINTING..." : "Mint Now"}
              </button>

              <p className="text-[#D8CDE2]/70 text-xs text-center">
                Max 3 per wallet. 1 per wallet in the first hour.
              </p>
            </div>
          </div>
        </div>

        {/* Your Minted Alvaras Section */}
        {/* <div className="mt-16">
          <h2 className="text-2xl font-bold text-white mb-6">
            Your Minted Alvaras
          </h2>

          {mintedNFTs.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {mintedNFTs.map((nft, index) => (
                <div
                  key={nft.id}
                  className="bg-[#13061F] border border-[#D8CDE2]/20 rounded-lg p-3"
                >
                  <div className="relative w-full aspect-square mb-2">
                    <div className="absolute inset-0">
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        <polygon
                          points="50,10 80,40 50,90 20,40"
                          fill="none"
                          stroke="#00ff88"
                          strokeWidth="1"
                        />
                      </svg>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-neon-green/20 to-emerald-400/20 rounded"></div>
                    </div>
                  </div>
                  <p className="text-white text-xs font-medium text-center">
                    Alvara #{nft.id}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-[#D8CDE2]/70 text-sm">
                You haven't minted any Alvara NFTs yet.
              </p>
            </div>
          )}
        </div> */}
      </div>

      {/* Notification */}
      {notification && (
        <Notification
          type={notification.type}
          title={notification.title}
          message={notification.message}
          onClose={closeNotification}
        />
      )}
    </div>
  );
}
