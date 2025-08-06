const { run } = require("hardhat");
require("dotenv").config();

async function verifyContract() {
  console.log("\n🔍 VERIFYING CONTRACT ON ETHERSCAN");
  console.log("==================================\n");

  const contractAddress = "0xE6FDaF5F32d9187C0244e5C565F2CAcED1A3747f";
  const alvaTokenAddress = "0x779877A7B0D9E8603169DdbD7836e478b4624789";

  console.log(`📍 Contract Address: ${contractAddress}`);
  console.log(`🪙 ALVA Token Address: ${alvaTokenAddress}`);
  console.log(`🌐 Network: Sepolia Testnet`);

  try {
    console.log("\n⏳ Submitting contract for verification...");

    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: [alvaTokenAddress],
      contract: "contracts/AlvaraMintIPFS.sol:AlvaraMintIPFS",
    });

    console.log("\n✅ CONTRACT VERIFICATION SUCCESSFUL!");
    console.log("===================================");
    console.log(
      `🔗 View on Etherscan: https://sepolia.etherscan.io/address/${contractAddress}`
    );
    console.log("📋 Features now available:");
    console.log("  • Read contract functions");
    console.log("  • Write contract functions");
    console.log("  • Transaction history");
    console.log("  • Source code verification");
    console.log("  • ABI and bytecode");
  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("\n✅ CONTRACT ALREADY VERIFIED!");
      console.log(
        `🔗 View on Etherscan: https://sepolia.etherscan.io/address/${contractAddress}`
      );
    } else {
      console.log(`\n❌ Verification failed: ${error.message}`);
      console.log("\n🔧 Troubleshooting tips:");
      console.log("1. Make sure ETHERSCAN_API_KEY is set in .env");
      console.log("2. Wait a few minutes after deployment before verifying");
      console.log("3. Ensure constructor arguments match deployment");
      console.log("4. Check if contract is already verified");
    }
  }
}

verifyContract().catch(console.error);
