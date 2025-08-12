"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAccount } from "wagmi";
import { useAlvaraMint } from "@/hooks/useAlvaraMint";
import { useVeAlvaBalance } from "@/hooks/useAlvaBalance";
import { useWalletNFTs } from "@/hooks/useWalletNFTs";
import { useStakingProtocol, SIX_MONTHS } from "@/hooks/useStakingProtocol";
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

  // Staking protocol integration
  const {
    smartStake,
    approve,
    isStakeLoading,
    isStakeSuccess,
    stakeTransactionHash,
    isIncreaseAmountLoading,
    isIncreaseAmountSuccess,
    increaseAmountTransactionHash,
    isApproveLoading,
    isApproveSuccess,
    approveTransactionHash,
    needsApproval,
    refetchAllowance,
    lastSwapAmount, // Get the dynamic ALVA amount from SwapExecuted event
    showStakeButton, // Show stake button after approval event
    approvedAmount, // Amount that was approved
    hideStakeButton, // Function to hide stake button
    isContractDeployed: isStakingContractDeployed,
    approveError,
    stakeError,
    increaseAmountError,
  } = useStakingProtocol();

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

  // Listen for successful stakes
  useEffect(() => {
    if (isStakeSuccess && stakeTransactionHash) {
      showNotification({
        type: "success",
        title: "Staking Successful!",
        message: "Successfully staked your ALVA tokens",
        link: {
          url: `https://etherscan.io/tx/${stakeTransactionHash}`,
          text: "View Transaction on Etherscan",
        },
      });

      // Reset state after successful staking so button goes back to mint mode
      hideStakeButton();
    }
  }, [isStakeSuccess, stakeTransactionHash, showNotification, hideStakeButton]);

  // Listen for successful increaseAmount transactions
  useEffect(() => {
    if (isIncreaseAmountSuccess && increaseAmountTransactionHash) {
      showNotification({
        type: "success",
        title: "Stake Increased Successfully!",
        message: "Successfully increased your ALVA stake amount",
        link: {
          url: `https://etherscan.io/tx/${increaseAmountTransactionHash}`,
          text: "View Transaction on Etherscan",
        },
      });

      // Reset state after successful increaseAmount so button goes back to mint mode
      hideStakeButton();
    }
  }, [
    isIncreaseAmountSuccess,
    increaseAmountTransactionHash,
    showNotification,
    hideStakeButton,
  ]);

  // Listen for successful approvals
  useEffect(() => {
    if (isApproveSuccess && approveTransactionHash) {
      // Refetch allowance to get updated values
      refetchAllowance();

      showNotification({
        type: "success",
        title: "Approval Successful!",
        message:
          "Successfully approved ALVA tokens for staking. You can now stake your tokens!",
        link: {
          url: `https://etherscan.io/tx/${approveTransactionHash}`,
          text: "View Transaction on Etherscan",
        },
      });
    }
  }, [isApproveSuccess, approveTransactionHash, refetchAllowance]);

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

  // Listen for staking errors from the hook
  useEffect(() => {
    if (approveError) {
      console.error("Approval error from hook:", approveError);

      let errorTitle = "Approval Failed";
      let errorMessage = "Failed to approve ALVA tokens. Please try again.";

      // Type assertion to handle contract errors
      const contractError = approveError as any;

      if (approveError.message) {
        if (
          approveError.message.includes("insufficient funds") ||
          approveError.message.includes("exceeds the balance") ||
          approveError.message.includes("total cost") ||
          approveError.message.includes("balance of the account") ||
          approveError.message.includes("insufficient funds for gas")
        ) {
          errorTitle = "Insufficient ETH for Gas";
          errorMessage =
            "You don't have enough ETH to pay for gas fees. Please add more ETH to your wallet and try again.";
        } else if (
          approveError.message.includes("User rejected") ||
          approveError.message.includes("user rejected")
        ) {
          errorTitle = "Transaction Cancelled";
          errorMessage =
            "You cancelled the approval transaction. Please try again when ready.";
        } else if (approveError.message.includes("execution reverted")) {
          errorTitle = "Smart Contract Error";
          if (contractError.reason) {
            errorMessage = `Contract error: ${contractError.reason}`;
          } else {
            errorMessage =
              "The approval was rejected by the smart contract. Please try again.";
          }
        } else {
          errorMessage = `Approval failed: ${approveError.message}`;
        }
      } else if (contractError.reason) {
        errorTitle = "Smart Contract Error";
        errorMessage = `Contract error: ${contractError.reason}`;
      }

      showNotification({
        type: "error",
        title: errorTitle,
        message: errorMessage,
      });
    }
  }, [approveError, showNotification]);

  // Listen for staking errors from the hook
  useEffect(() => {
    if (stakeError) {
      console.error("Staking error from hook:", stakeError);

      let errorTitle = "Staking Failed";
      let errorMessage = "Failed to stake ALVA tokens. Please try again.";

      // Type assertion to handle contract errors
      const contractError = stakeError as any;

      if (stakeError.message) {
        if (
          stakeError.message.includes("insufficient funds") ||
          stakeError.message.includes("exceeds the balance") ||
          stakeError.message.includes("total cost") ||
          stakeError.message.includes("balance of the account") ||
          stakeError.message.includes("insufficient funds for gas")
        ) {
          errorTitle = "Insufficient ETH for Gas";
          errorMessage =
            "You don't have enough ETH to pay for gas fees. Please add more ETH to your wallet and try again.";
        } else if (
          stakeError.message.includes("User rejected") ||
          stakeError.message.includes("user rejected")
        ) {
          errorTitle = "Transaction Cancelled";
          errorMessage =
            "You cancelled the staking transaction. Please try again when ready.";
        } else if (stakeError.message.includes("execution reverted")) {
          errorTitle = "Smart Contract Error";
          if (contractError.reason) {
            errorMessage = `Contract error: ${contractError.reason}`;
          } else {
            errorMessage =
              "The staking was rejected by the smart contract. Please try again.";
          }
        } else {
          errorMessage = `Staking failed: ${stakeError.message}`;
        }
      } else if (contractError.reason) {
        errorTitle = "Smart Contract Error";
        errorMessage = `Contract error: ${contractError.reason}`;
      }

      showNotification({
        type: "error",
        title: errorTitle,
        message: errorMessage,
      });
    }
  }, [stakeError, showNotification]);

  // Listen for increase amount errors from the hook
  useEffect(() => {
    if (increaseAmountError) {
      console.error("Increase amount error from hook:", increaseAmountError);

      let errorTitle = "Stake Increase Failed";
      let errorMessage =
        "Failed to increase your stake amount. Please try again.";

      // Type assertion to handle contract errors
      const contractError = increaseAmountError as any;

      if (increaseAmountError.message) {
        if (
          increaseAmountError.message.includes("insufficient funds") ||
          increaseAmountError.message.includes("exceeds the balance") ||
          increaseAmountError.message.includes("total cost") ||
          increaseAmountError.message.includes("balance of the account") ||
          increaseAmountError.message.includes("insufficient funds for gas")
        ) {
          errorTitle = "Insufficient ETH for Gas";
          errorMessage =
            "You don't have enough ETH to pay for gas fees. Please add more ETH to your wallet and try again.";
        } else if (
          increaseAmountError.message.includes("User rejected") ||
          increaseAmountError.message.includes("user rejected")
        ) {
          errorTitle = "Transaction Cancelled";
          errorMessage =
            "You cancelled the stake increase transaction. Please try again when ready.";
        } else if (increaseAmountError.message.includes("execution reverted")) {
          errorTitle = "Smart Contract Error";
          if (contractError.reason) {
            errorMessage = `Contract error: ${contractError.reason}`;
          } else {
            errorMessage =
              "The stake increase was rejected by the smart contract. Please try again.";
          }
        } else {
          errorMessage = `Stake increase failed: ${increaseAmountError.message}`;
        }
      } else if (contractError.reason) {
        errorTitle = "Smart Contract Error";
        errorMessage = `Contract error: ${contractError.reason}`;
      }

      showNotification({
        type: "error",
        title: errorTitle,
        message: errorMessage,
      });
    }
  }, [increaseAmountError, showNotification]);

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
      await mint(designId, hasVeAlvaDiscount);
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

  const handleStake = async () => {
    if (!isConnected) {
      showNotification({
        type: "error",
        title: "Wallet Not Connected",
        message: "Please connect your wallet to stake tokens.",
      });
      return;
    }

    if (!isStakingContractDeployed()) {
      showNotification({
        type: "error",
        title: "Staking Not Available",
        message: "Staking contract is not available on this network.",
      });
      return;
    }

    if (!lastSwapAmount || lastSwapAmount === "0") {
      showNotification({
        type: "error",
        title: "No Tokens to Stake",
        message: "Please mint an NFT first to receive ALVA tokens for staking.",
      });
      return;
    }

    try {
      // Check if approval is needed
      if (needsApproval(lastSwapAmount)) {
        console.log("Approval needed for amount:", lastSwapAmount, "ALVA");
        await approve(lastSwapAmount);
        return; // Exit here, staking will be handled after approval success
      }

      // If approval is not needed, proceed with staking
      console.log("Starting stake with amount:", lastSwapAmount, "ALVA");
      await smartStake(lastSwapAmount);
    } catch (error: any) {
      console.error("Staking/Approval error:", error);

      let errorMessage = "Failed to process transaction. Please try again.";
      let errorTitle = "Transaction Failed";

      if (error?.message) {
        if (
          error.message.includes("User rejected") ||
          error.message.includes("user rejected")
        ) {
          errorTitle = "Transaction Cancelled";
          errorMessage =
            "You cancelled the transaction. Please try again when ready.";
        } else if (
          error.message.includes("insufficient") ||
          error.message.includes("exceeds the balance") ||
          error.message.includes("total cost") ||
          error.message.includes("balance of the account")
        ) {
          errorTitle = "Insufficient Balance";
          errorMessage =
            "You don't have enough ALVA tokens or ETH for gas fees to complete this transaction. Please check your balances and try again.";
        } else if (error.message.includes("execution reverted")) {
          errorTitle = "Smart Contract Error";
          if (error.reason) {
            errorMessage = `Contract error: ${error.reason}`;
          } else {
            errorMessage =
              "The staking contract rejected the transaction. Please try again.";
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
          // Show the actual error message to help users understand what went wrong
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
    (walletMints || 0) >= maxMintsPerWallet;

  const isStakeDisabled =
    !isConnected ||
    isStakeLoading ||
    isIncreaseAmountLoading ||
    isApproveLoading ||
    !isStakingContractDeployed() ||
    !lastSwapAmount ||
    lastSwapAmount === "0" ||
    isMinting; // Disable stake while minting

  const shareOnX = (nft: AlvaraNFT, transactionHash?: string) => {
    const url = transactionHash
      ? `https://sepolia.etherscan.io/tx/${transactionHash}`
      : "https://alvara-nft.com";
    
    // Create a more engaging tweet with the NFT image
    const text = `I'm now a certified Investment Wanker in @Alvaraprotocol, a real-yield-generating NFT. 

    The minting window is closing. Are you another TradFi bro missing the memo?

    ${nft.image}`;

    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text
    )}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, "_blank");
  };

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

        {/* Dynamic Action Button */}
        <div className="flex flex-col items-center space-y-3">
          <button
            onClick={
              !lastSwapAmount || lastSwapAmount === "0"
                ? handleMint
                : handleStake
            }
            disabled={
              !lastSwapAmount || lastSwapAmount === "0"
                ? isMintDisabled
                : isStakeDisabled
            }
            className={`${
              (
                !lastSwapAmount || lastSwapAmount === "0"
                  ? isMintDisabled
                  : isStakeDisabled
              )
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : !lastSwapAmount || lastSwapAmount === "0"
                ? "bg-[#D73D80] hover:bg-[#B8316C] text-white"
                : needsApproval(lastSwapAmount)
                ? "bg-[#FF6B35] hover:bg-[#E55A2B] text-white"
                : "bg-[#4CAF50] hover:bg-[#45a049] text-white"
            } px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform ${
              (
                !lastSwapAmount || lastSwapAmount === "0"
                  ? !isMintDisabled
                  : !isStakeDisabled
              )
                ? "hover:scale-105 active:scale-95"
                : ""
            }`}
            style={{
              fontFamily: "Titillium Web",
              fontWeight: 600,
              fontSize: "16px",
              lineHeight: "24px",
            }}
          >
            {!lastSwapAmount || lastSwapAmount === "0" ? (
              // Mint button states
              isMinting ? (
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
              )
            ) : // Stake button states
            isApproveLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Approving...
              </div>
            ) : needsApproval(lastSwapAmount) ? (
              "Approve"
            ) : isMinting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Minting...
              </div>
            ) : isStakeLoading || isIncreaseAmountLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Staking...
              </div>
            ) : (
              "Stake"
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
