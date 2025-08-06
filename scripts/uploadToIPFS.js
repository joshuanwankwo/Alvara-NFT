const fs = require("fs");
const path = require("path");
const FormData = require("form-data");
const axios = require("axios");

// NFT data with descriptions
const nftData = [
  {
    id: 1,
    name: "Basket Beth",
    description:
      "A savvy trader who knows how to diversify her portfolio and manage risk in the volatile crypto markets.",
    image: "Basket-Beth.png",
    attributes: [
      { trait_type: "Trading Style", value: "Conservative" },
      { trait_type: "Risk Level", value: "Low" },
      { trait_type: "Strategy", value: "Diversification" },
    ],
  },
  {
    id: 2,
    name: "Degen Derrick",
    description:
      "The ultimate risk-taker who goes all-in on high-risk, high-reward opportunities in the crypto space.",
    image: "Degen-Derrick.png",
    attributes: [
      { trait_type: "Trading Style", value: "Aggressive" },
      { trait_type: "Risk Level", value: "Extreme" },
      { trait_type: "Strategy", value: "All-in" },
    ],
  },
  {
    id: 3,
    name: "Freddy FOMO",
    description:
      "Always chasing the next big thing, Freddy embodies the fear of missing out that drives market momentum.",
    image: "Freddy-fomo.png",
    attributes: [
      { trait_type: "Trading Style", value: "FOMO" },
      { trait_type: "Risk Level", value: "High" },
      { trait_type: "Strategy", value: "Momentum" },
    ],
  },
  {
    id: 4,
    name: "Gloria Gains",
    description:
      "A successful investor who has mastered the art of taking profits and building wealth through strategic trading.",
    image: "Gloria-Gains.png",
    attributes: [
      { trait_type: "Trading Style", value: "Profitable" },
      { trait_type: "Risk Level", value: "Medium" },
      { trait_type: "Strategy", value: "Profit Taking" },
    ],
  },
  {
    id: 5,
    name: "Henry Hodl",
    description:
      "The patient long-term holder who believes in the fundamentals and diamond hands through market cycles.",
    image: "Henry-Hodl.png",
    attributes: [
      { trait_type: "Trading Style", value: "Long-term" },
      { trait_type: "Risk Level", value: "Low" },
      { trait_type: "Strategy", value: "HODL" },
    ],
  },
  {
    id: 6,
    name: "Kate Candle",
    description:
      "A technical analysis expert who reads charts like a book and makes decisions based on market patterns.",
    image: "Kate-Candle.png",
    attributes: [
      { trait_type: "Trading Style", value: "Technical" },
      { trait_type: "Risk Level", value: "Medium" },
      { trait_type: "Strategy", value: "Chart Analysis" },
    ],
  },
  {
    id: 7,
    name: "Leroy Leverage",
    description:
      "The aggressive trader who uses leverage to amplify gains, but also risks amplified losses.",
    image: "Leroy-leverage.png",
    attributes: [
      { trait_type: "Trading Style", value: "Leverage" },
      { trait_type: "Risk Level", value: "Extreme" },
      { trait_type: "Strategy", value: "Amplified" },
    ],
  },
  {
    id: 8,
    name: "Max Effort",
    description:
      "A dedicated crypto enthusiast who puts maximum effort into research, analysis, and community building.",
    image: "Max-Effort.png",
    attributes: [
      { trait_type: "Trading Style", value: "Research" },
      { trait_type: "Risk Level", value: "Medium" },
      { trait_type: "Strategy", value: "Fundamental" },
    ],
  },
  {
    id: 9,
    name: "Sally Swaps",
    description:
      "A DeFi expert who navigates the world of decentralized exchanges and yield farming with ease.",
    image: "Sally-Swaps.png",
    attributes: [
      { trait_type: "Trading Style", value: "DeFi" },
      { trait_type: "Risk Level", value: "High" },
      { trait_type: "Strategy", value: "Yield Farming" },
    ],
  },
  {
    id: 10,
    name: "William Banker",
    description:
      "The traditional finance professional who brings institutional knowledge to the crypto revolution.",
    image: "William-Banker.png",
    attributes: [
      { trait_type: "Trading Style", value: "Institutional" },
      { trait_type: "Risk Level", value: "Low" },
      { trait_type: "Strategy", value: "Traditional" },
    ],
  },
];

// Function to upload to IPFS using web3.storage or similar service
async function uploadToIPFS() {
  try {
    console.log("🚀 Starting IPFS upload process...");

    const results = [];
    const imagesDir = path.join(__dirname, "../metadata/images");

    // For now, let's create the metadata files locally and simulate IPFS hashes
    // In production, you would upload to IPFS and get real hashes
    console.log("📤 Creating metadata files...");

    for (const nft of nftData) {
      const imagePath = path.join(imagesDir, nft.image);

      if (!fs.existsSync(imagePath)) {
        console.error(`❌ Image not found: ${imagePath}`);
        continue;
      }

      // Create metadata
      const metadata = {
        name: nft.name,
        description: nft.description,
        image: `ipfs://QmExample${nft.id}`, // Placeholder IPFS hash
        attributes: nft.attributes,
        external_url: "https://alvara-nft.com",
        background_color: "000000",
      };

      // Save metadata locally
      const metadataDir = path.join(__dirname, "../metadata/json");
      if (!fs.existsSync(metadataDir)) {
        fs.mkdirSync(metadataDir, { recursive: true });
      }

      const metadataPath = path.join(metadataDir, `${nft.id}.json`);
      fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

      console.log(`✅ Created metadata for ${nft.name}: ${metadataPath}`);

      // Simulate IPFS results (replace with real upload in production)
      results.push({
        id: nft.id,
        name: nft.name,
        imageHash: `QmExampleImage${nft.id}`,
        metadataHash: `QmExampleMetadata${nft.id}`,
        imageUrl: `https://ipfs.io/ipfs/QmExampleImage${nft.id}`,
        metadataUrl: `https://ipfs.io/ipfs/QmExampleMetadata${nft.id}`,
        localMetadataPath: metadataPath,
      });
    }

    // Save results to file
    const outputPath = path.join(__dirname, "../metadata/ipfs-results.json");
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

    console.log("\n🎉 Metadata Creation Complete!");
    console.log(`📄 Results saved to: ${outputPath}`);

    // Display summary
    console.log("\n📋 Summary:");
    results.forEach((result) => {
      console.log(`${result.id}. ${result.name}`);
      console.log(`   Local Metadata: ${result.localMetadataPath}`);
      console.log(`   Simulated IPFS Image: ${result.imageUrl}`);
      console.log(`   Simulated IPFS Metadata: ${result.metadataUrl}`);
      console.log("");
    });

    console.log("\n⚠️  Note: This script created local metadata files.");
    console.log("   To upload to real IPFS, you can:");
    console.log("   1. Use Pinata (https://pinata.cloud)");
    console.log("   2. Use web3.storage (https://web3.storage)");
    console.log("   3. Use NFT.Storage (https://nft.storage)");
    console.log("   4. Use Infura IPFS");

    return results;
  } catch (error) {
    console.error("❌ Error creating metadata:", error);
    throw error;
  }
}

// Run the upload
if (require.main === module) {
  uploadToIPFS()
    .then(() => {
      console.log("✅ Script completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Script failed:", error);
      process.exit(1);
    });
}

module.exports = { uploadToIPFS };
