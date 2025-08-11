"use client";

import { useState, useEffect, useCallback } from "react";
import {
  useAccount,
  useContractWrite,
  useWaitForTransaction,
  useNetwork,
  useContractRead,
  useContractEvent,
} from "wagmi";
import { parseEther, formatEther } from "viem";
import { STAKING_PROTOCOL_ABI, ERC20_ABI } from "@/contracts/StakingProtocol";
import { ALVARA_MINT_ABI } from "@/contracts/AlvaraMint";
import {
  STAKING_PROTOCOL_ADDRESSES,
  ALVA_TOKEN_ADDRESSES,
  CONTRACT_ADDRESSES,
} from "@/contracts/addresses";
import { useVeAlvaBalance } from "@/hooks/useAlvaBalance";

// Constants for staking pools - based on the contract structure
export const STAKING_POOLS = {
  FOREVER: "FOREVER",
  SIX_MONTHS: "SIX_MONTHS", // You'll need to verify the exact pool names from your contract deployment
  ONE_YEAR: "ONE_YEAR",
  // Add more pools as configured in your contract
} as const;

export const SIX_MONTHS = STAKING_POOLS.SIX_MONTHS; // Keep backward compatibility

export function useStakingProtocol() {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const [lastSwapAmount, setLastSwapAmount] = useState<string>("0");
  const [showStakeButton, setShowStakeButton] = useState<boolean>(false);
  const [approvedAmount, setApprovedAmount] = useState<string>("0");

  // Check if user has veAlva tokens
  const {
    veAlvaBalance,
    isLoading: isVeAlvaLoading,
    error: veAlvaError,
  } = useVeAlvaBalance();

  // Get contract addresses based on current network
  const getContractAddress = () => {
    if (chain?.id === 11155111) return STAKING_PROTOCOL_ADDRESSES.sepolia;
    if (chain?.id === 5) return STAKING_PROTOCOL_ADDRESSES.goerli;
    if (chain?.id === 1) return STAKING_PROTOCOL_ADDRESSES.mainnet;
    return STAKING_PROTOCOL_ADDRESSES.mainnet; // Default to mainnet
  };

  const getAlvaTokenAddress = () => {
    if (chain?.id === 11155111) return ALVA_TOKEN_ADDRESSES.sepolia;
    if (chain?.id === 5) return ALVA_TOKEN_ADDRESSES.goerli;
    if (chain?.id === 1) return ALVA_TOKEN_ADDRESSES.mainnet;
    return ALVA_TOKEN_ADDRESSES.mainnet; // Default to mainnet
  };

  const getAlvaraMintAddress = () => {
    if (chain?.id === 11155111) return CONTRACT_ADDRESSES.sepolia;
    if (chain?.id === 5) return CONTRACT_ADDRESSES.goerli;
    if (chain?.id === 1) return CONTRACT_ADDRESSES.mainnet;
    return CONTRACT_ADDRESSES.sepolia; // Default to sepolia
  };

  const contractAddress = getContractAddress();
  const alvaTokenAddress = getAlvaTokenAddress();
  const alvaraMintAddress = getAlvaraMintAddress();

  // Listen for SwapExecuted events from the Alvara mint contract
  useContractEvent({
    address: alvaraMintAddress as `0x${string}`,
    abi: ALVARA_MINT_ABI,
    eventName: "SwapExecuted",
    listener(logs) {
      console.log("SwapExecuted event detected:", logs);

      // Process each log entry
      logs.forEach((log) => {
        if (log.args && typeof log.args === "object") {
          const { user, ethIn, alvaOut } = log.args as {
            user?: string;
            ethIn?: bigint;
            alvaOut?: bigint;
          };

          console.log("SwapExecuted event args:", { user, ethIn, alvaOut });

          // Only process events for the current user
          if (user && address && user.toLowerCase() === address.toLowerCase()) {
            if (alvaOut) {
              const alvaAmount = formatEther(alvaOut);
              console.log("ALVA amount received from swap:", alvaAmount);
              setLastSwapAmount(alvaAmount);
              setShowStakeButton(false); // Reset stake button when new swap occurs
            }
          }
        }
      });
    },
  });

  // Listen for Approval events from the ALVA token contract
  useContractEvent({
    address: alvaTokenAddress as `0x${string}`,
    abi: ERC20_ABI,
    eventName: "Approval",
    listener(logs) {
      console.log("Approval event detected:", logs);

      // Process each log entry
      logs.forEach((log) => {
        if (log.args && typeof log.args === "object") {
          const { owner, spender, value } = log.args as {
            owner?: string;
            spender?: string;
            value?: bigint;
          };

          console.log("Approval event args:", { owner, spender, value });

          // Only process events for the current user approving the staking contract
          if (
            owner &&
            spender &&
            address &&
            contractAddress &&
            owner.toLowerCase() === address.toLowerCase() &&
            spender.toLowerCase() === contractAddress.toLowerCase()
          ) {
            if (value && value > BigInt(0)) {
              const approvedAmountFormatted = formatEther(value);
              console.log(
                "ALVA tokens approved for staking:",
                approvedAmountFormatted
              );
              setApprovedAmount(approvedAmountFormatted);
              setShowStakeButton(true); // Show stake button after approval
            }
          }
        }
      });
    },
  });

  // Listen for TokensStaked events from the staking contract
  useContractEvent({
    address: contractAddress as `0x${string}`,
    abi: STAKING_PROTOCOL_ABI,
    eventName: "TokensStaked",
    listener(logs) {
      console.log("TokensStaked event detected:", logs);

      // Process each log entry
      logs.forEach((log) => {
        if (log.args && typeof log.args === "object") {
          const { lockId, account, amount, pool, veAlva } = log.args as {
            lockId?: bigint;
            account?: string;
            amount?: bigint;
            pool?: string;
            veAlva?: bigint;
          };

          console.log("TokensStaked event args:", {
            lockId,
            account,
            amount,
            pool,
            veAlva,
          });

          // Only process events for the current user
          if (
            account &&
            address &&
            account.toLowerCase() === address.toLowerCase()
          ) {
            console.log("Staking successful for user:", {
              lockId: lockId?.toString(),
              amount: amount ? formatEther(amount) : "0",
              pool,
              veAlva: veAlva ? formatEther(veAlva) : "0",
            });

            // Hide the stake button after successful staking
            setShowStakeButton(false);

            // Reset mint/stake flow back to default (mint)
            // Clear the last swap amount so UI returns to Mint state
            setLastSwapAmount("0");
          }
        }
      });
    },
  });

  // Check current allowance
  const { data: currentAllowance, refetch: refetchAllowance } = useContractRead(
    {
      address: alvaTokenAddress as `0x${string}`,
      abi: ERC20_ABI,
      functionName: "allowance",
      args: address && contractAddress ? [address, contractAddress] : undefined,
      enabled: !!address && !!contractAddress,
    }
  );

  // Contract write for ALVA token approval
  const {
    data: approveData,
    write: approveWrite,
    isLoading: isApproveLoading,
    error: approveError,
  } = useContractWrite({
    address: alvaTokenAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "approve",
  });

  const { isLoading: isApproveWaiting, isSuccess: isApproveSuccess } =
    useWaitForTransaction({
      hash: approveData?.hash,
    });

  // Contract write for staking
  const {
    data: stakeData,
    write: stakeWrite,
    isLoading: isStakeLoading,
    error: stakeError,
  } = useContractWrite({
    address: contractAddress as `0x${string}`,
    abi: STAKING_PROTOCOL_ABI,
    functionName: "stake",
  });

  const { isLoading: isStakeWaiting, isSuccess: isStakeSuccess } =
    useWaitForTransaction({
      hash: stakeData?.hash,
    });

  // Reset UI to Mint state after successful stake tx confirmation
  useEffect(() => {
    if (isStakeSuccess) {
      setShowStakeButton(false);
      setApprovedAmount("0");
      setLastSwapAmount("0");
    }
  }, [isStakeSuccess]);

  // Contract write for increasing stake amount
  const {
    data: increaseAmountData,
    write: increaseAmountWrite,
    isLoading: isIncreaseAmountLoading,
    error: increaseAmountError,
  } = useContractWrite({
    address: contractAddress as `0x${string}`,
    abi: STAKING_PROTOCOL_ABI,
    functionName: "increaseAmount",
  });

  const {
    isLoading: isIncreaseAmountWaiting,
    isSuccess: isIncreaseAmountSuccess,
  } = useWaitForTransaction({
    hash: increaseAmountData?.hash,
  });

  // Reset UI to Mint state after successful increaseAmount tx confirmation
  useEffect(() => {
    if (isIncreaseAmountSuccess) {
      setShowStakeButton(false);
      setApprovedAmount("0");
      setLastSwapAmount("0");
    }
  }, [isIncreaseAmountSuccess]);

  // Approve ALVA tokens for staking
  const approve = (amount: string) => {
    if (!approveWrite) return;

    try {
      const amountInWei = parseEther(amount);
      console.log("Approving ALVA tokens:", {
        amount,
        amountInWei: amountInWei.toString(),
        spender: contractAddress,
        tokenAddress: alvaTokenAddress,
        network: chain?.name || "mainnet",
      });

      approveWrite({
        args: [contractAddress, amountInWei],
      });
    } catch (error) {
      console.error("Approval error:", error);
      throw error;
    }
  };

  // Stake tokens (with approval check) - now uses string pool parameter
  const stake = (amount: string) => {
    if (!stakeWrite) return;

    try {
      const amountInWei = parseEther(amount);
      console.log("Staking with params:", {
        amount,
        amountInWei: amountInWei.toString(),
        pool: SIX_MONTHS,
        contractAddress,
        network: chain?.name || "mainnet",
      });

      stakeWrite({
        args: [amountInWei, SIX_MONTHS],
      });

      // Hide stake button after staking attempt
      setShowStakeButton(false);
    } catch (error) {
      console.error("Staking error:", error);
      throw error;
    }
  };

  // Increase stake amount (for wallets that already have veAlva)
  const increaseAmount = (amount: string) => {
    if (!increaseAmountWrite) return;

    try {
      const amountInWei = parseEther(amount);
      console.log("Increasing stake amount with params:", {
        amount,
        amountInWei: amountInWei.toString(),
        isForever: false,
        contractAddress,
        network: chain?.name || "mainnet",
      });

      increaseAmountWrite({
        args: [amountInWei, false],
      });

      // Hide stake button after increase attempt
      setShowStakeButton(false);
    } catch (error) {
      console.error("Increase amount error:", error);
      throw error;
    }
  };

  // Check if approval is needed
  const needsApproval = useCallback(
    (amount: string) => {
      if (!currentAllowance || !amount) return true;
      const amountInWei = parseEther(amount);
      return currentAllowance < amountInWei;
    },
    [currentAllowance]
  );

  // Hide stake button manually
  const hideStakeButton = useCallback(() => {
    setShowStakeButton(false);
    // Also reset amounts so UI returns to Mint state
    setApprovedAmount("0");
    setLastSwapAmount("0");
  }, []);

  // Check if user has veAlva tokens (for determining whether to use stake or increaseAmount)
  const hasVeAlva = useCallback(() => {
    return veAlvaBalance && veAlvaBalance.balance > 0 && !veAlvaError;
  }, [veAlvaBalance, veAlvaError]);

  // Smart staking function that uses increaseAmount if user has veAlva, otherwise uses stake
  // Note: Stakes are always 6 months, never forever
  const smartStake = useCallback(
    (amount: string) => {
      if (hasVeAlva()) {
        console.log("User has veAlva, using increaseAmount");
        // If user has veAlva, use increaseAmount
        increaseAmount(amount);
      } else {
        // If user doesn't have veAlva, use regular stake (always 6 months)
        console.log("User does not have veAlva, using stake");
        stake(amount);
      }
    },
    [hasVeAlva, increaseAmount, stake]
  );

  return {
    // Functions
    approve,
    stake,
    increaseAmount,
    smartStake,
    hideStakeButton,
    hasVeAlva,

    // Constants
    STAKING_POOLS,

    // Transaction states
    isApproveLoading: isApproveLoading || isApproveWaiting,
    isApproveSuccess,
    approveTransactionHash: approveData?.hash,
    approveError,
    isStakeLoading: isStakeLoading || isStakeWaiting,
    isStakeSuccess,
    stakeTransactionHash: stakeData?.hash,
    stakeError,
    isIncreaseAmountLoading: isIncreaseAmountLoading || isIncreaseAmountWaiting,
    isIncreaseAmountSuccess,
    increaseAmountTransactionHash: increaseAmountData?.hash,
    increaseAmountError,

    // State
    currentAllowance,
    needsApproval,
    refetchAllowance,
    lastSwapAmount, // New: ALVA amount from the latest swap
    showStakeButton, // New: Whether to show the stake button after approval
    approvedAmount, // New: Amount that was approved
    veAlvaBalance, // New: veAlva balance information
    isVeAlvaLoading, // New: Loading state for veAlva balance check
    veAlvaError, // New: Error state for veAlva balance check

    // Connection state
    isConnected,
    contractAddress,
    alvaTokenAddress,
    isContractDeployed: () =>
      contractAddress !== "0x0000000000000000000000000000000000000000",
  };
}
