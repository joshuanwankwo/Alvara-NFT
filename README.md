# Alvara NFT Platform

A modern NFT minting platform with smart contract integration, built with Next.js, Wagmi, and RainbowKit.

## 🚀 Quick Start

### Frontend Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Smart Contract Development
```bash
# Navigate to contracts directory
cd contracts

# Install contract dependencies
npm install

# Compile contracts
npm run compile

# Deploy to Sepolia testnet
npm run deploy:sepolia
```

## 📁 Project Structure

```
Alvara-NFT/
├── src/                    # Frontend source code
│   ├── app/               # Next.js App Router
│   ├── components/        # React components
│   ├── hooks/            # Custom React hooks
│   ├── contracts/        # Contract ABIs and addresses
│   └── services/         # API services
├── contracts/            # Smart contract development
│   ├── contracts/        # Solidity contracts
│   ├── scripts/          # Deployment scripts
│   ├── test/             # Contract tests
│   ├── hardhat.config.js # Hardhat configuration
│   └── package.json      # Contract dependencies
├── public/               # Static assets
└── package.json          # Frontend dependencies
```

## 🔧 Key Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Smart Contract Integration**: Real-time blockchain interaction
- **Wallet Connection**: RainbowKit integration for multi-wallet support
- **NFT Minting**: Complete minting flow with transaction tracking
- **Collection Display**: Show owned and recently minted NFTs
- **Social Sharing**: Share NFTs on Twitter/X
- **Error Handling**: Comprehensive error management and user feedback

## 🌐 Deployment

### Vercel (Frontend)
The frontend is optimized for Vercel deployment. The smart contract dependencies have been separated to avoid deployment conflicts.

### Environment Variables
Create a `.env.local` file:
```env
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key
```

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Web3**: Wagmi, RainbowKit, Viem, Ethers.js v6
- **Smart Contracts**: Solidity, Hardhat, OpenZeppelin
- **APIs**: Alchemy SDK, Axios

## 📱 Responsive Design

The platform is fully responsive with breakpoints:
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px  
- **Desktop**: 1024px+

## 🎨 Design System

- **Colors**: Purple/pink gradient theme
- **Typography**: Titillium Web, PP Supply Sans
- **Components**: Consistent design language throughout

## 🔒 Security

- Smart contract integration with proper error handling
- Wallet connection security via RainbowKit
- Environment variable protection
- Input validation and sanitization

## 📄 License

MIT License - see LICENSE file for details.