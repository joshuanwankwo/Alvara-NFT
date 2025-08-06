// ALVA Token Balance Service
// Checks ALVA token balance on mainnet to provide discounts on testnet

import { ethers } from "ethers";

// veALVA Token Contract Address on Ethereum Mainnet
const VEALVA_TOKEN_ADDRESS_MAINNET =
  "0x07157d55112A6bAdd62099B8ad0BBDfBC81075BD";

// veALVA Token ABI (minimal for balanceOf function)
const VEALVA_TOKEN_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
];

// Discount threshold (1.5 veALVA tokens)
const DISCOUNT_THRESHOLD = 1.5;

export interface VeAlvaBalanceResult {
  balance: number;
  hasDiscount: boolean;
  symbol: string;
  decimals: number;
  error?: string;
}

/**
 * Check veALVA token balance on mainnet using direct contract call
 */
export async function checkVeAlvaBalanceDirect(
  address: string
): Promise<VeAlvaBalanceResult> {
  try {
    // Connect to Ethereum mainnet
    const provider = new ethers.JsonRpcProvider("https://eth.llamarpc.com");

    // Create contract instance
    const veAlvaContract = new ethers.Contract(
      VEALVA_TOKEN_ADDRESS_MAINNET,
      VEALVA_TOKEN_ABI,
      provider
    );

    // Get balance and token info
    const [balance, decimals, symbol] = await Promise.all([
      veAlvaContract.balanceOf(address),
      veAlvaContract.decimals(),
      veAlvaContract.symbol(),
    ]);

    // Convert balance to human readable format
    const balanceNumber = Number(ethers.formatUnits(balance, decimals));

    return {
      balance: balanceNumber,
      hasDiscount: balanceNumber >= DISCOUNT_THRESHOLD,
      symbol,
      decimals,
    };
  } catch (error) {
    console.error("Error checking veALVA balance directly:", error);
    return {
      balance: 0,
      hasDiscount: false,
      symbol: "veALVA",
      decimals: 18,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Check veALVA token balance using Ethplorer API as fallback
 */
export async function checkVeAlvaBalanceAPI(
  address: string
): Promise<VeAlvaBalanceResult> {
  try {
    // Use Ethplorer API to get token balances
    const response = await fetch(
      `https://api.ethplorer.io/getAddressInfo/${address}?apiKey=freekey`
    );

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();

    // Find veALVA token in the tokens array
    const veAlvaToken = data.tokens?.find(
      (token: any) =>
        token.tokenInfo?.address?.toLowerCase() ===
        VEALVA_TOKEN_ADDRESS_MAINNET.toLowerCase()
    );

    if (!veAlvaToken) {
      return {
        balance: 0,
        hasDiscount: false,
        symbol: "veALVA",
        decimals: 18,
      };
    }

    const balance =
      parseFloat(veAlvaToken.balance) /
      Math.pow(10, veAlvaToken.tokenInfo.decimals);

    return {
      balance,
      hasDiscount: balance >= DISCOUNT_THRESHOLD,
      symbol: veAlvaToken.tokenInfo.symbol,
      decimals: veAlvaToken.tokenInfo.decimals,
    };
  } catch (error) {
    console.error("Error checking veALVA balance via API:", error);
    return {
      balance: 0,
      hasDiscount: false,
      symbol: "veALVA",
      decimals: 18,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Main function to check veALVA balance with fallback methods
 */
export async function checkVeAlvaBalance(
  address: string
): Promise<VeAlvaBalanceResult> {
  // Try direct contract call first
  const directResult = await checkVeAlvaBalanceDirect(address);

  if (!directResult.error) {
    return directResult;
  }

  // Fallback to API method
  console.log("Direct contract call failed, trying API fallback...");
  return await checkVeAlvaBalanceAPI(address);
}

/**
 * Check if user has sufficient veALVA tokens for discount
 */
export function hasVeAlvaDiscount(balance: number): boolean {
  return balance >= DISCOUNT_THRESHOLD;
}

/**
 * Get discount percentage based on veALVA balance
 */
export function getDiscountPercentage(balance: number): number {
  if (balance >= DISCOUNT_THRESHOLD) {
    return 50; // 50% discount
  }
  return 0; // No discount
}
