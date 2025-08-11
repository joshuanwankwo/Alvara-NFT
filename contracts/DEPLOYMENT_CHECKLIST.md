# 🚀 Mainnet Deployment Checklist

## 📋 Pre-Deployment Checklist

### ✅ Contract Verification
- [x] All contracts compiled successfully
- [x] Local testing completed and passed
- [x] Contract addresses verified:
  - ALVA Token: `0x8e729198d1c59b82bd6bba579310c40d740a11c2`
  - veALVA Token: `0x07157d55112a6badd62099b8ad0bbdfbc81075bd`
  - Uniswap V4 Router: `0x66a9893cc07d91d95644aedd05d03f95e1dba8af`

### 🔐 Environment Setup
- [ ] Set `PRIVATE_KEY` in `.env` file (your deployment wallet private key)
- [ ] Set `MAINNET_URL` in `.env` file (Infura/Alchemy mainnet RPC URL)
- [ ] Set `ETHERSCAN_API_KEY` in `.env` file (for contract verification)

### 💰 Wallet Preparation
- [ ] Ensure deployment wallet has sufficient ETH for gas fees
- [ ] Recommended: At least 0.1 ETH for deployment and verification
- [ ] Verify wallet has access to the private key

## 🚀 Deployment Steps

### 1. Environment Setup
```bash
# Create .env file in contracts directory
echo "PRIVATE_KEY=your_private_key_here" > .env
echo "MAINNET_URL=https://mainnet.infura.io/v3/YOUR_INFURA_KEY" >> .env
echo "ETHERSCAN_API_KEY=your_etherscan_api_key" >> .env
```

### 2. Deploy Contract
```bash
cd contracts
npx hardhat run scripts/deployMainnet.js --network mainnet
```

### 3. Verify Contract
```bash
# Replace CONTRACT_ADDRESS with the deployed address
npx hardhat verify --network mainnet CONTRACT_ADDRESS "0x8e729198d1c59b82bd6bba579310c40d740a11c2" "0x07157d55112a6badd62099b8ad0bbdfbc81075bd" "0x66a9893cc07d91d95644aedd05d03f95e1dba8af"
```

### 4. Update Frontend
After deployment, update `src/contracts/addresses.ts`:
```typescript
export const CONTRACT_ADDRESSES = {
  // ... other networks
  mainnet: "DEPLOYED_CONTRACT_ADDRESS", // Update this
} as const;
```

## ⚠️ Important Notes

### Pricing
- **Standard Price**: 0.0001 ETH
- **Discount Price**: 0.00005 ETH (for veALVA holders)

### Security
- This is a LIVE mainnet deployment
- Double-check all addresses before deployment
- Test thoroughly on testnet first
- Keep private keys secure

### Gas Optimization
- Current gas price set to 20 gwei
- Adjust in `hardhat.config.js` if needed
- Monitor gas prices before deployment

## 🔍 Post-Deployment Verification

### 1. Contract Verification
- Verify contract on Etherscan
- Check all constructor parameters
- Verify source code matches

### 2. Functionality Testing
- Test minting with standard price
- Test minting with discount (veALVA holder)
- Verify ALVA token distribution
- Check token URIs

### 3. Frontend Integration
- Update contract addresses
- Test all minting flows
- Verify wallet connections
- Test error handling

## 📞 Support

If you encounter any issues:
1. Check gas prices and wallet balance
2. Verify all environment variables
3. Ensure network connectivity
4. Review contract logs for errors

## 🎯 Success Criteria

- [ ] Contract deployed successfully
- [ ] Contract verified on Etherscan
- [ ] All functions working correctly
- [ ] Frontend updated and tested
- [ ] Users can mint NFTs
- [ ] ALVA tokens distributed correctly
- [ ] Discount pricing working for veALVA holders 