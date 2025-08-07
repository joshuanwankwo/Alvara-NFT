require("dotenv").config();
const fs = require("fs");
const path = require("path");
const FormData = require("form-data");
const axios = require("axios");

// Pinata configuration
const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_KEY;

if (!PINATA_API_KEY || !PINATA_SECRET_API_KEY) {
  console.error("❌ Pinata API keys not found in environment variables");
  console.error("Please set PINATA_API_KEY and PINATA_SECRET_KEY");
  process.exit(1);
}

const NFT_IMAGES_DIR = path.join(__dirname, "../public/images/nfts");
const NAMED_NFTS = [
  "Basket-Beth.png",
  "Degen-Derrick.png",
  "Freddy-fomo.png",
  "Gloria-Gains.png",
  "Henry-Hodl.png",
  "Kate-Candle.png",
  "Leroy-leverage.png",
  "Max-Effort.png",
  "Sally-Swaps.png",
  "William-Banker.png",
];

async function uploadToPinata(filePath, fileName) {
  try {
    const formData = new FormData();
    formData.append("file", fs.createReadStream(filePath));
    formData.append(
      "pinataMetadata",
      JSON.stringify({
        name: fileName,
        keyvalues: {
          folder: "alvara-images",
          type: "nft_image",
          collection: "Alvara_Investment_Wankers",
        },
      })
    );
    formData.append(
      "pinataOptions",
      JSON.stringify({
        cidVersion: 1,
      })
    );

    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        headers: {
          Authorization: `Bearer ${PINATA_API_KEY}`,
          ...formData.getHeaders(),
        },
      }
    );

    return {
      name: fileName,
      ipfsHash: response.data.IpfsHash,
      ipfsUrl: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`,
    };
  } catch (error) {
    console.error(`❌ Error uploading ${fileName}:`, error.message);
    return null;
  }
}

async function uploadAllNFTImages() {
  console.log("🚀 Starting upload of NFT images to Pinata...");
  console.log("📁 Group: alvara-images");
  console.log("");

  const results = [];

  for (const fileName of NAMED_NFTS) {
    const filePath = path.join(NFT_IMAGES_DIR, fileName);

    if (!fs.existsSync(filePath)) {
      console.error(`❌ File not found: ${fileName}`);
      continue;
    }

    console.log(`📤 Uploading ${fileName}...`);
    const result = await uploadToPinata(filePath, fileName);

    if (result) {
      results.push(result);
      console.log(`✅ ${fileName} uploaded successfully!`);
      console.log(`   IPFS Hash: ${result.ipfsHash}`);
      console.log(`   IPFS URL: ${result.ipfsUrl}`);
    }

    console.log("");
  }

  // Save results to file
  const resultsPath = path.join(
    __dirname,
    "../metadata/pinata-nft-images-results.json"
  );
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));

  console.log("📊 Upload Summary:");
  console.log(
    `✅ Successfully uploaded: ${results.length}/${NAMED_NFTS.length} images`
  );
  console.log(`📄 Results saved to: ${resultsPath}`);

  if (results.length > 0) {
    console.log("\n🔗 IPFS URLs:");
    results.forEach((result) => {
      console.log(`${result.name}: ${result.ipfsUrl}`);
    });
  }

  return results;
}

// Run the upload
uploadAllNFTImages()
  .then(() => {
    console.log("\n🎉 Upload completed!");
  })
  .catch((error) => {
    console.error("❌ Upload failed:", error);
    process.exit(1);
  });
