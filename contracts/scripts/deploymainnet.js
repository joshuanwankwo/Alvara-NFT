const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying AlvaraNFT to Ethereum Mainnet...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Real mainnet addresses - only need veALVA now
  const VEALVA_TOKEN_ADDRESS = "0x07157d55112a6badd62099b8ad0bbdfbc81075bd";

  console.log("\n📋 Contract Addresses:");
  console.log("veALVA Token:", VEALVA_TOKEN_ADDRESS);

  // Deploy AlvaraNFT Contract
  console.log("\n📦 Deploying AlvaraNFT Contract...");

  // Get current gas price and use a conservative estimate
  const currentGasPrice = await ethers.provider.getGasPrice();
  const conservativeGasPrice = currentGasPrice.mul(120).div(100); // 20% higher for safety
  console.log(
    "Current gas price:",
    ethers.utils.formatUnits(currentGasPrice, "gwei"),
    "gwei"
  );
  console.log(
    "Using gas price:",
    ethers.utils.formatUnits(conservativeGasPrice, "gwei"),
    "gwei"
  );

  const AlvaraNFT = await hre.ethers.getContractFactory("AlvaraNFT");
  const alvaraNFT = await AlvaraNFT.deploy(
    VEALVA_TOKEN_ADDRESS // veALVA token address
  );

  console.log(
    "AlvaraNFT deployment transaction hash:",
    alvaraNFT.deployTransaction.hash
  );
  console.log("Waiting for AlvaraNFT deployment confirmation...");
  await alvaraNFT.deployed();
  const alvaraNFTAddress = alvaraNFT.address;
  console.log("✅ AlvaraNFT deployed to:", alvaraNFTAddress);

  console.log("\n🎉 Mainnet Deployment Summary:");
  console.log("================================");
  console.log("AlvaraNFT Contract:", alvaraNFTAddress);
  console.log("veALVA Token:", VEALVA_TOKEN_ADDRESS);

  console.log("\n📝 Contract Addresses for Frontend:");
  console.log("=====================================");
  console.log(`VEALVA_TOKEN_ADDRESS: "${VEALVA_TOKEN_ADDRESS}"`);
  console.log(`CONTRACT_ADDRESS: "${alvaraNFTAddress}"`);

  console.log("\n🔗 Verification Commands:");
  console.log("=========================");
  console.log(
    `npx hardhat verify --network mainnet ${alvaraNFTAddress} "${VEALVA_TOKEN_ADDRESS}"`
  );

  console.log("\n⚠️  Important Notes:");
  console.log("===================");
  console.log("1. This is a LIVE mainnet deployment - be careful!");
  console.log("2. Standard price: 0.0003 ETH (~$1 for testing)");
  console.log("3. Discount price: 0.00015 ETH (~$0.50 for veALVA holders)");
  console.log("4. ETH revenue stays in contract for manual team withdrawal");
  console.log("5. Use openMinting() to enable minting");
  console.log("6. Use withdrawETH() to withdraw accumulated revenue");
  console.log("7. Update your frontend with the new contract address");

  console.log("\n🛠️  Next Steps:");
  console.log("================");
  console.log("1. Call openMinting() to enable minting for 7 days");
  console.log("2. Update frontend contract address");
  console.log("3. Update frontend ABI to match new simplified mint function");
  console.log("4. Test minting functionality");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
