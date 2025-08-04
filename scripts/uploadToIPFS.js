const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// Pinata IPFS service configuration
const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY;
const PINATA_API_URL = "https://api.pinata.cloud";

if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
  console.log("\n⚠️  PINATA API KEYS NOT FOUND");
  console.log("============================");
  console.log(
    "Please set up your Pinata account and add these to your .env file:"
  );
  console.log("PINATA_API_KEY=your_api_key_here");
  console.log("PINATA_SECRET_KEY=your_secret_key_here");
  console.log("\n📝 Steps to get Pinata keys:");
  console.log("1. Go to https://app.pinata.cloud/");
  console.log("2. Sign up for free account");
  console.log("3. Go to API Keys section");
  console.log("4. Create new API key with pinning permissions");
  console.log("5. Add keys to .env file");
  process.exit(1);
}

async function testPinataConnection() {
  try {
    const response = await axios.get(
      `${PINATA_API_URL}/data/testAuthentication`,
      {
        headers: {
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET_KEY,
        },
      }
    );
    console.log("✅ Pinata connection successful!");
    return true;
  } catch (error) {
    console.log(
      "❌ Pinata connection failed:",
      error.response?.data || error.message
    );
    return false;
  }
}

async function uploadImageToIPFS(imagePath, imageName) {
  try {
    const formData = new FormData();
    formData.append("file", fs.createReadStream(imagePath));

    const metadata = JSON.stringify({
      name: imageName,
      keyvalues: {
        project: "Alvara-NFT",
        type: "image",
      },
    });
    formData.append("pinataMetadata", metadata);

    const options = JSON.stringify({
      cidVersion: 0,
    });
    formData.append("pinataOptions", options);

    const response = await axios.post(
      `${PINATA_API_URL}/pinning/pinFileToIPFS`,
      formData,
      {
        maxBodyLength: "Infinity",
        headers: {
          "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET_KEY,
        },
      }
    );

    return response.data.IpfsHash;
  } catch (error) {
    console.log(
      `❌ Failed to upload ${imageName}:`,
      error.response?.data || error.message
    );
    throw error;
  }
}

async function uploadJSONToIPFS(jsonData, fileName) {
  try {
    const response = await axios.post(
      `${PINATA_API_URL}/pinning/pinJSONToIPFS`,
      jsonData,
      {
        headers: {
          "Content-Type": "application/json",
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET_KEY,
        },
      }
    );

    return response.data.IpfsHash;
  } catch (error) {
    console.log(
      `❌ Failed to upload ${fileName}:`,
      error.response?.data || error.message
    );
    throw error;
  }
}

async function uploadCollection() {
  console.log("\n🚀 UPLOADING ALVARA NFT COLLECTION TO IPFS");
  console.log("===========================================");

  // Test connection first
  const connected = await testPinataConnection();
  if (!connected) return;

  const imagesDir = path.join(__dirname, "..", "metadata", "images");
  const jsonDir = path.join(__dirname, "..", "metadata", "json");
  const outputDir = path.join(__dirname, "..", "metadata", "ipfs");

  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  const imageHashes = {};
  const metadataHashes = {};

  // Step 1: Upload all images
  console.log("\n📸 Uploading Images...");
  console.log("======================");

  for (let i = 1; i <= 10; i++) {
    const imagePath = path.join(imagesDir, `${i}.png`);
    if (fs.existsSync(imagePath)) {
      try {
        console.log(`Uploading ${i}.png...`);
        const hash = await uploadImageToIPFS(imagePath, `Alvara NFT ${i}`);
        imageHashes[i] = hash;
        console.log(`✅ ${i}.png → ipfs://${hash}`);
      } catch (error) {
        console.log(`❌ Failed to upload ${i}.png`);
      }
    }
  }

  // Step 2: Update metadata with IPFS image URLs and upload
  console.log("\n📝 Updating and Uploading Metadata...");
  console.log("====================================");

  for (let i = 1; i <= 10; i++) {
    const metadataPath = path.join(jsonDir, `${i}.json`);
    if (fs.existsSync(metadataPath) && imageHashes[i]) {
      try {
        const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf8"));

        // Update image URL to IPFS
        metadata.image = `ipfs://${imageHashes[i]}`;

        console.log(`Uploading metadata ${i}.json...`);
        const hash = await uploadJSONToIPFS(
          metadata,
          `Alvara NFT ${i} Metadata`
        );
        metadataHashes[i] = hash;
        console.log(`✅ ${i}.json → ipfs://${hash}`);

        // Save updated metadata locally
        fs.writeFileSync(
          path.join(outputDir, `${i}.json`),
          JSON.stringify(metadata, null, 2)
        );
      } catch (error) {
        console.log(`❌ Failed to upload metadata ${i}.json`);
      }
    }
  }

  // Step 3: Create summary
  const summary = {
    collection: "Alvara NFT",
    timestamp: new Date().toISOString(),
    baseURI: "https://gateway.pinata.cloud/ipfs/",
    images: imageHashes,
    metadata: metadataHashes,
    urls: {
      images: Object.fromEntries(
        Object.entries(imageHashes).map(([id, hash]) => [
          id,
          `https://gateway.pinata.cloud/ipfs/${hash}`,
        ])
      ),
      metadata: Object.fromEntries(
        Object.entries(metadataHashes).map(([id, hash]) => [
          id,
          `https://gateway.pinata.cloud/ipfs/${hash}`,
        ])
      ),
    },
  };

  // Save summary
  fs.writeFileSync(
    path.join(outputDir, "ipfs-summary.json"),
    JSON.stringify(summary, null, 2)
  );

  console.log("\n🎉 UPLOAD COMPLETE!");
  console.log("===================");
  console.log(`📁 IPFS files saved to: ${outputDir}`);
  console.log("\n🔗 Your NFT Base URI:");
  console.log(`https://gateway.pinata.cloud/ipfs/`);
  console.log("\n📋 Next Steps:");
  console.log("1. Update smart contract base URI");
  console.log("2. Test minting with IPFS metadata");

  return summary;
}

// Run upload if called directly
if (require.main === module) {
  uploadCollection().catch(console.error);
}

module.exports = { uploadCollection };
