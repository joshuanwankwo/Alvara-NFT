const fs = require("fs");
const path = require("path");

// Helper script to update metadata with IPFS image hashes
function updateMetadataWithIPFS(imagesIPFSHash) {
  if (!imagesIPFSHash) {
    console.log("\n❌ Please provide the IPFS hash for your images folder");
    console.log(
      "Usage: node scripts/updateMetadataWithIPFS.js QmYourImagesHashHere"
    );
    return;
  }

  console.log("\n🔄 UPDATING METADATA WITH IPFS IMAGE URLS");
  console.log("=========================================");
  console.log(`Images IPFS Hash: ${imagesIPFSHash}`);

  const metadataDir = path.join(
    __dirname,
    "..",
    "metadata",
    "ipfs-ready",
    "metadata"
  );

  for (let i = 1; i <= 10; i++) {
    const metadataPath = path.join(metadataDir, `${i}.json`);

    if (fs.existsSync(metadataPath)) {
      try {
        const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf8"));

        // Update image URL with actual IPFS hash
        metadata.image = `ipfs://${imagesIPFSHash}/${i}.png`;

        // Write updated metadata
        fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

        console.log(
          `✅ Updated ${i}.json with image: ipfs://${imagesIPFSHash}/${i}.png`
        );
      } catch (error) {
        console.log(`❌ Failed to update ${i}.json:`, error.message);
      }
    }
  }

  console.log("\n🎉 METADATA UPDATE COMPLETE!");
  console.log("=============================");
  console.log("📋 Next Steps:");
  console.log("1. Upload the updated metadata folder to IPFS");
  console.log("2. Copy the metadata folder IPFS hash");
  console.log("3. Run: node scripts/updateBaseURI.js");
}

// Run if called directly
if (require.main === module) {
  const imagesHash = process.argv[2];
  updateMetadataWithIPFS(imagesHash);
}

module.exports = { updateMetadataWithIPFS };
