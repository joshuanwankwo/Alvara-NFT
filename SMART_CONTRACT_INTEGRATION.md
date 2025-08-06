# Smart Contract Integration Guide

This document explains how the smart contract functionality has been integrated into the Alvara NFT platform.

## 🏗️ Architecture Overview

The platform now includes:

### Smart Contracts
- **AlvaraMint.sol**: Main NFT minting contract with standard metadata
- **AlvaraMintIPFS.sol**: NFT minting contract with IPFS metadata support
- **MockERC20.sol**: Mock ALVA token for testing

### Frontend Integration
- **Hooks**: React hooks for contract interaction
- **Services**: API services for metadata and balance checking
- **Components**: Updated UI components with smart contract functionality

## 🔧 Smart Contract Features

### AlvaraMint Contract
- **ERC721 Standard**: Compliant NFT contract
- **Dynamic Pricing**: 0.01 ETH standard, 0.005 ETH with discount
- **veALVA Integration**: 50% discount for holders of 1.5+ veALVA tokens
- **Unlimited Minting**: No per-wallet limits
- **Design Selection**: 10 different NFT designs (1-10)
- **Metadata Support**: On-chain metadata URI management

### Key Functions
```solidity
function mint(uint256 designId) external payable
function tokenURI(uint256 tokenId) public view returns (string memory)
function setBaseURI(string calldata newBaseURI) external onlyOwner
```

## 🎯 Frontend Integration

### Hooks
- **useAlvaraMint**: Main minting functionality
- **useNFTDesigns**: NFT metadata fetching from IPFS
- **useWalletNFTs**: User's owned NFTs display
- **useVeAlvaBalance**: veALVA token balance checking

### Services
- **nftMetadata.ts**: IPFS metadata fetching
- **alchemyNFT.ts**: Alchemy API integration for NFT display
- **alvaTokenBalance.ts**: veALVA balance checking on mainnet

## 🚀 Getting Started

### 1. Environment Setup
```bash
# Install dependencies
npm install

# Add environment variables
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_key
```

### 2. Contract Deployment
```bash
# Deploy to testnet
npx hardhat run scripts/deploy.js --network sepolia

# Update contract addresses in src/contracts/addresses.ts
```

### 3. Contract Verification
```bash
# Verify on Etherscan
npx hardhat verify --network sepolia CONTRACT_ADDRESS "ALVA_TOKEN_ADDRESS"
```

## 💰 Pricing Structure

### Standard Pricing
- **Standard Price**: 0.01 ETH per NFT
- **Discount Price**: 0.005 ETH per NFT (50% off)

### Discount Eligibility
- Hold 1.5+ veALVA tokens on Ethereum mainnet
- Automatic discount application during minting
- Real-time balance checking

## 🎨 NFT Designs

### Available Designs
- 10 unique NFT designs (IDs 1-10)
- IPFS-hosted metadata and images
- Automatic metadata fetching
- Fallback images for loading states

### Metadata Structure
```json
{
  "name": "Alvara #1",
  "description": "A unique Alvara NFT",
  "image": "ipfs://Qm...",
  "attributes": [
    {"trait_type": "Design ID", "value": 1},
    {"trait_type": "Rarity", "value": "Common"}
  ]
}
```

## 🔗 Integration Points

### Wallet Connection
- RainbowKit integration
- Multi-chain support (Sepolia, Goerli, Mainnet)
- Automatic network detection

### Transaction Handling
- Real-time transaction status
- Success/error notifications
- Etherscan transaction links
- Automatic NFT refresh after minting

### NFT Display
- Alchemy API integration
- IPFS metadata fetching
- Fallback handling for missing data
- Social sharing functionality

## 🛠️ Development Commands

```bash
# Build the project
npm run build

# Start development server
npm run dev

# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy contracts
npx hardhat run scripts/deploy.js --network sepolia
```

## 🔍 Testing

### Contract Testing
- Unit tests for all contract functions
- Integration tests for minting flow
- Gas optimization testing

### Frontend Testing
- Hook testing with mock contracts
- UI component testing
- Error handling validation

## 📊 Monitoring

### Contract Events
- Mint events tracking
- Price change notifications
- Balance updates

### User Analytics
- Minting success rates
- Popular design selections
- Gas usage optimization

## 🔒 Security Considerations

### Contract Security
- OpenZeppelin contracts for security
- Access control implementation
- Reentrancy protection
- Input validation

### Frontend Security
- Wallet connection validation
- Transaction confirmation flows
- Error handling and user feedback

## 🚀 Deployment Checklist

- [ ] Deploy smart contracts to target network
- [ ] Verify contracts on Etherscan
- [ ] Update contract addresses in frontend
- [ ] Test minting functionality
- [ ] Verify discount mechanism
- [ ] Test NFT display and metadata
- [ ] Validate error handling
- [ ] Performance testing
- [ ] Security audit completion

## 📞 Support

For technical support or questions about the smart contract integration:

1. Check the contract documentation
2. Review the test files
3. Consult the deployment scripts
4. Contact the development team

---

**Note**: This integration maintains the existing UI design while adding full smart contract functionality. The user experience remains smooth and intuitive while providing real blockchain functionality. 