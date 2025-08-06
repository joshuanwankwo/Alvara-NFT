"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  AlertCircle,
  X,
} from "lucide-react";
import { useAccount } from "wagmi";
import { Notification } from "../ui/Notification";
import { useAlvaraMint } from "@/hooks/useAlvaraMint";
import { useNFTDesigns } from "@/hooks/useNFTDesigns";
import { useWalletNFTs } from "@/hooks/useWalletNFTs";
import { useVeAlvaBalance } from "@/hooks/useAlvaBalance";
import logo from "../../../public/images/nft.png";

export function AvatarMinter() {
  const { isConnected } = useAccount();
  const [selectedDesignId, setSelectedDesignId] = useState(1);
  const [mintQuantity, setMintQuantity] = useState(1);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    title: string;
    message?: string;
    link?: {
      url: string;
      text: string;
    };
  } | null>(null);

  const lastMintProcessed = useRef<boolean>(false);

  // NFT designs from IPFS
  const {
    designs,
    isLoading: isLoadingDesigns,
    error: designsError,
  } = useNFTDesigns();

  // User's owned NFTs from wallet
  const {
    ownedNFTs,
    isLoading: isLoadingWalletNFTs,
    error: walletNFTsError,
    refetch: refetchWalletNFTs,
    totalNFTs,
  } = useWalletNFTs();

  // Smart contract integration
  const {
    standardPrice,
    discountPrice,
    userNftBalance,
    getRemainingMints,
    isMintActive,
    isContractDeployed,
    mint,
    isMintLoading,
    isMintSuccess,
    transactionHash,
  } = useAlvaraMint();

  // veALVA token balance on mainnet
  const {
    veAlvaBalance,
    isLoading: isLoadingVeAlva,
    error: veAlvaError,
    refreshBalance: refreshVeAlvaBalance,
    hasDiscount: hasVeAlvaDiscount,
    balance: veAlvaBalanceAmount,
    symbol: veAlvaSymbol,
  } = useVeAlvaBalance();

  const currentDesign = designs.find((d) => d.id === selectedDesignId);
  const maxQuantity = Math.min(10, getRemainingMints());

  // Calculate total price based on discount
  const totalPrice = hasVeAlvaDiscount
    ? (parseFloat(discountPrice || "0.000275") * mintQuantity).toFixed(6)
    : (parseFloat(standardPrice || "0.00055") * mintQuantity).toFixed(6);

  // Alias for the mint loading state
  const isMinting = isMintLoading;

  // Listen for successful mints
  useEffect(() => {
    if (isMintSuccess && designs.length > 0 && !lastMintProcessed.current) {
      lastMintProcessed.current = true;

      setNotification({
        type: "success",
        title: "🎉 Minting Successful!",
        message: `Successfully minted ${mintQuantity} Alvara NFT${
          mintQuantity > 1 ? "s" : ""
        }! Your new NFT${mintQuantity > 1 ? "s are" : " is"} ready.`,
        link: transactionHash
          ? {
              url: `https://sepolia.etherscan.io/tx/${transactionHash}`,
              text: "View Transaction on Etherscan",
            }
          : undefined,
      });

      // Refetch wallet NFTs after successful mint
      setTimeout(() => {
        refetchWalletNFTs();
      }, 3000);
    }
  }, [
    isMintSuccess,
    mintQuantity,
    selectedDesignId,
    designs,
    refetchWalletNFTs,
  ]);

  // Reset the mint processed flag when mint success becomes false
  useEffect(() => {
    if (!isMintSuccess) {
      lastMintProcessed.current = false;
    }
  }, [isMintSuccess]);

  const handleMint = async () => {
    if (!isConnected) {
      setNotification({
        type: "error",
        title: "Wallet Not Connected",
        message: "Please connect your wallet to mint NFTs.",
      });
      return;
    }

    if (!isMintActive()) {
      setNotification({
        type: "error",
        title: "Minting Not Available",
        message: "Minting is currently not active or contract is not deployed.",
      });
      return;
    }

    if (selectedDesignId < 1 || selectedDesignId > 10) {
      setNotification({
        type: "error",
        title: "Invalid Design",
        message: "Design ID must be between 1 and 10.",
      });
      return;
    }

    const requiredEth = hasVeAlvaDiscount
      ? parseFloat(discountPrice || "0.000275")
      : parseFloat(standardPrice || "0.00055");
    setNotification(null);
    lastMintProcessed.current = false; // Reset the flag for new mint

    try {
      await mint(selectedDesignId, hasVeAlvaDiscount);
    } catch (error: any) {
      console.error("Minting error:", error);

      let errorMessage = "Failed to mint NFT. Please try again.";
      let errorTitle = "Transaction Failed";

      // Handle specific error types
      if (error?.message) {
        if (error.message.includes("User rejected")) {
          errorTitle = "Transaction Cancelled";
          errorMessage = "You cancelled the transaction. Try again when ready.";
        } else if (error.message.includes("insufficient funds")) {
          errorTitle = "Insufficient Funds";
          errorMessage =
            "You don't have enough ETH to complete this transaction.";
        } else if (error.message.includes("execution reverted")) {
          errorTitle = "Contract Error";
          // Try to extract more specific error information
          if (error.message.includes("Mint limit reached")) {
            errorMessage = "Mint limit reached. Please try again later.";
          } else if (error.message.includes("Invalid design")) {
            errorMessage =
              "Invalid design ID. Please select a design between 1 and 10.";
          } else if (error.message.includes("Insufficient ETH sent")) {
            const expectedAmount = hasVeAlvaDiscount ? "0.000275" : "0.00055";
            errorMessage = `Incorrect ETH amount sent. Expected ${expectedAmount} ETH but sent ${
              error.message.includes("0.000275") ? "0.000275" : "0.00055"
            } ETH. This might be due to veALVA token balance not meeting the discount threshold (1.5 tokens).`;
          } else if (error.message.includes("Nonexistent token")) {
            errorMessage = "Token does not exist. Please try again.";
          } else {
            errorMessage =
              "The transaction was rejected by the smart contract. This could be due to: 1) Invalid design ID, 2) Incorrect ETH amount, 3) ALVA token contract issue.";
          }
        } else if (error.message.includes("gas")) {
          errorTitle = "Gas Error";
          errorMessage =
            "Transaction failed due to gas issues. Try increasing gas limit.";
        } else if (error.message.includes("network")) {
          errorTitle = "Network Error";
          errorMessage =
            "Network connection issue. Please check your connection and try again.";
        } else if (error.message.includes("Invalid design ID")) {
          errorTitle = "Invalid Design";
          errorMessage = "Design ID must be between 1 and 10.";
        } else if (error.message.includes("maximum mint limit")) {
          errorTitle = "Mint Limit Reached";
          errorMessage = "Mint limit reached. Please try again later.";
        } else {
          errorMessage = error.message;
        }
      }

      setNotification({
        type: "error",
        title: errorTitle,
        message: errorMessage,
      });
    }
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

  const isMintDisabled =
    !isConnected ||
    isMintLoading ||
    !isContractDeployed() ||
    (!isMintActive() && isContractDeployed());

  const closeNotification = () => {
    setNotification(null);
  };

  // Function to generate X (Twitter) share URL for an NFT
  const generateXShareUrl = (nft: any) => {
    const text = `🎨 Just minted my Alvara NFT! Check out ${nft.name} #${String(
      nft.tokenId
    ).padStart(3, "0")} 🚀\n\nDesign #${
      nft.designId || "Unknown"
    }\n\nMint your own at alvara-nft.vercel.app\n\n#AlvaraNFT #NFT #Web3 #Ethereum`;
    const encodedText = encodeURIComponent(text);
    return `https://twitter.com/intent/tweet?text=${encodedText}`;
  };

  return (
    <div className="w-full max-w-7xl mt-16">
      <div className="w-full">
        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
          {/* Left Side - NFT Display */}
          <div className="space-y-4 md:space-y-6">
            {/* NFT Card with Navigation */}
            <div className="relative flex items-center justify-center gap-4 sm:gap-6 md:gap-8">
              {/* Left Navigation Arrow */}
              <button
                onClick={() => {
                  const newId =
                    selectedDesignId > 1
                      ? selectedDesignId - 1
                      : designs.length || 10;
                  setSelectedDesignId(newId);
                }}
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-[#13061F]/80 hover:bg-[#13061F] rounded-full flex items-center justify-center transition-colors backdrop-blur-sm flex-shrink-0"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
              </button>

              {/* NFT Card */}
              <div className="relative bg-gradient-to-br from-[#13061F]/90 to-[#13061F]/70 rounded-3xl p-4 sm:p-6 md:p-8 border border-[#D8CDE2]/20 backdrop-blur-sm w-full max-w-sm">
                <div className="aspect-square bg-[#13061F]/60 rounded-2xl p-3 sm:p-4 md:p-6 overflow-hidden relative">
                  {isLoadingDesigns ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="animate-spin w-8 h-8 border-2 border-[#D73D80] border-t-transparent rounded-full"></div>
                    </div>
                  ) : currentDesign?.imageUrl ? (
                    <img
                      src={currentDesign.imageUrl}
                      alt={
                        currentDesign.metadata?.name ||
                        `Design ${selectedDesignId}`
                      }
                      className="w-full h-full object-cover rounded-xl"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Image
                        src={logo}
                        alt="Default NFT"
                        className="w-24 h-24 object-contain opacity-50"
                      />
                    </div>
                  )}
                </div>

                {/* NFT Info */}
                <div className="mt-4 space-y-2">
                  <h3 className="text-white text-lg sm:text-xl font-bold">
                    {currentDesign?.metadata?.name ||
                      `Alvara #${selectedDesignId}`}
                  </h3>
                  <p className="text-[#D8CDE2]/80 text-sm">
                    {currentDesign?.metadata?.description || "Loading..."}
                  </p>
                </div>
              </div>

              {/* Right Navigation Arrow */}
              <button
                onClick={() => {
                  const newId =
                    selectedDesignId < (designs.length || 10)
                      ? selectedDesignId + 1
                      : 1;
                  setSelectedDesignId(newId);
                }}
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-[#13061F]/80 hover:bg-[#13061F] rounded-full flex items-center justify-center transition-colors backdrop-blur-sm flex-shrink-0"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
              </button>
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
                    {standardPrice || "0.00055"} ETH
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

              {/* veALVA Holder Discount */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[#D8CDE2] text-lg">
                    veALVA Holder Discount
                  </span>
                  <span className="text-[#FC9FB7] font-semibold text-base md:text-lg">
                    -50%
                  </span>
                </div>

                {/* Status Indicator */}
                {hasVeAlvaDiscount ? (
                  <div className="flex items-center space-x-2 bg-green-500/20 border border-green-500/30 rounded-lg p-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-green-400 text-sm font-medium">
                      ✓ Eligible for 50% discount (
                      {veAlvaBalanceAmount.toFixed(2)} {veAlvaSymbol})
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 bg-orange-500/20 border border-orange-500/30 rounded-lg p-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-orange-400 text-sm font-medium">
                      Need 1.5+ {veAlvaSymbol} for discount
                    </span>
                  </div>
                )}

                {/* Call to Action for Non-Eligible Users */}
                {!hasVeAlvaDiscount && (
                  <div className="bg-[#13061F]/60 border border-[#D73D80]/30 rounded-lg p-3">
                    <p className="text-[#D8CDE2] text-xs text-center mb-2">
                      Get 50% discount on minting:
                    </p>
                    <div className="flex items-center justify-center space-x-1 text-xs">
                      <span className="text-[#FC9FB7]">Buy ALVA</span>
                      <span className="text-[#D8CDE2]">→</span>
                      <span className="text-[#FC9FB7]">Stake</span>
                      <span className="text-[#D8CDE2]">→</span>
                      <span className="text-[#FC9FB7]">Mint for 50% off</span>
                    </div>
                  </div>
                )}
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
            </div>
          </div>
        </div>

        {/* Error Display */}
        {designsError && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mt-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <p className="text-red-400 text-sm">
                Failed to load NFT designs: {designsError}
              </p>
            </div>
          </div>
        )}

        {/* Your Minted Alvaras Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-white mb-6">
            Your Minted Alvaras
            {totalNFTs > 0 && (
              <span className="ml-2 text-[#D73D80]">({totalNFTs} total)</span>
            )}
          </h2>

          {/* Loading State */}
          {isLoadingWalletNFTs && (
            <div className="bg-[#13061F]/50 border border-[#D8CDE2]/20 rounded-xl p-8 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-[#D73D80] border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-[#D8CDE2]">Loading your NFTs from wallet...</p>
            </div>
          )}

          {/* Error State */}
          {walletNFTsError && (
            <div className="bg-[#13061F]/50 border border-red-500/20 rounded-xl p-8 text-center">
              <div className="text-red-400 text-4xl mb-4">⚠️</div>
              <p className="text-red-400 mb-2">
                Failed to load your wallet NFTs
              </p>
              <p className="text-[#D8CDE2]/70 text-sm mb-4">
                {walletNFTsError}
              </p>
              <button
                onClick={refetchWalletNFTs}
                className="px-4 py-2 bg-[#D73D80] text-white rounded-lg hover:bg-[#D73D80]/80 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Display NFTs */}
          {!isLoadingWalletNFTs && !walletNFTsError && totalNFTs > 0 ? (
            <div className="space-y-6">
              {/* Wallet NFTs Section */}
              {totalNFTs > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    🔗 From Your Wallet
                    <span className="ml-2 text-sm text-[#D8CDE2]/70">
                      ({totalNFTs} total)
                    </span>
                  </h3>

                  {/* Display actual NFTs if found */}
                  {ownedNFTs.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {ownedNFTs.map((nft) => (
                        <div
                          key={`wallet-${nft.tokenId}`}
                          className="bg-[#13061F]/80 border border-[#D73D80]/30 rounded-xl p-4 hover:border-[#D73D80]/50 transition-all duration-300 hover:scale-105"
                        >
                          <div className="aspect-square bg-[#13061F]/60 rounded-lg mb-3 overflow-hidden relative group">
                            {nft.imageUrl ? (
                              <img
                                src={nft.imageUrl}
                                alt={nft.name}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <div className="w-8 h-8 bg-gradient-to-br from-[#D73D80]/20 to-[#8B5CF6]/20 rounded"></div>
                              </div>
                            )}
                            <div className="absolute top-2 right-2 bg-[#D73D80] px-2 py-1 rounded-md">
                              <span className="text-white text-xs font-mono">
                                #{String(nft.tokenId).padStart(3, "0")}
                              </span>
                            </div>

                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              <a
                                href={generateXShareUrl(nft)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-black hover:bg-gray-800 text-white p-1 rounded-md font-semibold text-sm transition-all duration-200 hover:scale-110"
                              >
                                share on X
                              </a>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <h4 className="text-white text-sm font-semibold truncate">
                              {nft.name}
                            </h4>
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-[#D8CDE2]/70">
                                {nft.designId
                                  ? `Design #${nft.designId}`
                                  : "Alvara NFT"}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-1 bg-[#D73D80]/20 text-[#D73D80] rounded text-xs">
                                  Owned
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* Show setup message when no NFTs loaded but balance exists */
                    <div className="bg-[#13061F]/50 border border-[#D8CDE2]/20 rounded-xl p-6 text-center">
                      <div className="text-4xl mb-4">🔧</div>
                      <h4 className="text-white text-lg font-semibold mb-2">
                        Setup Required
                      </h4>
                      <p className="text-[#D8CDE2]/70 text-sm mb-4">
                        Add your Alchemy API key to display your {totalNFTs} NFT
                        {totalNFTs !== 1 ? "s" : ""} here.
                      </p>
                      <div className="space-y-3 text-xs text-[#D8CDE2]/60">
                        <div className="bg-[#13061F]/60 rounded-lg p-3 text-left">
                          <p className="font-semibold text-[#D8CDE2] mb-2">
                            Quick Setup:
                          </p>
                          <ol className="space-y-1 text-[#D8CDE2]/70">
                            <li>
                              1. Sign up at{" "}
                              <a
                                href="https://alchemy.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#D73D80] hover:underline"
                              >
                                alchemy.com
                              </a>
                            </li>
                            <li>2. Create a Sepolia testnet app</li>
                            <li>
                              3. Add{" "}
                              <code className="bg-[#D8CDE2]/10 px-1 rounded">
                                NEXT_PUBLIC_ALCHEMY_API_KEY
                              </code>{" "}
                              to .env
                            </li>
                            <li>4. Restart the server</li>
                          </ol>
                        </div>
                        <p className="pt-2">Or view your NFTs on:</p>
                        <div className="flex flex-wrap justify-center gap-2">
                          <a
                            href={`https://testnets.opensea.io/account`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 bg-[#D73D80]/20 text-[#D73D80] rounded-md hover:bg-[#D73D80]/30 transition-colors"
                          >
                            OpenSea
                          </a>
                          <span className="px-3 py-1 bg-[#D8CDE2]/10 text-[#D8CDE2]/70 rounded-md">
                            MetaMask
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : !isLoadingWalletNFTs && !walletNFTsError ? (
            <div className="bg-[#13061F]/50 border border-[#D8CDE2]/20 rounded-xl p-8 text-center">
              <div className="text-6xl mb-4">🎨</div>
              {totalNFTs > 0 ? (
                <>
                  <p className="text-[#D8CDE2] mb-2">
                    You own {totalNFTs} Alvara NFT{totalNFTs !== 1 ? "s" : ""}!
                  </p>
                  <p className="text-[#D8CDE2]/70 text-sm mb-4">
                    Loading your NFTs from the blockchain...
                  </p>
                  <button
                    onClick={refetchWalletNFTs}
                    className="px-4 py-2 bg-[#D73D80] text-white rounded-lg hover:bg-[#D73D80]/80 transition-colors"
                  >
                    Refresh NFTs
                  </button>
                </>
              ) : (
                <>
                  <p className="text-[#D8CDE2] mb-2">No minted NFTs yet</p>
                  <p className="text-[#D8CDE2]/70 text-sm">
                    Start minting to see your collection here!
                  </p>
                </>
              )}
            </div>
          ) : null}
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <Notification
          type={notification.type}
          title={notification.title}
          message={notification.message}
          link={notification.link}
          onClose={closeNotification}
        />
      )}
    </div>
  );
}
