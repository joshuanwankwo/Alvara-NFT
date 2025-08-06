"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAccount } from "wagmi";
import { useAlvaraMint } from "@/hooks/useAlvaraMint";
import { useNFTDesigns } from "@/hooks/useNFTDesigns";
import { useVeAlvaBalance } from "@/hooks/useAlvaBalance";
import { useWalletNFTs } from "@/hooks/useWalletNFTs";
import { useNotification } from "@/contexts/NotificationContext";
import Image, { StaticImageData } from "next/image";

interface AlvaraNFT {
  id: string;
  number: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

const alvaraNFTs: AlvaraNFT[] = [
  {
    id: "001",
    number: 1,
    name: "Basket Beth",
    description:
      "A savvy trader who knows how to diversify her portfolio and manage risk in the volatile crypto markets.",
    price: 0.01,
    image: "/images/nfts/Basket-Beth.png",
  },
  {
    id: "002",
    number: 2,
    name: "Degen Derrick",
    description:
      "The ultimate risk-taker who goes all-in on high-risk, high-reward opportunities in the crypto space.",
    price: 0.01,
    image: "/images/nfts/Degen-Derrick.png",
  },
  {
    id: "003",
    number: 3,
    name: "Freddy FOMO",
    description:
      "Always chasing the next big thing, Freddy embodies the fear of missing out that drives market momentum.",
    price: 0.01,
    image: "/images/nfts/Freddy-fomo.png",
  },
  {
    id: "004",
    number: 4,
    name: "Gloria Gains",
    description:
      "A successful investor who has mastered the art of taking profits and building wealth through strategic trading.",
    price: 0.01,
    image: "/images/nfts/Gloria-Gains.png",
  },
  {
    id: "005",
    number: 5,
    name: "Henry Hodl",
    description:
      "The patient long-term holder who believes in the fundamentals and diamond hands through market cycles.",
    price: 0.01,
    image: "/images/nfts/Henry-Hodl.png",
  },
  {
    id: "006",
    number: 6,
    name: "Kate Candle",
    description:
      "A technical analysis expert who reads charts like a book and makes decisions based on market patterns.",
    price: 0.01,
    image: "/images/nfts/Kate-Candle.png",
  },
  {
    id: "007",
    number: 7,
    name: "Leroy Leverage",
    description:
      "The aggressive trader who uses leverage to amplify gains, but also risks amplified losses.",
    price: 0.01,
    image: "/images/nfts/Leroy-leverage.png",
  },
  {
    id: "008",
    number: 8,
    name: "Max Effort",
    description:
      "A dedicated crypto enthusiast who puts maximum effort into research, analysis, and community building.",
    price: 0.01,
    image: "/images/nfts/Max-Effort.png",
  },
  {
    id: "009",
    number: 9,
    name: "Sally Swaps",
    description:
      "A DeFi expert who navigates the world of decentralized exchanges and yield farming with ease.",
    price: 0.01,
    image: "/images/nfts/Sally-Swaps.png",
  },
  {
    id: "010",
    number: 10,
    name: "William Banker",
    description:
      "The traditional finance professional who brings institutional knowledge to the crypto revolution.",
    price: 0.01,
    image: "/images/nfts/William-Banker.png",
  },
];

export function AvatarMinter() {
  const { isConnected } = useAccount();
  const [currentNFTIndex, setCurrentNFTIndex] = useState(0);
  const [mintedNFTs, setMintedNFTs] = useState<AlvaraNFT[]>([]);
  const { showNotification } = useNotification();

  // Smart contract integration (behind the scenes)
  const {
    mint,
    isMintLoading,
    isMintSuccess,
    transactionHash,
    isContractDeployed,
    isMintActive,
    standardPrice,
    discountPrice,
  } = useAlvaraMint();

  const { hasDiscount: hasVeAlvaDiscount } = useVeAlvaBalance();

  // User's owned NFTs from wallet
  const {
    ownedNFTs,
    isLoading: isLoadingWalletNFTs,
    error: walletNFTsError,
    refetch: refetchWalletNFTs,
    totalNFTs,
  } = useWalletNFTs();

  // Calculate the actual price based on veALVA discount
  // Force correct prices until contract is redeployed
  const actualPrice = hasVeAlvaDiscount ? "0.005" : "0.01";

  const currentNFT = alvaraNFTs[currentNFTIndex];
  const isMinting = isMintLoading;

  // Listen for successful mints (only once per transaction)
  useEffect(() => {
    if (isMintSuccess && transactionHash) {
      // Check if we've already processed this transaction
      const hasProcessedThis = mintedNFTs.some((nft) =>
        nft.id.includes(transactionHash.slice(-8))
      );

      if (!hasProcessedThis) {
        const newMintedNFT = {
          ...currentNFT,
          id: `${currentNFT.id}-${transactionHash.slice(-8)}`,
        };
        setMintedNFTs((prev) => [...prev, newMintedNFT]);

        showNotification({
          type: "success",
          title: "Transaction Confirmed!",
          message: "Successfully minted your Alvara NFT",
          link: {
            url: `https://sepolia.etherscan.io/tx/${transactionHash}`,
            text: "View Transaction on Etherscan",
          },
        });
      }
    }
  }, [isMintSuccess, transactionHash]); // Removed currentNFT from dependencies

  const nextNFT = () => {
    setCurrentNFTIndex((prev) => (prev + 1) % alvaraNFTs.length);
  };

  const prevNFT = () => {
    setCurrentNFTIndex(
      (prev) => (prev - 1 + alvaraNFTs.length) % alvaraNFTs.length
    );
  };

  const selectNFT = (index: number) => {
    setCurrentNFTIndex(index);
  };

  const handleMint = async () => {
    if (!isConnected) {
      showNotification({
        type: "error",
        title: "Wallet Not Connected",
        message: "Please connect your wallet to mint NFTs.",
      });
      return;
    }

    if (!isContractDeployed() || !isMintActive()) {
      showNotification({
        type: "error",
        title: "Minting Not Available",
        message: "Minting is currently not active. Please try again later.",
      });
      return;
    }

    try {
      console.log(
        "Starting mint for NFT:",
        currentNFT.number,
        "with discount:",
        hasVeAlvaDiscount
      );
      console.log("Expected price:", actualPrice, "ETH");

      // Use real smart contract minting with the design mapped to currentNFT number
      await mint(currentNFT.number, hasVeAlvaDiscount);
    } catch (error: any) {
      console.error("Minting error details:", {
        error,
        message: error?.message,
        code: error?.code,
        reason: error?.reason,
        currentNFT: currentNFT.number,
        hasDiscount: hasVeAlvaDiscount,
        expectedPrice: actualPrice,
      });

      let errorMessage = "Failed to mint NFT. Please try again.";
      let errorTitle = "Transaction Failed";

      // Always show an error notification to the user
      if (error?.message) {
        if (
          error.message.includes("User rejected") ||
          error.message.includes("user rejected")
        ) {
          errorTitle = "Transaction Cancelled";
          errorMessage =
            "You cancelled the transaction. Please try again when ready.";
        } else if (
          error.message.includes("insufficient funds") &&
          !error.message.includes("Insufficient ETH sent")
        ) {
          errorTitle = "Insufficient Wallet Balance";
          errorMessage = `You don't have enough ETH in your wallet. You need at least ${actualPrice} ETH to mint this NFT.`;
        } else if (
          error.message.includes("Insufficient ETH sent") ||
          error.reason?.includes("Insufficient ETH sent")
        ) {
          errorTitle = "Incorrect ETH Amount";
          errorMessage = `The contract expected ${actualPrice} ETH ${
            hasVeAlvaDiscount ? "(with veALVA discount)" : "(standard price)"
          }, but received a different amount. This might be due to veALVA balance not meeting the discount threshold of 1.5 tokens.`;
        } else if (error.message.includes("execution reverted")) {
          errorTitle = "Smart Contract Error";
          if (error.reason) {
            errorMessage = `Contract error: ${error.reason}`;
          } else {
            errorMessage =
              "The smart contract rejected the transaction. Please check your veALVA token balance if trying to use discount pricing.";
          }
        } else if (
          error.message.includes("timeout") ||
          error.message.includes("took too long")
        ) {
          errorTitle = "Network Timeout";
          errorMessage =
            "The network is slow. Please try again or switch to a faster network connection.";
        } else if (
          error.message.includes("Network Error") ||
          error.message.includes("fetch")
        ) {
          errorTitle = "Network Error";
          errorMessage =
            "Unable to connect to the blockchain. Please check your internet connection and try again.";
        } else {
          // Fallback for any other error
          errorMessage = `Error: ${error.message || "Unknown error occurred"}`;
        }
      } else {
        // Fallback for errors without a message
        errorTitle = "Unknown Error";
        errorMessage =
          "An unexpected error occurred. Please try again or contact support if the issue persists.";
      }

      // Always show notification for any error
      showNotification({
        type: "error",
        title: errorTitle,
        message: errorMessage,
      });
    }
  };

  const isMintDisabled =
    !isConnected ||
    isMinting ||
    !isContractDeployed() ||
    !isMintActive() ||
    mintedNFTs.length >= 3;

  const shareOnX = (nft: AlvaraNFT, transactionHash?: string) => {
    const url = transactionHash
      ? `https://sepolia.etherscan.io/tx/${transactionHash}`
      : "https://alvara-nft.com";
    const text = `🎉 Just minted ${nft.name}! 

✨ ${nft.description}

Check it out on the blockchain! #AlvaraNFT #NFT #Ethereum #Blockchain`;

    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text
    )}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, "_blank");
  };

  return (
    <div className="w-full pb-8">
      <div className="w-full flex flex-col space-y-4">
        {/* Avatar Display */}
        <div className="flex items-center justify-center">
          <div
            style={{
              width: "250px",
              height: "250px",
              background: "#FDF2FF",
              border: "0.67px solid #786185",
              padding: "8.02px",
              gap: "21.39px",
              transform: "rotate(0deg)",
              opacity: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              paddingBottom: "10px",
            }}
          >
            <div
              className="relative"
              style={{
                width: "100%",
                height: "100%",
              }}
            >
              <Image
                src={currentNFT.image}
                alt={currentNFT.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>

        {/* Carousel Dots */}
        <div className="flex items-center justify-center gap-1.5 mb-2">
          {alvaraNFTs.map((_, index) => (
            <button
              key={index}
              onClick={() => selectNFT(index)}
              className="transition-all duration-200"
              style={{
                width: index === currentNFTIndex ? "8px" : "6px",
                height: index === currentNFTIndex ? "8px" : "6px",
                borderRadius: "50%",
                background: index === currentNFTIndex ? "#D73D80" : "#B199B5",
                border: "none",
                cursor: "pointer",
              }}
            />
          ))}
        </div>

        {/* Navigation arrows */}
        <div className="flex justify-between items-center px-4">
          <button
            onClick={prevNFT}
            className="p-2 rounded-full hover:bg-white/10 transition-colors duration-200"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <div className="text-center text-white">
            <p className="text-sm opacity-75">
              Minted: {mintedNFTs.length} / 3
            </p>
          </div>
          <button
            onClick={nextNFT}
            className="p-2 rounded-full hover:bg-white/10 transition-colors duration-200"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* NFT Info */}
        <div className="text-center space-y-2">
          <h3
            className="text-white text-lg font-semibold"
            style={{
              fontFamily: "Titillium Web",
              fontWeight: 600,
              fontSize: "18px",
              lineHeight: "27px",
            }}
          >
            {currentNFT.name}
          </h3>
          <p
            className="text-[#D8CDE2] text-sm"
            style={{
              fontFamily: "Titillium Web",
              fontWeight: 400,
              fontSize: "14px",
              lineHeight: "21px",
            }}
          >
            {currentNFT.description}
          </p>
        </div>

        {/* Price and Discount Info */}
        <div className="text-center space-y-1">
          <div className="flex items-center justify-center gap-2">
            <span
              className="text-white text-xl font-bold"
              style={{
                fontFamily: "Titillium Web",
                fontWeight: 700,
                fontSize: "20px",
                lineHeight: "30px",
              }}
            >
              {actualPrice} ETH
            </span>
            {hasVeAlvaDiscount && (
              <span
                className="text-xs bg-[#D73D80] text-white px-2 py-1 rounded-full"
                style={{
                  fontFamily: "Titillium Web",
                  fontWeight: 600,
                  fontSize: "11px",
                }}
              >
                veALVA DISCOUNT
              </span>
            )}
          </div>
        </div>

        {/* Mint Button */}
        <div className="flex justify-center pb-10">
          <button
            onClick={handleMint}
            disabled={isMintDisabled}
            className={`${
              isMintDisabled
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-[#D73D80] hover:bg-[#B8316C] text-white"
            } px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform ${
              !isMintDisabled ? "hover:scale-105 active:scale-95" : ""
            }`}
            style={{
              fontFamily: "Titillium Web",
              fontWeight: 600,
              fontSize: "16px",
              lineHeight: "24px",
            }}
          >
            {isMinting
              ? "Minting..."
              : !isConnected
              ? "Connect Wallet to Mint"
              : !isContractDeployed()
              ? "Contract Not Available"
              : !isMintActive()
              ? "Minting Inactive"
              : "Mint NFT"}
          </button>
        </div>
      </div>
    </div>
  );
}
