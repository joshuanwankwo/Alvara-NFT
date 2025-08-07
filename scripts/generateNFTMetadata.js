const fs = require("fs");
const path = require("path");

const NAMED_NFTS = [
  {
    name: "Basket-Beth",
    description:
      "The basket manager who never misses a beat. Always diversified, always winning.",
    attributes: [
      { trait_type: "Character", value: "Basket Manager" },
      { trait_type: "Strategy", value: "Diversified" },
      { trait_type: "Risk Level", value: "Low" },
      { trait_type: "Experience", value: "Veteran" },
    ],
  },
  {
    name: "Degen-Derrick",
    description:
      "The ultimate degen who goes all-in on every trade. High risk, high reward mentality.",
    attributes: [
      { trait_type: "Character", value: "Degen Trader" },
      { trait_type: "Strategy", value: "All-In" },
      { trait_type: "Risk Level", value: "Extreme" },
      { trait_type: "Experience", value: "Degen" },
    ],
  },
  {
    name: "Freddy-fomo",
    description:
      "The FOMO master who buys at the top and sells at the bottom. Classic FOMO behavior.",
    attributes: [
      { trait_type: "Character", value: "FOMO Trader" },
      { trait_type: "Strategy", value: "FOMO" },
      { trait_type: "Risk Level", value: "High" },
      { trait_type: "Experience", value: "FOMO Expert" },
    ],
  },
  {
    name: "Gloria-Gains",
    description:
      "The profit queen who always takes her gains. Knows when to exit and secure profits.",
    attributes: [
      { trait_type: "Character", value: "Profit Taker" },
      { trait_type: "Strategy", value: "Take Profits" },
      { trait_type: "Risk Level", value: "Medium" },
      { trait_type: "Experience", value: "Profit Master" },
    ],
  },
  {
    name: "Henry-Hodl",
    description:
      "The diamond hands hodler who never sells. HODL through thick and thin.",
    attributes: [
      { trait_type: "Character", value: "HODLer" },
      { trait_type: "Strategy", value: "HODL" },
      { trait_type: "Risk Level", value: "Medium" },
      { trait_type: "Experience", value: "Diamond Hands" },
    ],
  },
  {
    name: "Kate-Candle",
    description:
      "The technical analyst who reads every candle. Charts and patterns are her life.",
    attributes: [
      { trait_type: "Character", value: "Technical Analyst" },
      { trait_type: "Strategy", value: "Technical Analysis" },
      { trait_type: "Risk Level", value: "Medium" },
      { trait_type: "Experience", value: "Chart Master" },
    ],
  },
  {
    name: "Leroy-leverage",
    description:
      "The leverage king who trades with maximum leverage. 100x or nothing.",
    attributes: [
      { trait_type: "Character", value: "Leverage Trader" },
      { trait_type: "Strategy", value: "Maximum Leverage" },
      { trait_type: "Risk Level", value: "Extreme" },
      { trait_type: "Experience", value: "Leverage King" },
    ],
  },
  {
    name: "Max-Effort",
    description:
      "The workaholic trader who never sleeps. 24/7 market monitoring.",
    attributes: [
      { trait_type: "Character", value: "Workaholic" },
      { trait_type: "Strategy", value: "24/7 Trading" },
      { trait_type: "Risk Level", value: "High" },
      { trait_type: "Experience", value: "No Sleep" },
    ],
  },
  {
    name: "Sally-Swaps",
    description:
      "The DeFi queen who swaps everything. Always chasing the best yields.",
    attributes: [
      { trait_type: "Character", value: "DeFi Trader" },
      { trait_type: "Strategy", value: "Yield Farming" },
      { trait_type: "Risk Level", value: "Medium" },
      { trait_type: "Experience", value: "DeFi Expert" },
    ],
  },
  {
    name: "William-Banker",
    description:
      "The traditional banker who's late to crypto. Still learning the ropes.",
    attributes: [
      { trait_type: "Character", value: "Traditional Banker" },
      { trait_type: "Strategy", value: "Conservative" },
      { trait_type: "Risk Level", value: "Low" },
      { trait_type: "Experience", value: "Crypto Newbie" },
    ],
  },
];

function generateNFTMetadata() {
  console.log("🚀 Generating NFT metadata files...");

  // Create nfts-json directory
  const outputDir = path.join(__dirname, "../nfts-json");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log("📁 Created nfts-json directory");
  }

  NAMED_NFTS.forEach((nft, index) => {
    const tokenId = index + 1;

    const metadata = {
      name: `${nft.name} #${tokenId}`,
      description: nft.description,
      image: `/images/nfts/${nft.name}.png`,
      external_url: "https://alvara-nft.com",
      attributes: nft.attributes,
      background_color: "1D132E",
      animation_url: "",
      youtube_url: "",
      collection: {
        name: "Alvara Investment Wankers",
        family: "Alvara",
      },
      properties: {
        files: [
          {
            uri: `/images/nfts/${nft.name}.png`,
            type: "image/png",
          },
        ],
        category: "image",
        creators: [
          {
            address: "0x0000000000000000000000000000000000000000",
            share: 100,
          },
        ],
      },
    };

    const fileName = `${nft.name}.json`;
    const filePath = path.join(outputDir, fileName);

    fs.writeFileSync(filePath, JSON.stringify(metadata, null, 2));
    console.log(`✅ Generated ${fileName}`);
  });

  console.log(`\n📊 Generated ${NAMED_NFTS.length} NFT metadata files`);
  console.log(`📁 Files saved to: ${outputDir}`);

  // Create an index file with all metadata
  const allMetadata = NAMED_NFTS.map((nft, index) => ({
    tokenId: index + 1,
    name: nft.name,
    fileName: `${nft.name}.json`,
  }));

  const indexPath = path.join(outputDir, "index.json");
  fs.writeFileSync(indexPath, JSON.stringify(allMetadata, null, 2));
  console.log(`📄 Created index.json with all NFT references`);
}

generateNFTMetadata();
