#!/bin/bash

# Alvara NFT Platform - Setup Script
# This script automates the initial setup process

echo "🚀 Alvara NFT Platform - Setup Script"
echo "======================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18 or higher first."
    echo "Download from: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm version: $(npm -v)"

# Check if Git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    echo "Download from: https://git-scm.com/"
    exit 1
fi

echo "✅ Git version: $(git --version)"

echo ""
echo "📦 Installing frontend dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

echo "✅ Frontend dependencies installed"

echo ""
echo "📦 Installing smart contract dependencies..."
cd contracts
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install smart contract dependencies"
    exit 1
fi

echo "✅ Smart contract dependencies installed"

# Go back to root
cd ..

echo ""
echo "🔧 Creating environment files..."

# Create .env.local for frontend
if [ ! -f .env.local ]; then
    cat > .env.local << EOF
# Alchemy API Key (for NFT metadata and blockchain data)
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key_here

# Contract Addresses (update these after deployment)
NEXT_PUBLIC_CONTRACT_ADDRESS=your_deployed_contract_address_here
NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS=your_staking_contract_address_here
NEXT_PUBLIC_ALVA_TOKEN_ADDRESS=your_alva_token_address_here

# Optional: Pinata API Keys (for IPFS uploads)
PINATA_API_KEY=your_pinata_api_key_here
PINATA_SECRET_API_KEY=your_pinata_secret_key_here
EOF
    echo "✅ Created .env.local file"
else
    echo "⚠️  .env.local already exists"
fi

# Create .env for smart contracts
if [ ! -f contracts/.env ]; then
    cat > contracts/.env << EOF
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
EOF
    echo "✅ Created contracts/.env file"
else
    echo "⚠️  contracts/.env already exists"
fi

echo ""
echo "🧪 Testing smart contract compilation..."
cd contracts
npm run compile

if [ $? -ne 0 ]; then
    echo "❌ Smart contract compilation failed"
    exit 1
fi

echo "✅ Smart contracts compiled successfully"

# Go back to root
cd ..

echo ""
echo "🏗️  Testing frontend build..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed"
    exit 1
fi

echo "✅ Frontend build successful"

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Update the environment variables in .env.local and contracts/.env"
echo "2. Get your API keys from:"
echo "   - Alchemy: https://www.alchemy.com/"
echo "   - Etherscan: https://etherscan.io/"
echo "   - Infura: https://infura.io/"
echo "3. Deploy smart contracts: cd contracts && npm run deploy:sepolia"
echo "4. Update contract addresses in src/contracts/addresses.ts"
echo "5. Start development: npm run dev"
echo ""
echo "📖 For detailed instructions, see the README.md file"
echo ""
echo "🔗 Useful links:"
echo "- Sepolia Faucet: https://sepoliafaucet.com/"
echo "- Alchemy Dashboard: https://dashboard.alchemy.com/"
echo "- Etherscan: https://etherscan.io/"
echo "- Vercel: https://vercel.com/" 