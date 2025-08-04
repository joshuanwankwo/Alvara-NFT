// Update smart contract base URI after IPFS upload
const { ethers } = require("hardhat");

async function updateBaseURI() {
  const baseURI = process.env.IPFS_BASE_URI;
  
  if (!baseURI) {
    console.log("❌ Please set IPFS_BASE_URI in your .env file");
    return;
  }

  console.log("🔄 Updating smart contract base URI...");
  console.log("Base URI:", baseURI);

  const [deployer] = await ethers.getSigners();
  const contractAddress = "0x9EF7Aa4bdCe97c888D9E3977a16F2d72da9A8A99"; // Your deployed contract

  const AlvaraMint = await ethers.getContractFactory("AlvaraMint");
  const contract = AlvaraMint.attach(contractAddress);

  const tx = await contract.setBaseURI(baseURI);
  await tx.wait();

  console.log("✅ Base URI updated successfully!");
  console.log("Transaction:", tx.hash);
}

updateBaseURI().catch(console.error);
