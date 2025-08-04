"use client";

import { useState, useEffect } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useChainId,
} from "wagmi";
import { formatEther, parseEther } from "viem";
import { ALVARA_MINT_ABI } from "@/contracts/AlvaraMint";
import {
  CONTRACT_ADDRESSES,
  ALVA_TOKEN_ADDRESSES,
} from "@/contracts/addresses";

export function useAlvaraMint() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  // Get contract address based on current network
  const getContractAddress = () => {
    if (chainId === 11155111) return CONTRACT_ADDRESSES.sepolia;
    if (chainId === 5) return CONTRACT_ADDRESSES.goerli;
    if (chainId === 1) return CONTRACT_ADDRESSES.mainnet;
    return CONTRACT_ADDRESSES.sepolia; // Default to Sepolia
  };

  const contractAddress = getContractAddress();

  // Contract reads
  const { data: standardPrice } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: ALVARA_MINT_ABI,
    functionName: "STANDARD_PRICE",
  });

  const { data: discountPrice } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: ALVARA_MINT_ABI,
    functionName: "DISCOUNT_PRICE",
  });

  // Removed MAX_MINTS_PER_WALLET since there's no limit now
  const maxMintsPerWallet = null; // No limit

  const { data: walletMints } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: ALVARA_MINT_ABI,
    functionName: "walletMints",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const { data: userNftBalance } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: ALVARA_MINT_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  // Contract write
  const {
    data: mintData,
    writeContract: mintWrite,
    isPending: isMintLoading,
  } = useWriteContract();

  const { isLoading: isMintWaiting, isSuccess: isMintSuccess } =
    useWaitForTransactionReceipt({
      hash: mintData,
    });

  // Helper functions
  const getMintPrice = (hasDiscount: boolean = false) => {
    if (hasDiscount && discountPrice && typeof discountPrice === "bigint") {
      return formatEther(discountPrice);
    }
    if (standardPrice && typeof standardPrice === "bigint") {
      return formatEther(standardPrice);
    }
    return "0.00055"; // Fallback to known price
  };

  const getRemainingMints = () => {
    // No minting limit - return a high number for UI compatibility
    return 999999;
  };

  const isMintActive = () => {
    // Mint is always active now (no time restrictions)
    return isContractDeployed();
  };

  const isContractDeployed = () => {
    return contractAddress !== "0x0000000000000000000000000000000000000000";
  };

  const mint = (designId: number, hasDiscount: boolean = false) => {
    if (!mintWrite) return;

    const price =
      hasDiscount && discountPrice && typeof discountPrice === "bigint"
        ? discountPrice
        : standardPrice && typeof standardPrice === "bigint"
        ? standardPrice
        : BigInt("550000000000000"); // Fallback to 0.00055 ETH in wei

    // Validate design ID before minting
    if (designId < 1 || designId > 10) {
      throw new Error("Invalid design ID. Must be between 1 and 10.");
    }

    mintWrite({
      address: contractAddress as `0x${string}`,
      abi: ALVARA_MINT_ABI,
      functionName: "mint",
      args: [BigInt(designId)],
      value: price,
    });
  };

  return {
    // Contract data
    standardPrice:
      standardPrice && typeof standardPrice === "bigint"
        ? formatEther(standardPrice)
        : "0.00055",
    discountPrice:
      discountPrice && typeof discountPrice === "bigint"
        ? formatEther(discountPrice)
        : "0.000275",
    maxMintsPerWallet: maxMintsPerWallet ? Number(maxMintsPerWallet) : 3,
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
    transactionHash: mintData,

    // Connection state
    isConnected,
    contractAddress,
  };
}
