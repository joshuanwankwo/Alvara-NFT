// ALVA Token Balance Service
// Checks ALVA token balance on mainnet to provide discounts on testnet

import { ethers } from "ethers";

// ALVA Token Contract Address on Ethereum Mainnet
const ALVA_TOKEN_ADDRESS_MAINNET = "0x8e729198d1C59B82bd6bBa579310C40d740A11C2";

// ALVA Token ABI (minimal for balanceOf function)
const ALVA_TOKEN_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
];

// Discount threshold (150 ALVA tokens)
const DISCOUNT_THRESHOLD = 150;

export interface AlvaBalanceResult {
  balance: number;
  hasDiscount: boolean;
  symbol: string;
  decimals: number;
  error?: string;
}

/**
 * Check ALVA token balance on mainnet using direct contract call
 */
export async function checkAlvaBalanceDirect(
  address: string
): Promise<AlvaBalanceResult> {
  try {
    // Connect to Ethereum mainnet
    const provider = new ethers.providers.JsonRpcProvider(
      "https://eth.llamarpc.com"
    );

    // Create contract instance
    const alvaContract = new ethers.Contract(
      ALVA_TOKEN_ADDRESS_MAINNET,
      ALVA_TOKEN_ABI,
      provider
    );

    // Get balance and token info
    const [balance, decimals, symbol] = await Promise.all([
      alvaContract.balanceOf(address),
      alvaContract.decimals(),
      alvaContract.symbol(),
    ]);

    // Convert balance to human readable format
    const balanceNumber = Number(ethers.utils.formatUnits(balance, decimals));

    return {
      balance: balanceNumber,
      hasDiscount: balanceNumber >= DISCOUNT_THRESHOLD,
      symbol,
      decimals,
    };
  } catch (error) {
    console.error("Error checking ALVA balance directly:", error);
    return {
      balance: 0,
      hasDiscount: false,
      symbol: "ALVA",
      decimals: 18,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Check ALVA token balance using Ethplorer API as fallback
 */
export async function checkAlvaBalanceAPI(
  address: string
): Promise<AlvaBalanceResult> {
  try {
    // Use Ethplorer API to get token balances
    const response = await fetch(
      `https://api.ethplorer.io/getAddressInfo/${address}?apiKey=freekey`
    );

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();

    // Find ALVA token in the tokens array
    const alvaToken = data.tokens?.find(
      (token: any) =>
        token.tokenInfo?.address?.toLowerCase() ===
        ALVA_TOKEN_ADDRESS_MAINNET.toLowerCase()
    );

    if (!alvaToken) {
      return {
        balance: 0,
        hasDiscount: false,
        symbol: "ALVA",
        decimals: 18,
      };
    }

    const balance =
      parseFloat(alvaToken.balance) /
      Math.pow(10, alvaToken.tokenInfo.decimals);

    return {
      balance,
      hasDiscount: balance >= DISCOUNT_THRESHOLD,
      symbol: alvaToken.tokenInfo.symbol,
      decimals: alvaToken.tokenInfo.decimals,
    };
  } catch (error) {
    console.error("Error checking ALVA balance via API:", error);
    return {
      balance: 0,
      hasDiscount: false,
      symbol: "ALVA",
      decimals: 18,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Main function to check ALVA balance with fallback methods
 */
export async function checkAlvaBalance(
  address: string
): Promise<AlvaBalanceResult> {
  // Try direct contract call first
  const directResult = await checkAlvaBalanceDirect(address);

  if (!directResult.error) {
    return directResult;
  }

  // Fallback to API method
  console.log("Direct contract call failed, trying API fallback...");
  return await checkAlvaBalanceAPI(address);
}

/**
 * Check if user has sufficient ALVA tokens for discount
 */
export function hasAlvaDiscount(balance: number): boolean {
  return balance >= DISCOUNT_THRESHOLD;
}

/**
 * Get discount percentage based on ALVA balance
 */
export function getDiscountPercentage(balance: number): number {
  if (balance >= DISCOUNT_THRESHOLD) {
    return 50; // 50% discount
  }
  return 0; // No discount
}
