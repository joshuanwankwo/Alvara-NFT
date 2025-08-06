import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import {
  checkVeAlvaBalance,
  VeAlvaBalanceResult,
} from "@/services/alvaTokenBalance";

export function useVeAlvaBalance() {
  const { address, isConnected } = useAccount();
  const [veAlvaBalance, setVeAlvaBalance] =
    useState<VeAlvaBalanceResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check veALVA balance when wallet connects
  useEffect(() => {
    if (!isConnected || !address) {
      setVeAlvaBalance(null);
      setError(null);
      return;
    }

    const checkBalance = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await checkVeAlvaBalance(address);
        setVeAlvaBalance(result);

        if (result.error) {
          setError(result.error);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to check veALVA balance";
        setError(errorMessage);
        setVeAlvaBalance({
          balance: 0,
          hasDiscount: false,
          symbol: "veALVA",
          decimals: 18,
          error: errorMessage,
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkBalance();
  }, [address, isConnected]);

  // Manual refresh function
  const refreshBalance = async () => {
    if (!address) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await checkVeAlvaBalance(address);
      setVeAlvaBalance(result);

      if (result.error) {
        setError(result.error);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to refresh veALVA balance";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    veAlvaBalance,
    isLoading,
    error,
    refreshBalance,
    hasDiscount: veAlvaBalance?.hasDiscount ?? false,
    balance: veAlvaBalance?.balance ?? 0,
    symbol: veAlvaBalance?.symbol ?? "veALVA",
  };
}
