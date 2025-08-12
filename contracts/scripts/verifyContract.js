const hre = require("hardhat");

async function main() {
  const CONTRACT_ADDRESS = "0x45F3bC0E6A2b8ae580A5dD1D5682D58505643dc8";
  const VEALVA_TOKEN_ADDRESS = "0x07157d55112a6badd62099b8ad0bbdfbc81075bd";

  console.log("🔍 Verifying AlvaraNFT contract on Etherscan...");
  console.log("Contract Address:", CONTRACT_ADDRESS);
  console.log("veALVA Token Address:", VEALVA_TOKEN_ADDRESS);

  try {
    await hre.run("verify:verify", {
      address: CONTRACT_ADDRESS,
      constructorArguments: [VEALVA_TOKEN_ADDRESS],
      contract: "src/AlvaraNFT.sol:AlvaraNFT",
    });

    console.log("✅ Contract verified successfully on Etherscan!");
    console.log(
      "🔗 View contract: https://etherscan.io/address/" + CONTRACT_ADDRESS
    );
  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("✅ Contract is already verified on Etherscan!");
      console.log(
        "🔗 View contract: https://etherscan.io/address/" + CONTRACT_ADDRESS
      );
    } else {
      console.error("❌ Verification failed:", error.message);
      console.log("\n📋 Manual verification details:");
      console.log("Contract Address:", CONTRACT_ADDRESS);
      console.log("Contract Name: AlvaraNFT");
      console.log("Constructor Arguments:", [VEALVA_TOKEN_ADDRESS]);
      console.log("Compiler Version: 0.8.20");
      console.log("Optimization: Enabled");
      console.log("Runs: 200");
      console.log(
        "\n🔗 Manual verification URL: https://etherscan.io/verifyContract"
      );
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
