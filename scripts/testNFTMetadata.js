const axios = require("axios");

// Test fetching NFT metadata from IPFS
const METADATA_HASHES = {
  1: "QmXci1VZWjwJAmY28uuSPpCtfWg2BAt2PLjFZpC5Q5T8rr",
  2: "QmZYgMkkvAoG24TZmkBHbEZsqEjfacUECPF6sginF3Yu3r",
  3: "QmRkbPt9KgwqBYrcWpDd3w4CFXZrzmJSbMRHPaaUsmiM39",
};

const PINATA_GATEWAY = "https://gateway.pinata.cloud/ipfs/";

async function testNFTMetadata() {
  console.log("🧪 TESTING NFT METADATA FETCHING");
  console.log("================================\n");

  for (const [designId, hash] of Object.entries(METADATA_HASHES)) {
    try {
      const url = `${PINATA_GATEWAY}${hash}`;
      console.log(`🔍 Testing Design ${designId}:`);
      console.log(`   URL: ${url}`);

      const response = await axios.get(url, { timeout: 10000 });
      const metadata = response.data;

      console.log(`   ✅ Name: ${metadata.name}`);
      console.log(
        `   ✅ Description: ${metadata.description.substring(0, 50)}...`
      );
      console.log(`   ✅ Image: ${metadata.image}`);

      const rarity = metadata.attributes.find(
        (attr) => attr.trait_type === "Rarity"
      );
      console.log(`   ✅ Rarity: ${rarity ? rarity.value : "Unknown"}`);

      console.log(`   ✅ Attributes: ${metadata.attributes.length} total\n`);
    } catch (error) {
      console.log(`   ❌ Failed: ${error.message}\n`);
    }
  }

  console.log("✅ NFT Metadata test completed!");
}

testNFTMetadata().catch(console.error);
