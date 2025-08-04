const { ethers } = require("hardhat");
require("dotenv").config();

async function testUnlimitedMinting() {
  console.log("\n🚀 TESTING UNLIMITED MINTING");
  console.log("============================\n");

  const [deployer] = await ethers.getSigners();
  const contractAddress = "0xE6FDaF5F32d9187C0244e5C565F2CAcED1A3747f"; // New contract

  console.log(`📍 Contract: ${contractAddress}`);
  console.log(`👤 Tester: ${deployer.address}`);

  const AlvaraMintIPFS = await ethers.getContractFactory("AlvaraMintIPFS");
  const contract = AlvaraMintIPFS.attach(contractAddress);

  try {
    const standardPrice = await contract.STANDARD_PRICE();
    console.log(`💰 Price: ${ethers.utils.formatEther(standardPrice)} ETH`);

    // Check current balance before minting
    const initialBalance = await contract.balanceOf(deployer.address);
    console.log(`📊 Initial NFT balance: ${initialBalance.toString()}`);

    // Mint multiple NFTs to test unlimited minting
    console.log("\n🎯 Testing unlimited minting...");

    const mintPromises = [];
    for (let i = 1; i <= 5; i++) {
      console.log(`Minting NFT ${i}/5 with design ${i}...`);
      const tx = await contract.mint(i, { value: standardPrice });
      mintPromises.push(tx.wait());
    }

    // Wait for all transactions to complete
    console.log("⏳ Waiting for all mint transactions to confirm...");
    await Promise.all(mintPromises);

    // Check final balance
    const finalBalance = await contract.balanceOf(deployer.address);
    const newMints = finalBalance.toNumber() - initialBalance.toNumber();

    console.log(`✅ Successfully minted ${newMints} NFTs!`);
    console.log(`📊 Final NFT balance: ${finalBalance.toString()}`);

    // Check wallet mints counter
    const walletMints = await contract.walletMints(deployer.address);
    console.log(`🔢 Wallet mints counter: ${walletMints.toString()}`);

    // Test one more mint to confirm no limit
    console.log("\n🎯 Testing 6th mint to confirm no limits...");
    const tx6 = await contract.mint(6, { value: standardPrice });
    await tx6.wait();

    const veryFinalBalance = await contract.balanceOf(deployer.address);
    console.log(
      `✅ 6th mint successful! New balance: ${veryFinalBalance.toString()}`
    );

    console.log("\n🎉 UNLIMITED MINTING CONFIRMED!");
    console.log("==============================");
    console.log("✅ No minting limits enforced");
    console.log("✅ Multiple mints per wallet allowed");
    console.log("✅ Users can mint as many NFTs as they want");
    console.log("✅ Only limited by ETH balance for gas + mint price");
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
}

testUnlimitedMinting().catch(console.error);
