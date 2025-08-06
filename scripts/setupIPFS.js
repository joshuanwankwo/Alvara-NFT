const fs = require("fs");
const path = require("path");

function checkSetup() {
  console.log("\n🌐 ALVARA NFT IPFS SETUP CHECKER");
  console.log("================================");

  const envPath = path.join(__dirname, "..", ".env");
  const envExists = fs.existsSync(envPath);

  console.log(`📁 .env file: ${envExists ? "✅ Found" : "❌ Missing"}`);

  if (!envExists) {
    console.log("\n⚠️  SETUP REQUIRED");
    console.log("==================");
    console.log("Create a .env file in your project root with:");
    console.log("");
    console.log("PINATA_API_KEY=your_api_key_here");
    console.log("PINATA_SECRET_KEY=your_secret_key_here");
    console.log("");
    console.log("📝 How to get Pinata credentials:");
    console.log("1. Go to https://app.pinata.cloud/");
    console.log("2. Sign up (free account)");
    console.log('3. Navigate to "API Keys"');
    console.log('4. Click "New Key"');
    console.log("5. Enable pinning permissions");
    console.log("6. Copy API Key and Secret");
    console.log("7. Add them to .env file");
    return false;
  }

  // Check for Pinata credentials
  require("dotenv").config();
  const hasApiKey = !!process.env.PINATA_API_KEY;
  const hasSecret = !!process.env.PINATA_SECRET_KEY;

  console.log(`🔑 Pinata API Key: ${hasApiKey ? "✅ Set" : "❌ Missing"}`);
  console.log(`🔑 Pinata Secret: ${hasSecret ? "✅ Set" : "❌ Missing"}`);

  if (!hasApiKey || !hasSecret) {
    console.log("\n⚠️  CREDENTIALS MISSING");
    console.log("======================");
    console.log("Add these lines to your .env file:");
    console.log("PINATA_API_KEY=your_actual_api_key");
    console.log("PINATA_SECRET_KEY=your_actual_secret_key");
    return false;
  }

  // Check metadata files
  const jsonDir = path.join(__dirname, "..", "metadata", "json");
  const metadataFiles = [];
  for (let i = 1; i <= 10; i++) {
    const exists = fs.existsSync(path.join(jsonDir, `${i}.json`));
    metadataFiles.push(exists);
  }

  const metadataCount = metadataFiles.filter(Boolean).length;
  console.log(`📝 Metadata files: ${metadataCount}/10 found`);

  // Check image files
  const imagesDir = path.join(__dirname, "..", "metadata", "images");
  const imageFiles = [];
  for (let i = 1; i <= 10; i++) {
    const exists = fs.existsSync(path.join(imagesDir, `${i}.png`));
    imageFiles.push(exists);
  }

  const imageCount = imageFiles.filter(Boolean).length;
  console.log(`🖼️  Image files: ${imageCount}/10 found`);

  if (metadataCount === 10 && imageCount === 10 && hasApiKey && hasSecret) {
    console.log("\n🎉 SETUP COMPLETE!");
    console.log("==================");
    console.log("Ready to upload to IPFS!");
    console.log("");
    console.log("Run: node scripts/ipfsUpload.js");
    return true;
  } else {
    console.log("\n❌ SETUP INCOMPLETE");
    console.log("===================");
    console.log("Please complete the missing items above.");
    return false;
  }
}

function showIPFSWorkflow() {
  console.log("\n🔄 IPFS UPLOAD WORKFLOW");
  console.log("=======================");
  console.log("1. node scripts/setupIPFS.js     # Check setup (you are here)");
  console.log("2. node scripts/ipfsUpload.js    # Upload metadata to IPFS");
  console.log("3. Update smart contract base URI");
  console.log("4. Test NFT minting");
  console.log("");
  console.log("📖 See IPFS_SETUP.md for detailed instructions");
}

// Run setup check
if (require.main === module) {
  const ready = checkSetup();
  if (!ready) {
    showIPFSWorkflow();
  }
}

module.exports = { checkSetup };
