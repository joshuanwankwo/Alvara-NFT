const fs = require("fs");
const path = require("path");

const BASE_IPFS_URL =
  "https://yellow-imperial-wasp-317.mypinata.cloud/ipfs/bafybeicngfnavc7ghsbxfmulzd66uyqooh3q2m2s42c6dreodocwb7247m";

const NAMED_NFTS = [
  "Basket-Beth",
  "Degen-Derrick",
  "Freddy-fomo",
  "Gloria-Gains",
  "Henry-Hodl",
  "Kate-Candle",
  "Leroy-leverage",
  "Max-Effort",
  "Sally-Swaps",
  "William-Banker",
];

function updateNFTImageUrls() {
  console.log("🚀 Updating NFT image URLs to IPFS...");
  console.log(`📁 Base URL: ${BASE_IPFS_URL}`);
  console.log("");

  const nftsJsonDir = path.join(__dirname, "../nfts-json");
  let updatedCount = 0;

  NAMED_NFTS.forEach((nftName) => {
    const jsonFileName = `${nftName}.json`;
    const jsonFilePath = path.join(nftsJsonDir, jsonFileName);

    if (!fs.existsSync(jsonFilePath)) {
      console.error(`❌ File not found: ${jsonFileName}`);
      return;
    }

    try {
      // Read the JSON file
      const jsonContent = fs.readFileSync(jsonFilePath, "utf8");
      const nftData = JSON.parse(jsonContent);

      // Update the image URL
      const oldImageUrl = nftData.image;
      const newImageUrl = `${BASE_IPFS_URL}/${nftName}.png`;

      nftData.image = newImageUrl;

      // Update the properties.files[0].uri as well
      if (
        nftData.properties &&
        nftData.properties.files &&
        nftData.properties.files[0]
      ) {
        nftData.properties.files[0].uri = newImageUrl;
      }

      // Write the updated JSON back to file
      fs.writeFileSync(jsonFilePath, JSON.stringify(nftData, null, 2));

      console.log(`✅ Updated ${jsonFileName}`);
      console.log(`   Old: ${oldImageUrl}`);
      console.log(`   New: ${newImageUrl}`);
      console.log("");

      updatedCount++;
    } catch (error) {
      console.error(`❌ Error updating ${jsonFileName}:`, error.message);
    }
  });

  console.log(`📊 Update Summary:`);
  console.log(
    `✅ Successfully updated: ${updatedCount}/${NAMED_NFTS.length} NFT files`
  );
  console.log(`📁 Files updated in: ${nftsJsonDir}`);

  // Show example of updated URLs
  console.log("\n🔗 Example IPFS URLs:");
  NAMED_NFTS.slice(0, 3).forEach((nftName) => {
    console.log(`${nftName}: ${BASE_IPFS_URL}/${nftName}.png`);
  });
  if (NAMED_NFTS.length > 3) {
    console.log(`... and ${NAMED_NFTS.length - 3} more`);
  }
}

updateNFTImageUrls();
