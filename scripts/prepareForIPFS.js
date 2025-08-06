const fs = require("fs");
const path = require("path");

console.log("\n🌐 PREPARING ALVARA NFT COLLECTION FOR IPFS");
console.log("==========================================");

const imagesDir = path.join(__dirname, "..", "metadata", "images");
const jsonDir = path.join(__dirname, "..", "metadata", "json");
const outputDir = path.join(__dirname, "..", "metadata", "ipfs-ready");

// Create output directory structure
const imageOutputDir = path.join(outputDir, "images");
const metadataOutputDir = path.join(outputDir, "metadata");

[outputDir, imageOutputDir, metadataOutputDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

console.log("\n📁 Creating IPFS-ready folder structure...");

// Step 1: Copy images to IPFS-ready folder
console.log("\n📸 Preparing Images...");
console.log("=====================");

for (let i = 1; i <= 10; i++) {
  const sourcePath = path.join(imagesDir, `${i}.png`);
  const destPath = path.join(imageOutputDir, `${i}.png`);

  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destPath);
    console.log(`✅ Copied ${i}.png`);
  } else {
    console.log(`❌ Missing ${i}.png`);
  }
}

// Step 2: Create metadata template for IPFS
console.log("\n📝 Creating IPFS Metadata Template...");
console.log("====================================");

// First, create a template showing the structure needed
const templateMetadata = {
  name: "Alvara Genesis #1",
  description:
    "A magnificent crystalline formation that embodies the essence of digital artistry. This Genesis piece represents the beginning of the Alvara collection, featuring intricate geometric patterns and ethereal luminescence that capture the viewer's imagination.",
  image: "ipfs://QmYOUR_IMAGE_HASH_HERE/1.png",
  external_url: "https://alvara-nft.com/token/1",
  attributes: [
    {
      trait_type: "Collection",
      value: "Genesis",
    },
    {
      trait_type: "Rarity",
      value: "Legendary",
    },
    // ... other attributes
  ],
  background_color: "1a0b3d",
};

// Copy existing metadata files as templates
for (let i = 1; i <= 10; i++) {
  const sourcePath = path.join(jsonDir, `${i}.json`);
  const destPath = path.join(metadataOutputDir, `${i}.json`);

  if (fs.existsSync(sourcePath)) {
    const metadata = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
    // Keep original metadata but add placeholder for IPFS image URL
    metadata.image = `ipfs://QmYOUR_IMAGES_FOLDER_HASH/${i}.png`;

    fs.writeFileSync(destPath, JSON.stringify(metadata, null, 2));
    console.log(`✅ Prepared metadata ${i}.json`);
  }
}

// Step 3: Create instructions
const instructions = `# 🌐 IPFS Upload Instructions for Alvara NFT Collection

## 📋 Manual IPFS Upload Steps

### Method 1: Using Pinata (Recommended - Free)

1. **Sign up for Pinata**: https://app.pinata.cloud/
2. **Upload Images Folder**:
   - Go to "Files" section
   - Click "Upload" → "Folder"
   - Select the \`images\` folder from this directory
   - Name it "alvara-nft-images"
   - Copy the IPFS hash (starts with Qm...)

3. **Update Metadata**:
   - Replace \`QmYOUR_IMAGES_FOLDER_HASH\` in all metadata files with your actual images folder hash
   - Example: If your images hash is \`QmXYZ123...\`, update to: \`ipfs://QmXYZ123.../1.png\`

4. **Upload Metadata Folder**:
   - Upload the updated \`metadata\` folder
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
\`https://gateway.pinata.cloud/ipfs/QmYOUR_METADATA_FOLDER_HASH/\`

Or for other gateways:
\`https://ipfs.io/ipfs/QmYOUR_METADATA_FOLDER_HASH/\`

## 📝 Update Smart Contract

Once uploaded, run:
\`\`\`bash
# Update your .env with the IPFS base URI
echo "IPFS_BASE_URI=https://gateway.pinata.cloud/ipfs/QmYOUR_HASH/" >> .env

# Then deploy the URI update (we'll create this script)
node scripts/updateBaseURI.js
\`\`\`

## ✅ Verification

Test your URLs:
- Image: \`https://gateway.pinata.cloud/ipfs/QmYOUR_IMAGES_HASH/1.png\`
- Metadata: \`https://gateway.pinata.cloud/ipfs/QmYOUR_METADATA_HASH/1.json\`

Both should load correctly in your browser!
`;

fs.writeFileSync(path.join(outputDir, "IPFS_INSTRUCTIONS.md"), instructions);

// Create a simple update script template
const updateScript = `// Update smart contract base URI after IPFS upload
const { ethers } = require("hardhat");

async function updateBaseURI() {
  const baseURI = process.env.IPFS_BASE_URI;
  
  if (!baseURI) {
    console.log("❌ Please set IPFS_BASE_URI in your .env file");
    return;
  }

  console.log("🔄 Updating smart contract base URI...");
  console.log("Base URI:", baseURI);

  const [deployer] = await ethers.getSigners();
  const contractAddress = "0x9EF7Aa4bdCe97c888D9E3977a16F2d72da9A8A99"; // Your deployed contract

  const AlvaraMint = await ethers.getContractFactory("AlvaraMint");
  const contract = AlvaraMint.attach(contractAddress);

  const tx = await contract.setBaseURI(baseURI);
  await tx.wait();

  console.log("✅ Base URI updated successfully!");
  console.log("Transaction:", tx.hash);
}

updateBaseURI().catch(console.error);
`;

fs.writeFileSync(path.join(__dirname, "updateBaseURI.js"), updateScript);

console.log("\n🎉 IPFS PREPARATION COMPLETE!");
console.log("=============================");
console.log(`📁 Files ready at: ${outputDir}`);
console.log("\n📋 Next Steps:");
console.log("1. Follow instructions in IPFS_INSTRUCTIONS.md");
console.log("2. Upload images folder to IPFS");
console.log("3. Update metadata with image IPFS URLs");
console.log("4. Upload metadata folder to IPFS");
console.log("5. Update smart contract base URI");

console.log("\n🔗 Quick Start:");
console.log("1. Go to https://app.pinata.cloud/");
console.log("2. Sign up for free account");
console.log("3. Upload the images folder");
console.log("4. Upload the metadata folder");
console.log("5. Run: node scripts/updateBaseURI.js");

// Create a summary of what we have
const summary = {
  totalImages: 10,
  totalMetadata: 10,
  imagesPath: imageOutputDir,
  metadataPath: metadataOutputDir,
  status: "Ready for IPFS upload",
  nextStep: "Upload to IPFS service (Pinata recommended)",
};

fs.writeFileSync(
  path.join(outputDir, "summary.json"),
  JSON.stringify(summary, null, 2)
);

console.log("\n📊 Summary saved to summary.json");
console.log("🚀 Ready to upload to IPFS!");
