"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAccount } from "wagmi";
import { useAlvaraMint } from "@/hooks/useAlvaraMint";
// veALVA balance check removed - contract handles discount automatically
import { useWalletNFTs } from "@/hooks/useWalletNFTs";
// Staking functionality removed - contract now only mints NFTs
import { useNotification } from "@/contexts/NotificationContext";
import Image, { StaticImageData } from "next/image";
import { alvaraNFTs, AlvaraNFT } from "./avatarMinterData";

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
    walletMints,
    maxMintsPerWallet,
    mintError,
  } = useAlvaraMint();

  // Staking functionality removed - contract now only mints NFTs

  // Remove the old veALVA check - we'll use the contract's built-in check
  const hasVeAlvaDiscount = false; // Let the contract determine discount eligibility

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
  const actualPrice = hasVeAlvaDiscount ? discountPrice : standardPrice;

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

        // Note: lastMintedAmount will be updated by the SwapExecuted event listener
        // in the useStakingProtocol hook, so we don't need to set a fixed amount here

        showNotification({
          type: "success",
          title: "Transaction Confirmed!",
          message: "Successfully minted your Alvara NFT",
          link: {
            url: `https://sepolia.etherscan.io/tx/${transactionHash}`,
            text: "View Transaction on Etherscan",
          },
        });

        // Refetch wallet NFTs to update the "Your Minted Alvaras" section
        setTimeout(() => {
          refetchWalletNFTs();
        }, 2000); // Small delay to allow blockchain indexing
      }
    }
  }, [
    isMintSuccess,
    transactionHash,
    mintedNFTs,
    showNotification,
    refetchWalletNFTs,
    currentNFT,
  ]);

  // Staking functionality removed

  // Listen for mint errors from the hook
  useEffect(() => {
    if (mintError) {
      console.error("Mint error from hook:", mintError);

      let errorTitle = "Transaction Failed";
      let errorMessage = "Failed to mint NFT. Please try again.";

      // Type assertion to handle contract errors
      const contractError = mintError as any;

      if (mintError.message) {
        if (
          mintError.message.includes("insufficient funds") ||
          mintError.message.includes("exceeds the balance") ||
          mintError.message.includes("total cost") ||
          mintError.message.includes("balance of the account") ||
          mintError.message.includes("insufficient funds for gas")
        ) {
          errorTitle = "Insufficient Wallet Balance";
          errorMessage =
            "You don't have enough ETH in your wallet to complete this transaction. You need ETH for the NFT price plus additional ETH for gas fees. Please add more ETH to your wallet and try again.";
        } else if (
          mintError.message.includes("User rejected") ||
          mintError.message.includes("user rejected")
        ) {
          errorTitle = "Transaction Cancelled";
          errorMessage =
            "You cancelled the transaction. Please try again when ready.";
        } else if (mintError.message.includes("execution reverted")) {
          errorTitle = "Smart Contract Error";
          if (contractError.reason) {
            if (contractError.reason.includes("Max mint per user")) {
              errorTitle = "Mint Limit Reached";
              errorMessage =
                "You have reached the maximum number of NFTs you can mint per wallet.";
            } else {
              errorMessage = `Contract error: ${contractError.reason}`;
            }
          } else {
            errorMessage =
              "The smart contract rejected the transaction. Please check your veALVA token balance if trying to use discount pricing.";
          }
        } else if (
          mintError.message.includes("timeout") ||
          mintError.message.includes("took too long")
        ) {
          errorTitle = "Network Timeout";
          errorMessage =
            "The network is slow. Please try again or switch to a faster network connection.";
        } else if (
          mintError.message.includes("Network Error") ||
          mintError.message.includes("fetch")
        ) {
          errorTitle = "Network Error";
          errorMessage =
            "Unable to connect to the blockchain. Please check your internet connection and try again.";
        } else if (
          mintError.message.includes("gas") ||
          mintError.message.includes("Gas")
        ) {
          errorTitle = "Gas Fee Issue";
          errorMessage =
            "There was an issue with gas fees. Please try again or adjust your gas settings in your wallet.";
        } else {
          // Show the actual error message to help users understand what went wrong
          errorMessage = `Transaction failed: ${mintError.message}`;
        }
      } else if (contractError.reason) {
        // Handle errors that have a reason but no message
        errorTitle = "Smart Contract Error";
        errorMessage = `Contract error: ${contractError.reason}`;
      }

      showNotification({
        type: "error",
        title: errorTitle,
        message: errorMessage,
      });
    }
  }, [mintError, showNotification]);

  // Staking error handling removed

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

      // Extract design ID from NFT number (e.g., "1" from NFT number 1)
      const designId = currentNFT.number.toString();

      // Use real smart contract minting with the design ID
      // Contract will automatically apply discount if user has veALVA
      await mint(designId);
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
          error.message.includes("insufficient funds") ||
          error.message.includes("exceeds the balance") ||
          error.message.includes("total cost") ||
          error.message.includes("balance of the account")
        ) {
          errorTitle = "Insufficient Wallet Balance";
          errorMessage = `You don't have enough ETH in your wallet to complete this transaction. You need at least ${actualPrice} ETH for the NFT price plus additional ETH for gas fees. Please add more ETH to your wallet and try again.`;
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
            // Handle specific contract errors
            if (error.reason.includes("Max mint per user")) {
              errorTitle = "Mint Limit Reached";
              errorMessage = `You have reached the maximum number of NFTs you can mint (${maxMintsPerWallet} per wallet).`;
            } else {
              errorMessage = `Contract error: ${error.reason}`;
            }
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
        } else if (
          error.message.includes("gas") ||
          error.message.includes("Gas")
        ) {
          errorTitle = "Gas Fee Issue";
          errorMessage =
            "There was an issue with gas fees. Please try again or adjust your gas settings in your wallet.";
        } else {
          // Fallback for any other error - show the actual error message to help users understand what went wrong
          errorMessage = `Transaction failed: ${error.message}`;
        }
      } else if (error?.reason) {
        // Handle errors that have a reason but no message
        errorTitle = "Smart Contract Error";
        errorMessage = `Contract error: ${error.reason}`;
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

  // Staking functionality removed

  const isMintDisabled =
    !isConnected ||
    isMinting ||
    !isContractDeployed() ||
    !isMintActive() ||
    (walletMints || 0) >= maxMintsPerWallet;

  // Staking functionality removed



  return (
    <div className="w-full ">
      <div className="w-full flex flex-col space-y-4">
        {/* Avatar Display */}
        <div className="flex items-center justify-center">
          <div
            style={{
              width: "clamp(200px, 60vw, 250px)",
              height: "clamp(200px, 60vw, 250px)",
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
            <div className="relative w-full h-full">
              <Image
                src={currentNFT.image}
                alt={currentNFT.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-contain w-auto h-auto"
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
              Minted: {walletMints || 0} / {maxMintsPerWallet}
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
              fontSize: "clamp(16px, 4vw, 18px)",
              lineHeight: "27px",
            }}
          >
            {currentNFT.name}
          </h3>
        </div>

        {/* Price and Discount Info */}
        <div className="text-center space-y-1">
          <div className="flex items-center justify-center gap-2">
            <span
              className="text-white text-xl font-bold"
              style={{
                fontFamily: "Titillium Web",
                fontWeight: 700,
                fontSize: "clamp(18px, 4.5vw, 20px)",
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
        <div className="flex flex-col items-center space-y-3">
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
            {isMinting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Minting...
              </div>
            ) : !isConnected ? (
              "Connect Wallet to Mint"
            ) : !isContractDeployed() ? (
              "Contract Not Available"
            ) : !isMintActive() ? (
              "Minting Inactive"
            ) : (walletMints || 0) >= maxMintsPerWallet ? (
              "Mint Limit Reached"
            ) : (
              "Mint NFT"
            )}
          </button>

          {/* Explanation messages for different disabled states */}
          {!isConnected && (
            <div className="text-center max-w-md">
              <p className="text-[#D8CDE2] text-sm leading-relaxed">
                Connect your wallet to start minting Alvara NFTs
              </p>
            </div>
          )}

          {isConnected && !isContractDeployed() && (
            <div className="text-center max-w-md">
              <p className="text-[#D8CDE2] text-sm leading-relaxed">
                The minting contract is not available on this network. Please
                switch to Ethereum Mainnet.
              </p>
            </div>
          )}

          {isConnected && isContractDeployed() && !isMintActive() && (
            <div className="text-center max-w-md">
              <p className="text-[#D8CDE2] text-sm leading-relaxed">
                Minting is currently paused. Please check back later.
              </p>
            </div>
          )}

          {(walletMints || 0) >= maxMintsPerWallet && (
            <div className="text-center max-w-md">
              <p className="text-[#D8CDE2] text-sm leading-relaxed">
                You've reached the maximum of{" "}
                <span className="font-semibold text-[#D73D80]">
                  {maxMintsPerWallet} NFTs
                </span>{" "}
                per wallet.
              </p>
            </div>
          )}

          {isMinting && (
            <div className="text-center max-w-md">
              <p className="text-[#D8CDE2] text-sm leading-relaxed">
                Processing your mint transaction... This may take a few moments.
              </p>
              <p className="text-[#B199B5] text-xs mt-2">
                ⏳ Please don't close this page or disconnect your wallet
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
