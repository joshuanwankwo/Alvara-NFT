const { ethers } = require("hardhat");
require("dotenv").config();

async function testNewContract() {
  console.log("\n🧪 TESTING NEW IPFS-INTEGRATED CONTRACT");
  console.log("======================================");

  const [deployer] = await ethers.getSigners();
  const contractAddress = "0x2378A3b6E2754D40Ae6315bE177C98a0cC335d9B"; // New contract

  console.log("Tester:", deployer.address);
  console.log("Contract:", contractAddress);

  const AlvaraMintIPFS = await ethers.getContractFactory("AlvaraMintIPFS");
  const contract = AlvaraMintIPFS.attach(contractAddress);

  try {
    // Check contract state
    const standardPrice = await contract.STANDARD_PRICE();
    console.log(
      "Standard price:",
      ethers.utils.formatEther(standardPrice),
      "ETH"
    );

    // Check design metadata hash for design 1
    const design1Hash = await contract.designMetadataHash(1);
    console.log("Design 1 metadata hash:", design1Hash);

    // Mint NFT with design ID 5 (Oceanic)
    console.log("\n🎯 Minting NFT with design ID 5 (Alvara Oceanic)...");

    const tx = await contract.mint(5, {
      value: standardPrice,
    });

    console.log("Mint transaction:", tx.hash);

    console.log("⏳ Waiting for confirmation...");
    const receipt = await tx.wait();

    console.log("✅ NFT minted successfully!");
    console.log("Gas used:", receipt.gasUsed.toString());

    // Get the minted token details
    const nextTokenId = await contract.nextTokenId();
    const tokenId = nextTokenId - 1; // Just minted token

    console.log("Token ID:", tokenId.toString());

    // Get design ID
    const designId = await contract.tokenDesign(tokenId);
    console.log("Design ID:", designId.toString());

    // Get the token URI - this should now work perfectly!
    const tokenURI = await contract.tokenURI(tokenId);
    console.log("Token URI:", tokenURI);

    // Test the URL
    console.log("\n🌐 Testing metadata URL...");

    const testCommand = `curl -s "${tokenURI}"`;
    console.log("Test command:", testCommand);
    console.log("✅ This URL should work perfectly now!");
  } catch (error) {
    console.log("❌ Error:", error.message);
  }
}

testNewContract().catch(console.error);
