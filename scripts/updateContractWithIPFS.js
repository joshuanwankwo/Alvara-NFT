const { ethers } = require("hardhat");
require("dotenv").config();

// Since we uploaded individual metadata files, we need to modify our approach
// Our contract expects baseURI + tokenId.json format
// But we have individual IPFS hashes for each metadata file

const METADATA_HASHES = {
  1: "QmXci1VZWjwJAmY28uuSPpCtfWg2BAt2PLjFZpC5Q5T8rr",
  2: "QmZYgMkkvAoG24TZmkBHbEZsqEjfacUECPF6sginF3Yu3r",
  3: "QmRkbPt9KgwqBYrcWpDd3w4CFXZrzmJSbMRHPaaUsmiM39",
  4: "QmUu5k6jL34K2UutvrbdPFVFMjU9Jz2NocuTW15uP1Dj7x",
  5: "QmVxkPDZEBd74XVimxPpNtWjPJ6NvFfnZrc5uvP3BTmL7C",
  6: "QmV37ntf4A6oFoQtouR8rjjkBLbitMPveDqpV33p4sYqhQ",
  7: "QmRGDXEwAW1yzktvQiMcc4ANu4vQ3wB6T4ZAF5B4TTZiYb",
  8: "QmayaiJDu9r9Twf5g5vxdM6tBs6paUW1Kw5tfy1jG3kaF7",
  9: "QmSeQoXAFLCi9APN1p65M8hpJkf2HAs14xufzsWatEss9r",
  10: "QmVhB2DvE4voqpEb42ptdVJA9mpNjiWuoUDRcjR2CAJQTh",
};

async function updateContractBaseURI() {
  console.log("\n🔄 UPDATING SMART CONTRACT WITH IPFS METADATA");
  console.log("=============================================");

  const [deployer] = await ethers.getSigners();
  const contractAddress = "0x9EF7Aa4bdCe97c888D9E3977a16F2d72da9A8A99"; // Your deployed contract

  console.log("Deployer:", deployer.address);
  console.log("Contract:", contractAddress);

  const AlvaraMint = await ethers.getContractFactory("AlvaraMint");
  const contract = AlvaraMint.attach(contractAddress);

  // Option 1: Use gateway.pinata.cloud base
  const baseURI = "https://gateway.pinata.cloud/ipfs/";

  console.log("\\n📝 Setting base URI:", baseURI);

  try {
    const tx = await contract.setBaseURI(baseURI);
    console.log("Transaction submitted:", tx.hash);

    console.log("⏳ Waiting for confirmation...");
    await tx.wait();

    console.log("✅ Base URI updated successfully!");

    // Verify the update
    const newBaseURI = await contract.baseURI();
    console.log("📋 New base URI:", newBaseURI);

    console.log("\n🔗 Your NFT metadata URLs will now be:");
    for (let i = 1; i <= 10; i++) {
      const tokenURI = await contract.tokenURI(i);
      console.log(`Token ${i}: ${tokenURI}`);
    }
  } catch (error) {
    console.log("❌ Error updating base URI:", error.message);

    if (error.message.includes("OwnableUnauthorizedAccount")) {
      console.log("\n💡 Make sure you're using the contract owner account");
      console.log("Current deployer:", deployer.address);

      const owner = await contract.owner();
      console.log("Contract owner:", owner);
    }
  }
}

async function showCurrentTokenURIs() {
  console.log("\\n📋 CURRENT TOKEN URI STRUCTURE");
  console.log("================================");

  const contractAddress = "0x9EF7Aa4bdCe97c888D9E3977a16F2d72da9A8A99";
  const AlvaraMint = await ethers.getContractFactory("AlvaraMint");
  const contract = AlvaraMint.attach(contractAddress);

  try {
    const baseURI = await contract.baseURI();
    console.log("Current base URI:", baseURI);

    console.log("\nExpected token URIs:");
    for (let i = 1; i <= 3; i++) {
      // Show first 3 as example
      console.log(`Token ${i}: ${baseURI}${i}.json`);
    }

    console.log("\n🌐 Individual IPFS URLs:");
    for (let i = 1; i <= 3; i++) {
      console.log(
        `Token ${i}: https://gateway.pinata.cloud/ipfs/${METADATA_HASHES[i]}`
      );
    }
  } catch (error) {
    console.log("❌ Error reading contract:", error.message);
  }
}

async function main() {
  const action = process.argv[2];

  if (action === "show") {
    await showCurrentTokenURIs();
  } else {
    await updateContractBaseURI();
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { updateContractBaseURI, METADATA_HASHES };
