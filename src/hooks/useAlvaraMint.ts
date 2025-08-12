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

  const { data: hasVeAlvaDiscount } = useContractRead({
    address: contractAddress as `0x${string}`,
    abi: ALVARA_MINT_ABI,
    functionName: "hasVeALVA",
    args: address ? [address] : undefined,
    enabled: !!address,
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
      return "0.00015"; // Fallback to new discount price (~$0.50)
    }
    if (standardPrice && typeof standardPrice === "bigint") {
      return formatEther(standardPrice);
    }
    return "0.0003"; // Fallback to new standard price (~$1.00)
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

  const mint = (designId: string) => {
    if (!mintWrite) {
      console.error("Mint function not available");
      return;
    }

    // Determine correct price based on user's veALVA status
    let price: bigint;
    const userHasDiscount = hasVeAlvaDiscount === true;

    if (userHasDiscount) {
      // Use discount price
      if (discountPrice && typeof discountPrice === "bigint") {
        price = discountPrice;
        console.log(
          "Using contract discount price:",
          formatEther(discountPrice),
          "ETH"
        );
      } else {
        // Fallback to discount price (0.00015 ETH in wei)
        price = BigInt("150000000000000"); // 0.00015 ETH in wei
        console.log(
          "Using fallback discount price:",
          formatEther(price),
          "ETH"
        );
      }
    } else {
      // Use standard price
      if (standardPrice && typeof standardPrice === "bigint") {
        price = standardPrice;
        console.log(
          "Using contract standard price:",
          formatEther(standardPrice),
          "ETH"
        );
      } else {
        // Fallback to standard price (0.0003 ETH in wei)
        price = BigInt("300000000000000"); // 0.0003 ETH in wei
        console.log(
          "Using fallback standard price:",
          formatEther(price),
          "ETH"
        );
      }
    }

    console.log("Minting with params:", {
      designId,
      userHasDiscount,
      priceInEth: formatEther(price),
      priceInWei: price.toString(),
      contractAddress,
      network: chain?.name || "mainnet",
    });

    try {
      mintWrite({
        args: [designId],
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
        : "0.0003",
    discountPrice:
      discountPrice && typeof discountPrice === "bigint"
        ? formatEther(discountPrice)
        : "0.00015",
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
