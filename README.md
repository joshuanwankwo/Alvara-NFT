# Alvara NFT Platform - Complete Setup Guide

A modern NFT minting platform with smart contract integration, built with Next.js, Wagmi, and RainbowKit. This guide provides complete instructions for setting up, testing, deploying, and running the entire project.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Overview](#project-overview)
3. [Smart Contract Setup](#smart-contract-setup)
4. [Frontend Setup](#frontend-setup)
5. [Environment Configuration](#environment-configuration)
6. [Testing](#testing)
7. [Deployment](#deployment)
8. [Post-Deployment Configuration](#post-deployment-configuration)
9. [Troubleshooting](#troubleshooting)
10. [Project Structure](#project-structure)

## 🔧 Prerequisites

Before starting, ensure you have the following installed:

### Required Software
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download here](https://git-scm.com/)
- **MetaMask** or any Web3 wallet - [Download here](https://metamask.io/)

### Required Accounts & API Keys
- **Alchemy Account** - [Sign up here](https://www.alchemy.com/)
- **Etherscan Account** - [Sign up here](https://etherscan.io/)
- **Pinata Account** (for IPFS) - [Sign up here](https://app.pinata.cloud/)
- **Vercel Account** (for deployment) - [Sign up here](https://vercel.com/)

### Required Test ETH
- **Sepolia Testnet ETH** - Get from [Sepolia Faucet](https://sepoliafaucet.com/)
- **Mainnet ETH** (for production deployment)

## 🏗 Project Overview

This project consists of two main parts:
1. **Smart Contracts** (Solidity + Hardhat) - NFT minting and staking logic
2. **Frontend** (Next.js + React) - User interface and Web3 integration

### Key Features
- NFT minting with dynamic pricing
- veALVA token staking integration
- Responsive design with Tailwind CSS
- Comprehensive error handling
- Real-time transaction tracking
- Social sharing capabilities

## 🔗 Smart Contract Setup

### Step 1: Navigate to Contracts Directory
```bash
cd contracts
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Environment Setup for Smart Contracts
Create a `.env` file in the `contracts/` directory:
```env
# Network RPC URLs
ETH_RPC_URL=https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID

# Private Keys (NEVER commit these to git)
PRIVATE_KEY=your_private_key_here
DEPLOYER_PRIVATE_KEY=your_deployer_private_key_here

# Etherscan API Key (for contract verification)
ETHERSCAN_API_KEY=your_etherscan_api_key

# Alchemy API Key
ALCHEMY_API_KEY=your_alchemy_api_key
```

### Step 4: Compile Smart Contracts
```bash
# Compile all contracts
npm run compile

# Or using Hardhat directly
npx hardhat compile
```

### Step 5: Run Tests
```bash
# Run all tests
npm test

# Run tests with verbose output
npm run test:verbose

# Run specific test file
npx hardhat test test/AlvaraNFTTest.sol
```

### Step 6: Deploy to Testnet (Sepolia)
```bash
# Deploy to Sepolia testnet
npm run deploy:sepolia

# Or using Hardhat directly
npx hardhat run scripts/deploy.js --network sepolia
```

### Step 7: Deploy to Mainnet
```bash
# Deploy to mainnet (BE CAREFUL - this costs real ETH)
npm run deploy:mainnet

# Or using Hardhat directly
npx hardhat run scripts/deploy.js --network mainnet
```

### Step 8: Verify Contracts on Etherscan
After deployment, verify your contracts:
```bash
# Verify on Sepolia
npx hardhat verify --network sepolia DEPLOYED_CONTRACT_ADDRESS

# Verify on Mainnet
npx hardhat verify --network mainnet DEPLOYED_CONTRACT_ADDRESS
```

## 🎨 Frontend Setup

### Step 1: Navigate to Project Root
```bash
cd ..  # If you're in the contracts directory
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Environment Setup for Frontend
Create a `.env.local` file in the project root:
```env
# Alchemy API Key (for NFT metadata and blockchain data)
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key

# Contract Addresses (update these after deployment)
NEXT_PUBLIC_CONTRACT_ADDRESS=your_deployed_contract_address
NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS=your_staking_contract_address
NEXT_PUBLIC_ALVA_TOKEN_ADDRESS=your_alva_token_address

# Optional: Pinata API Keys (for IPFS uploads)
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_API_KEY=your_pinata_secret_key
```

### Step 4: Update Contract Addresses
After deploying your smart contracts, update the contract addresses in:
```
src/contracts/addresses.ts
```

Replace the placeholder addresses with your deployed contract addresses:
```typescript
export const CONTRACT_ADDRESSES = {
  mainnet: "YOUR_DEPLOYED_CONTRACT_ADDRESS",
  sepolia: "YOUR_SEPOLIA_CONTRACT_ADDRESS",
  // ... other networks
};
```

### Step 5: Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Step 6: Build for Production
```bash
npm run build
```

## 🔧 Environment Configuration

### Required Environment Variables

#### Frontend (.env.local)
```env
# Required
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key

# Optional (for enhanced features)
NEXT_PUBLIC_CONTRACT_ADDRESS=your_contract_address
NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS=your_staking_address
NEXT_PUBLIC_ALVA_TOKEN_ADDRESS=your_token_address
```

#### Smart Contracts (.env in contracts/ directory)
```env
# Required
ETH_RPC_URL=https://mainnet.infura.io/v3/YOUR_PROJECT_ID
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
PRIVATE_KEY=your_private_key
ETHERSCAN_API_KEY=your_etherscan_api_key

# Optional
ALCHEMY_API_KEY=your_alchemy_api_key
```

### How to Get API Keys

#### Alchemy API Key
1. Go to [Alchemy](https://www.alchemy.com/)
2. Create an account
3. Create a new app
4. Select "Ethereum" and "Mainnet"
5. Copy the API key from your app dashboard

#### Etherscan API Key
1. Go to [Etherscan](https://etherscan.io/)
2. Create an account
3. Go to your profile
4. Create a new API key
5. Copy the API key

#### Infura Project ID
1. Go to [Infura](https://infura.io/)
2. Create an account
3. Create a new project
4. Copy the project ID from the project settings

## 🧪 Testing

### Smart Contract Testing
```bash
cd contracts

# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npx hardhat test test/AlvaraNFTTest.sol

# Run tests with gas reporting
npm run test:gas
```

### Frontend Testing
```bash
# Run linting
npm run lint

# Run type checking
npm run type-check

# Run build test
npm run build
```

### Manual Testing Checklist
- [ ] Wallet connection works
- [ ] NFT minting functionality
- [ ] Error handling displays properly
- [ ] Responsive design on mobile/tablet/desktop
- [ ] Transaction confirmation flow
- [ ] NFT display and metadata loading
- [ ] Social sharing functionality

## 🚀 Deployment

### Frontend Deployment (Vercel)

#### Step 1: Prepare for Deployment
```bash
# Build the project
npm run build

# Test the build locally
npm start
```

#### Step 2: Deploy to Vercel
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_ALCHEMY_API_KEY`
   - `NEXT_PUBLIC_CONTRACT_ADDRESS`
   - `NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS`
   - `NEXT_PUBLIC_ALVA_TOKEN_ADDRESS`

#### Step 3: Configure Vercel Settings
- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### Smart Contract Deployment

#### Testnet Deployment (Sepolia)
```bash
cd contracts

# Deploy to Sepolia
npm run deploy:sepolia

# Verify contract
npx hardhat verify --network sepolia DEPLOYED_ADDRESS
```

#### Mainnet Deployment
```bash
cd contracts

# Deploy to mainnet (BE CAREFUL - costs real ETH)
npm run deploy:mainnet

# Verify contract
npx hardhat verify --network mainnet DEPLOYED_ADDRESS
```

## 🔄 Post-Deployment Configuration

### Step 1: Update Contract Addresses
After deployment, update the contract addresses in:
```
src/contracts/addresses.ts
```

### Step 2: Update Environment Variables
Update your `.env.local` file with the new contract addresses:
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=your_new_contract_address
NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS=your_new_staking_address
NEXT_PUBLIC_ALVA_TOKEN_ADDRESS=your_new_token_address
```

### Step 3: Update Vercel Environment Variables
1. Go to your Vercel project dashboard
2. Navigate to Settings > Environment Variables
3. Update the contract addresses

### Step 4: Test the Live Application
1. Visit your deployed application
2. Connect a wallet
3. Test minting functionality
4. Verify error handling works
5. Test on different devices

## 🛠 Troubleshooting

### Common Issues

#### Smart Contract Issues
```bash
# If compilation fails
npm run clean
npm install
npm run compile

# If deployment fails
# Check your private key and RPC URL
# Ensure you have enough ETH for gas fees
```

#### Frontend Issues
```bash
# If build fails
rm -rf node_modules .next
npm install
npm run build

# If environment variables aren't working
# Check .env.local file exists
# Restart development server
```

#### Network Issues
```bash
# If RPC calls fail
# Check your Alchemy API key
# Verify network configuration
# Check if you're on the correct network
```

### Error Messages and Solutions

#### "Contract not deployed"
- Verify contract address is correct
- Check if contract is deployed on the correct network
- Ensure contract is verified on Etherscan

#### "Insufficient funds"
- Add more ETH to your wallet
- Check gas fees and adjust if needed

#### "Network error"
- Check your internet connection
- Verify RPC URLs are correct
- Check if the network is congested

## 📁 Project Structure

```
alvaranew/
├── contracts/                    # Smart contract development
│   ├── contracts/               # Solidity contracts
│   │   └── src/
│   │       └── AlvaraNFT.sol   # Main NFT contract
│   ├── scripts/                 # Deployment scripts
│   ├── test/                   # Contract tests
│   ├── hardhat.config.js       # Hardhat configuration
│   └── package.json            # Contract dependencies
├── src/                        # Frontend source code
│   ├── app/                   # Next.js App Router
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── features/          # Feature components
│   │   │   └── AvatarMinter.tsx
│   │   ├── layout/            # Layout components
│   │   └── ui/                # UI components
│   ├── hooks/                 # Custom React hooks
│   │   ├── useAlvaraMint.ts
│   │   ├── useStakingProtocol.ts
│   │   └── useWalletNFTs.ts
│   ├── contracts/             # Contract ABIs and addresses
│   │   ├── AlvaraMint.ts
│   │   ├── StakingProtocol.ts
│   │   └── addresses.ts
│   ├── contexts/              # React contexts
│   │   └── NotificationContext.tsx
│   └── services/              # API services
├── public/                    # Static assets
│   ├── images/               # Images and icons
│   └── fonts/                # Custom fonts
├── .env.local                # Frontend environment variables
├── .gitignore               # Git ignore rules
├── next.config.js           # Next.js configuration
├── package.json             # Frontend dependencies
├── tailwind.config.js       # Tailwind CSS configuration
└── tsconfig.json            # TypeScript configuration
```

## 🔒 Security Considerations

### Smart Contract Security
- All contracts are tested thoroughly
- Use OpenZeppelin libraries for security
- Implement proper access controls
- Test with different scenarios

### Frontend Security
- Environment variables are properly configured
- No sensitive data in client-side code
- Input validation and sanitization
- Secure wallet connections

### Deployment Security
- Use environment variables for sensitive data
- Never commit private keys to git
- Use separate wallets for testing and production
- Verify contracts on Etherscan

## 📞 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Review the error messages in the console
3. Verify all environment variables are set correctly
4. Ensure you're on the correct network
5. Check if you have sufficient funds for transactions

## 📄 License

MIT License - see LICENSE file for details.

---

**Important Notes:**
- Always test on testnet before mainnet deployment
- Keep your private keys secure and never share them
- Monitor gas fees before deploying to mainnet
- Regularly update dependencies for security patches
- Backup your environment variables and configuration files