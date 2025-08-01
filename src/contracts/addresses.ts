// Contract addresses for different networks
export const CONTRACT_ADDRESSES = {
  // Your deployed contract address on Sepolia
  sepolia: "0xDda54Cd36D18dA42abAB99709890825c9cC870d1",
  goerli: "0x0000000000000000000000000000000000000000", // Update if you deploy to Goerli
  mainnet: "0x0000000000000000000000000000000000000000", // For future mainnet deployment
} as const;

// ALVA token addresses
export const ALVA_TOKEN_ADDRESSES = {
  sepolia: "0x779877A7B0D9E8603169DdbD7836e478b4624789", // Sepolia testnet token
  goerli: "0x0000000000000000000000000000000000000000", // Update if needed
  mainnet: "0x0000000000000000000000000000000000000000", // For future mainnet deployment
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
    rpcUrl: "https://mainnet.infura.io/v3/",
  },
} as const;
