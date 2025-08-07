const fs = require("fs");
const path = require("path");

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

function cleanupNFTMetadata() {
  console.log("🧹 Cleaning up NFT metadata files...");
  console.log("🗑️  Removing: external_url, creators");
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

      // Remove external_url
      if (nftData.external_url !== undefined) {
        delete nftData.external_url;
        console.log(`✅ Removed external_url from ${jsonFileName}`);
      }

      // Remove creators from properties
      if (nftData.properties && nftData.properties.creators !== undefined) {
        delete nftData.properties.creators;
        console.log(`✅ Removed creators from ${jsonFileName}`);
      }

      // Write the updated JSON back to file
      fs.writeFileSync(jsonFilePath, JSON.stringify(nftData, null, 2));

      updatedCount++;
    } catch (error) {
      console.error(`❌ Error updating ${jsonFileName}:`, error.message);
    }
  });

  console.log(`\n📊 Cleanup Summary:`);
  console.log(
    `✅ Successfully cleaned: ${updatedCount}/${NAMED_NFTS.length} NFT files`
  );
  console.log(`📁 Files updated in: ${nftsJsonDir}`);
}

cleanupNFTMetadata();
