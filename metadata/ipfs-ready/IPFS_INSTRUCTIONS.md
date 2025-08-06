# 🌐 IPFS Upload Instructions for Alvara NFT Collection

## 📋 Manual IPFS Upload Steps

### Method 1: Using Pinata (Recommended - Free)

1. **Sign up for Pinata**: https://app.pinata.cloud/
2. **Upload Images Folder**:
   - Go to "Files" section
   - Click "Upload" → "Folder"
   - Select the `images` folder from this directory
   - Name it "alvara-nft-images"
   - Copy the IPFS hash (starts with Qm...)

3. **Update Metadata**:
   - Replace `QmYOUR_IMAGES_FOLDER_HASH` in all metadata files with your actual images folder hash
   - Example: If your images hash is `QmXYZ123...`, update to: `ipfs://QmXYZ123.../1.png`

4. **Upload Metadata Folder**:
   - Upload the updated `metadata` folder
   - Name it "alvara-nft-metadata" 
   - Copy this IPFS hash - this will be your base URI!

### Method 2: Using IPFS Desktop (Free)

1. **Install IPFS Desktop**: https://docs.ipfs.tech/install/ipfs-desktop/
2. **Add Images Folder** to IPFS
3. **Copy the hash** and update metadata files
4. **Add Metadata Folder** to IPFS
5. **Use the metadata folder hash** as your base URI

### Method 3: Using NFT.Storage (Free)

1. **Sign up**: https://nft.storage/
2. **Upload images folder** first
3. **Update metadata** with image IPFS URLs
4. **Upload metadata folder**
5. **Use metadata folder hash** as base URI

## 🔗 Final Base URI Format

Your smart contract base URI should be:
`https://gateway.pinata.cloud/ipfs/QmYOUR_METADATA_FOLDER_HASH/`

Or for other gateways:
`https://ipfs.io/ipfs/QmYOUR_METADATA_FOLDER_HASH/`

## 📝 Update Smart Contract

Once uploaded, run:
```bash
# Update your .env with the IPFS base URI
echo "IPFS_BASE_URI=https://gateway.pinata.cloud/ipfs/QmYOUR_HASH/" >> .env

# Then deploy the URI update (we'll create this script)
node scripts/updateBaseURI.js
```

## ✅ Verification

Test your URLs:
- Image: `https://gateway.pinata.cloud/ipfs/QmYOUR_IMAGES_HASH/1.png`
- Metadata: `https://gateway.pinata.cloud/ipfs/QmYOUR_METADATA_HASH/1.json`

Both should load correctly in your browser!
