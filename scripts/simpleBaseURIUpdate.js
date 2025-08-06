const { ethers } = require("hardhat");
require("dotenv").config();

async function updateBaseURI() {
  console.log("\n🔄 UPDATING SMART CONTRACT BASE URI");
  console.log("===================================");

  const [deployer] = await ethers.getSigners();
  const contractAddress = "0x9EF7Aa4bdCe97c888D9E3977a16F2d72da9A8A99";

  console.log("Deployer:", deployer.address);
  console.log("Contract:", contractAddress);

  const AlvaraMint = await ethers.getContractFactory("AlvaraMint");
  const contract = AlvaraMint.attach(contractAddress);

  try {
    // Check current base URI
    const currentBaseURI = await contract.baseURI();
    console.log("Current base URI:", currentBaseURI);

    // Since we uploaded individual files, and our contract expects baseURI + tokenId.json
    // We'll use the gateway URL as base URI for now
    const newBaseURI = "https://gateway.pinata.cloud/ipfs/";

    console.log("Setting new base URI:", newBaseURI);

    const tx = await contract.setBaseURI(newBaseURI);
    console.log("Transaction submitted:", tx.hash);

    console.log("⏳ Waiting for confirmation...");
    await tx.wait();

    console.log("✅ Base URI updated successfully!");

    // Verify the update
    const updatedBaseURI = await contract.baseURI();
    console.log("📋 Updated base URI:", updatedBaseURI);

    console.log("\n🔗 NFT metadata URLs will be:");
    console.log("Format: baseURI + designId + '.json'");

    // Show what URLs would look like for each design
    for (let i = 1; i <= 3; i++) {
      console.log(`Design ${i}: ${updatedBaseURI}${i}.json`);
    }

    console.log("\n⚠️  NOTE: The URLs above won't work yet because:");
    console.log(
      "1. We uploaded individual metadata files with different hashes"
    );
    console.log("2. We need to either:");
    console.log("   - Upload metadata to a folder structure, OR");
    console.log("   - Modify the contract to use individual hashes");
  } catch (error) {
    console.log("❌ Error:", error.message);

    if (error.message.includes("OwnableUnauthorizedAccount")) {
      console.log("\n💡 Make sure you're using the contract owner account");
      const owner = await contract.owner();
      console.log("Contract owner:", owner);
      console.log("Current account:", deployer.address);
    }
  }
}

updateBaseURI().catch(console.error);
