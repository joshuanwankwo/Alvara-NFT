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
    return CONTRACT_ADDRESSES.sepolia; // Default to Sepolia
  };

  const contractAddress = getContractAddress();

  // Contract reads
  const { data: standardPrice } = useContractRead({
    address: contractAddress as `0x${string}`,
    abi: ALVARA_MINT_ABI,
    functionName: "STANDARD_PRICE",
  });

  const { data: discountPrice } = useContractRead({
    address: contractAddress as `0x${string}`,
    abi: ALVARA_MINT_ABI,
    functionName: "DISCOUNT_PRICE",
  });

  // Get max mints per wallet from contract
  const { data: maxMintsPerWallet } = useContractRead({
    address: contractAddress as `0x${string}`,
    abi: ALVARA_MINT_ABI,
    functionName: "MAX_MINTS_PER_WALLET",
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

  // Contract write
  const {
    data: mintData,
    write: mintWrite,
    isLoading: isMintLoading,
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
      return "0.005"; // Force correct discount price until contract is redeployed
    }
    if (standardPrice && typeof standardPrice === "bigint") {
      return formatEther(standardPrice);
    }
    return "0.01"; // Fallback to new price
  };

  const getRemainingMints = () => {
    if (!maxMintsPerWallet || !walletMints) return 3; // Default fallback
    return Number(maxMintsPerWallet) - Number(walletMints);
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

    // Calculate the correct price based on discount status
    let price: bigint;

    if (hasDiscount) {
      // Use discount price (0.005 ETH) - 50% off
      price = BigInt("5000000000000000"); // 0.005 ETH in wei
      console.log("Using discount price:", "0.005", "ETH");
    } else {
      // Use standard price (0.01 ETH)
      if (standardPrice && typeof standardPrice === "bigint") {
        price = standardPrice;
        console.log(
          "Using contract standard price:",
          formatEther(standardPrice),
          "ETH"
        );
      } else {
        // Fallback to known standard price (0.01 ETH in wei)
        price = BigInt("10000000000000000");
        console.log(
          "Using fallback standard price:",
          formatEther(price),
          "ETH"
        );
      }
    }

    // Validate design ID before minting
    if (designId < 1 || designId > 10) {
      throw new Error("Invalid design ID. Must be between 1 and 10.");
    }

    console.log("Minting with params:", {
      designId,
      requestedDiscount: hasDiscount,
      priceInEth: formatEther(price),
      priceInWei: price.toString(),
      contractAddress,
      network: "sepolia",
    });

    mintWrite({
      args: [BigInt(designId)],
      value: price,
    });
  };

  return {
    // Contract data
    standardPrice:
      standardPrice && typeof standardPrice === "bigint"
        ? formatEther(standardPrice)
        : "0.01",
    discountPrice: "0.005", // Force correct discount price until contract is redeployed
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
    transactionHash: mintData?.hash,

    // Connection state
    isConnected,
    contractAddress,
  };
}
