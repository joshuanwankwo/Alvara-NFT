// Contract addresses for different networks
export const CONTRACT_ADDRESSES = {
  // Your deployed contract address on Sepolia
  sepolia: "0xE6FDaF5F32d9187C0244e5C565F2CAcED1A3747f",
  goerli: "0x0000000000000000000000000000000000000000", // Update if you deploy to Goerli
  mainnet: "0x45F3bC0E6A2b8ae580A5dD1D5682D58505643dc8", // AlvaraNFT on mainnet (latest deployment)
} as const;

// ALVA token addresses
export const ALVA_TOKEN_ADDRESSES = {
  sepolia: "0x779877A7B0D9E8603169DdbD7836e478b4624789", // Sepolia testnet token
  goerli: "0x0000000000000000000000000000000000000000", // Update if needed
  mainnet: "0x8e729198d1C59B82bd6bBa579310C40d740A11C2", // ALVA token on mainnet
} as const;

// veALVA token addresses (voting escrow)
export const VEALVA_TOKEN_ADDRESSES = {
  sepolia: "0x0000000000000000000000000000000000000000", // Update if deployed to Sepolia
  goerli: "0x0000000000000000000000000000000000000000", // Update if needed
  mainnet: "0x07157d55112A6bAdd62099B8ad0BBDfBC81075BD", // veALVA token on mainnet
} as const;

// WETH token addresses
export const WETH_TOKEN_ADDRESSES = {
  sepolia: "0x0000000000000000000000000000000000000000", // Update with Sepolia WETH address
  goerli: "0x0000000000000000000000000000000000000000", // Update if needed
  mainnet: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // WETH token on mainnet
} as const;

// Uniswap V3 Router addresses
export const UNISWAP_V3_ROUTER_ADDRESSES = {
  sepolia: "0x0000000000000000000000000000000000000000", // Update with Sepolia router address
  goerli: "0x0000000000000000000000000000000000000000", // Update if needed
  mainnet: "0xE592427A0AEce92De3Edee1F18E0157C05861564", // Uniswap V3 SwapRouter
} as const;

// Staking Protocol addresses
export const STAKING_PROTOCOL_ADDRESSES = {
  sepolia: "0x0000000000000000000000000000000000000000", // Update if deployed to Sepolia
  goerli: "0x0000000000000000000000000000000000000000", // Update if needed
  mainnet: "0xafdd66531642b9e4c2abdb431b05561103d8fcd1", // Add your staking protocol proxy address here
} as const;

// Network configuration
export const SUPPORTED_NETWORKS = {
  sepolia: {
    chainId: 11155111,
    name: "Sepolia",
    rpcUrl: "https://sepolia.infura.io/v3/",
  },
  goerli: {
    chainId: 5,
    name: "Goerli",
    rpcUrl: "https://goerli.infura.io/v3/",
  },
  mainnet: {
    chainId: 1,
    name: "Ethereum Mainnet",
    rpcUrl: "https://mainnet.infura.io/v3/670a4884735c42bb9d015436063b004e",
  },
} as const;
