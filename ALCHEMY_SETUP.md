# Alchemy Setup Guide for Alvara NFT Project

## Why Alchemy?
Alchemy is used to fetch NFTs from user wallets by querying the blockchain. This ensures that the "Your Minted Alvaras" section shows actual NFTs owned by the user.

## Setup Instructions

### 1. Create Alchemy Account
- Go to [alchemy.com](https://alchemy.com)
- Sign up for a free account

### 2. Create a New App
- Click "Create App" in your dashboard
- Choose these settings:
  - **Chain**: Ethereum
  - **Network**: Ethereum Mainnet (for production)
  - **Name**: "Alvara NFT App" (or any name you prefer)

### 3. Get Your API Key
- After creating the app, go to your app dashboard
- Find the "API Key" section
- Copy your API key

### 4. Add to Environment Variables
Create or update your `.env.local` file in the project root:

```bash
NEXT_PUBLIC_ALCHEMY_API_KEY=your_api_key_here
```

### 5. Restart Development Server
```bash
npm run dev
```

## Testing the Integration

### 1. Check Console Logs
Open browser developer tools and look for these logs:
- `🔍 Using Alchemy to fetch Alvara NFTs for wallet: 0x...`
- `📦 Alchemy API returned X NFTs`
- `✅ Successfully processed X Alvara NFTs from Alchemy`

### 2. Verify NFT Display
- Connect your wallet
- If you have minted NFTs, they should appear in "Your Minted Alvaras" section
- If no NFTs appear, check the console for error messages

## Troubleshooting

### No NFTs Showing
1. **Check API Key**: Ensure `NEXT_PUBLIC_ALCHEMY_API_KEY` is set correctly
2. **Check Network**: Make sure you're on Ethereum Mainnet
3. **Check Contract Address**: Verify `CONTRACT_ADDRESSES.mainnet` is correct
4. **Check Console**: Look for error messages in browser console

### Fallback Mode
If Alchemy is not configured, the app will:
- Show placeholder NFTs based on contract balance
- Display setup instructions in console
- Still function for minting, just without real NFT metadata

### Common Issues
1. **Invalid API Key**: You'll see authentication errors
2. **Wrong Network**: NFTs won't be found if on different network
3. **Contract Not Deployed**: No NFTs will be found
4. **Rate Limits**: Free tier has request limits

## Contract Addresses
Current Mainnet contract address: `0x9B585917271Deccc86149952a0357e2B305EEdA4`
Check `src/contracts/addresses.ts` for all network addresses

## Support
- Alchemy Documentation: [docs.alchemy.com](https://docs.alchemy.com)
- Alchemy Discord: [discord.gg/alchemy](https://discord.gg/alchemy)