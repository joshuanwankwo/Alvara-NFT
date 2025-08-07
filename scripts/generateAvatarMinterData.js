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

function generateAvatarMinterData() {
  console.log("🚀 Generating AvatarMinter data from JSON files...");
  console.log("");

  const nftsJsonDir = path.join(__dirname, "../nfts-json");
  const avatarMinterData = [];

  NAMED_NFTS.forEach((nftName, index) => {
    const jsonFileName = `${nftName}.json`;
    const jsonFilePath = path.join(nftsJsonDir, jsonFileName);
    const tokenId = index + 1;

    if (!fs.existsSync(jsonFilePath)) {
      console.error(`❌ File not found: ${jsonFileName}`);
      return;
    }

    try {
      // Read the JSON file
      const jsonContent = fs.readFileSync(jsonFilePath, "utf8");
      const nftData = JSON.parse(jsonContent);

      // Create the AvatarMinter data object
      const avatarMinterItem = {
        id: tokenId.toString().padStart(3, "0"), // 001, 002, etc.
        number: tokenId,
        ...nftData, // Spread all the JSON data
      };

      avatarMinterData.push(avatarMinterItem);
      console.log(
        `✅ Generated data for ${nftName} (ID: ${avatarMinterItem.id})`
      );
    } catch (error) {
      console.error(`❌ Error processing ${jsonFileName}:`, error.message);
    }
  });

  // Generate the TypeScript array
  const arrayCode = `const alvaraNFTs: AlvaraNFT[] = ${JSON.stringify(
    avatarMinterData,
    null,
    2
  )};`;

  // Save to a file
  const outputPath = path.join(
    __dirname,
    "../src/components/features/avatarMinterData.ts"
  );
  fs.writeFileSync(outputPath, arrayCode);

  console.log(`\n📊 Generation Summary:`);
  console.log(
    `✅ Successfully generated data for ${avatarMinterData.length}/${NAMED_NFTS.length} NFTs`
  );
  console.log(`📁 Data saved to: ${outputPath}`);

  // Show example of generated data
  console.log("\n📝 Example generated data:");
  console.log(JSON.stringify(avatarMinterData[0], null, 2));
}

generateAvatarMinterData();
