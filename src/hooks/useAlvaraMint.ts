"use client";

import { useState, useEffect } from "react";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useWaitForTransaction,
  useNetwork,
} from "wagmi";
import { formatEther, parseEther } from "viem";
import { ALVARA_MINT_ABI } from "@/contracts/AlvaraMint";
import {
  CONTRACT_ADDRESSES,
  ALVA_TOKEN_ADDRESSES,
} from "@/contracts/addresses";

export function useAlvaraMint() {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();

  // Get contract address based on current network
  const getContractAddress = () => {
    if (chain?.id === 11155111) return CONTRACT_ADDRESSES.sepolia;
    if (chain?.id === 5) return CONTRACT_ADDRESSES.goerli;
    if (chain?.id === 1) return CONTRACT_ADDRESSES.mainnet;
    return CONTRACT_ADDRESSES.mainnet; // Default to mainnet (updated contract)
  };

  const contractAddress = getContractAddress();

  // Contract reads
  const { data: standardPrice } = useContractRead({
    address: contractAddress as `0x${string}`,
    abi: ALVARA_MINT_ABI,
    functionName: "standardPrice",
  });

  const { data: discountPrice } = useContractRead({
    address: contractAddress as `0x${string}`,
    abi: ALVARA_MINT_ABI,
    functionName: "getDiscountPrice",
  });

  const { data: walletMints } = useContractRead({
    address: contractAddress as `0x${string}`,
    abi: ALVARA_MINT_ABI,
    functionName: "walletMints",
    args: address ? [address] : undefined,
    enabled: !!address,
  });

  const { data: userNftBalance } = useContractRead({
    address: contractAddress as `0x${string}`,
    abi: ALVARA_MINT_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    enabled: !!address,
  });

  const { data: maxMintPerUser } = useContractRead({
    address: contractAddress as `0x${string}`,
    abi: ALVARA_MINT_ABI,
    functionName: "maxMintPerUser",
  });

  // Contract write
  const {
    data: mintData,
    write: mintWrite,
    isLoading: isMintLoading,
    error: mintError,
  } = useContractWrite({
    address: contractAddress as `0x${string}`,
    abi: ALVARA_MINT_ABI,
    functionName: "mint",
  });

  const { isLoading: isMintWaiting, isSuccess: isMintSuccess } =
    useWaitForTransaction({
      hash: mintData?.hash,
    });

  // Helper functions
  const getMintPrice = (hasDiscount: boolean = false) => {
    if (hasDiscount) {
      if (discountPrice && typeof discountPrice === "bigint") {
        return formatEther(discountPrice);
      }
      return "0.0005"; // Fallback to new discount price
    }
    if (standardPrice && typeof standardPrice === "bigint") {
      return formatEther(standardPrice);
    }
    return "0.001"; // Fallback to new standard price
  };

  const getRemainingMints = () => {
    if (maxMintPerUser && walletMints) {
      return Number(maxMintPerUser) - Number(walletMints);
    }
    return 999; // Fallback
  };

  const isMintActive = () => {
    // Mint is always active now (no time restrictions)
    return isContractDeployed();
  };

  const isContractDeployed = () => {
    return contractAddress !== "0x0000000000000000000000000000000000000000";
  };

  const mint = (designId: string, hasDiscount: boolean = false) => {
    if (!mintWrite) {
      console.error("Mint function not available");
      return;
    }

    // Calculate the correct price based on discount status
    let price: bigint;

    if (hasDiscount) {
      // Use discount price from contract
      if (discountPrice && typeof discountPrice === "bigint") {
        price = discountPrice;
        console.log(
          "Using contract discount price:",
          formatEther(discountPrice),
          "ETH"
        );
      } else {
        // Fallback to new discount price (0.0005 ETH in wei)
        price = BigInt("500000000000000"); // 0.0005 ETH in wei
        console.log("Using fallback discount price:", "0.0005", "ETH");
      }
    } else {
      // Use standard price from contract
      if (standardPrice && typeof standardPrice === "bigint") {
        price = standardPrice;
        console.log(
          "Using contract standard price:",
          formatEther(standardPrice),
          "ETH"
        );
      } else {
        // Fallback to new standard price (0.001 ETH in wei)
        price = BigInt("1000000000000000"); // 0.001 ETH in wei
        console.log(
          "Using fallback standard price:",
          formatEther(price),
          "ETH"
        );
      }
    }

    // Calculate swap parameters
    const swapDeadline = BigInt(Math.floor(Date.now() / 1000) + 600); // 10 minutes from now
    const swapMinOutput = BigInt(1); // Minimum 1 wei output
    const swapPoolFeeTier = 3000; // 0.3% pool fee tier (uint24 = number)

    console.log("Minting with params:", {
      designId,
      requestedDiscount: hasDiscount,
      priceInEth: formatEther(price),
      priceInWei: price.toString(),
      contractAddress,
      network: chain?.name || "mainnet",
      swapDeadline: Number(swapDeadline),
      swapMinOutput: swapMinOutput.toString(),
      swapPoolFeeTier: swapPoolFeeTier,
    });

    try {
      mintWrite({
        args: [designId, swapDeadline, swapMinOutput, swapPoolFeeTier],
        value: price,
      });
    } catch (error: any) {
      console.error("Mint write error:", error);
      throw error; // Re-throw so the component can handle it
    }
  };

  return {
    // Contract data
    standardPrice:
      standardPrice && typeof standardPrice === "bigint"
        ? formatEther(standardPrice)
        : "0.001",
    discountPrice:
      discountPrice && typeof discountPrice === "bigint"
        ? formatEther(discountPrice)
        : "0.0005",
    maxMintsPerWallet: maxMintPerUser ? Number(maxMintPerUser) : 3, // Default to 3
    walletMints: walletMints ? Number(walletMints) : 0,
    userNftBalance: userNftBalance ? Number(userNftBalance) : 0,

    // Helper functions
    getMintPrice,
    getRemainingMints,
    isMintActive,
    isContractDeployed,

    // Mint function
    mint,

    // Transaction states
    isMintLoading: isMintLoading || isMintWaiting,
    isMintSuccess,
    transactionHash: mintData?.hash,
    mintError,

    // Connection state
    isConnected,
    contractAddress,
  };
}
