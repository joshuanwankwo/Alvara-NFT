import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import {
  checkAlvaBalance,
  AlvaBalanceResult,
} from "@/services/alvaTokenBalance";

export function useAlvaBalance() {
  const { address, isConnected } = useAccount();
  const [alvaBalance, setAlvaBalance] = useState<AlvaBalanceResult | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check ALVA balance when wallet connects
  useEffect(() => {
    if (!isConnected || !address) {
      setAlvaBalance(null);
      setError(null);
      return;
    }

    const checkBalance = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await checkAlvaBalance(address);
        setAlvaBalance(result);

        if (result.error) {
          setError(result.error);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to check ALVA balance";
        setError(errorMessage);
        setAlvaBalance({
          balance: 0,
          hasDiscount: false,
          symbol: "ALVA",
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
      const result = await checkAlvaBalance(address);
      setAlvaBalance(result);

      if (result.error) {
        setError(result.error);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to refresh ALVA balance";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    alvaBalance,
    isLoading,
    error,
    refreshBalance,
    hasDiscount: alvaBalance?.hasDiscount ?? false,
    balance: alvaBalance?.balance ?? 0,
    symbol: alvaBalance?.symbol ?? "ALVA",
  };
}
