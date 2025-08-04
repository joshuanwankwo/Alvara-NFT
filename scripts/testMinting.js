const { ethers } = require("hardhat");
require("dotenv").config();

async function testMint() {
  console.log("\n🧪 TESTING NFT MINTING WITH CURRENT SETUP");
  console.log("=========================================");

  const [deployer] = await ethers.getSigners();
  const contractAddress = "0x9EF7Aa4bdCe97c888D9E3977a16F2d72da9A8A99";

  console.log("Minter:", deployer.address);
  console.log("Contract:", contractAddress);

  const AlvaraMint = await ethers.getContractFactory("AlvaraMint");
  const contract = AlvaraMint.attach(contractAddress);

  try {
    // Check current state
    const baseURI = await contract.baseURI();
    console.log("Current base URI:", baseURI);

    const standardPrice = await contract.STANDARD_PRICE();
    console.log(
      "Standard price:",
      ethers.utils.formatEther(standardPrice),
      "ETH"
    );

    // Try to mint NFT #1 (designId = 1)
    console.log("\n🎯 Attempting to mint NFT with design ID 1...");

    const tx = await contract.mint(1, {
      value: standardPrice,
    });

    console.log("Mint transaction submitted:", tx.hash);

    console.log("⏳ Waiting for confirmation...");
    const receipt = await tx.wait();

    console.log("✅ NFT minted successfully!");
    console.log("Gas used:", receipt.gasUsed.toString());

    // Get the token ID (should be 1 for first mint)
    const nextTokenId = await contract.nextTokenId();
    const tokenId = nextTokenId - 1; // Previous token

    console.log("Token ID:", tokenId.toString());

    // Get the token URI
    const tokenURI = await contract.tokenURI(tokenId);
    console.log("Token URI:", tokenURI);

    // Test if the URI is accessible
    console.log("\n🌐 Testing URL accessibility...");
    console.log(
      "Note: This URL likely won't work because we need folder-structure metadata"
    );
  } catch (error) {
    console.log("❌ Error:", error.message);

    if (error.message.includes("Insufficient ETH sent")) {
      console.log("💡 Need to send more ETH for minting");
    } else if (error.message.includes("Mint limit reached")) {
      console.log("💡 This address has already minted maximum NFTs");
    }
  }
}

async function checkMintStatus() {
  console.log("\n📊 CHECKING MINT STATUS");
  console.log("=======================");

  const [deployer] = await ethers.getSigners();
  const contractAddress = "0x9EF7Aa4bdCe97c888D9E3977a16F2d72da9A8A99";

  const AlvaraMint = await ethers.getContractFactory("AlvaraMint");
  const contract = AlvaraMint.attach(contractAddress);

  try {
    const balance = await contract.balanceOf(deployer.address);
    console.log("Your NFT balance:", balance.toString());

    const walletMints = await contract.walletMints(deployer.address);
    console.log("Your mints count:", walletMints.toString());

    const maxMints = await contract.MAX_MINTS_PER_WALLET();
    console.log("Max mints per wallet:", maxMints.toString());

    const nextTokenId = await contract.nextTokenId();
    console.log("Next token ID:", nextTokenId.toString());
  } catch (error) {
    console.log("❌ Error checking status:", error.message);
  }
}

async function main() {
  const action = process.argv[2];

  if (action === "status") {
    await checkMintStatus();
  } else {
    await testMint();
  }
}

main().catch(console.error);
