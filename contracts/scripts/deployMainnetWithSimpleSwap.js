const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying AlvaraMintIPFS to Ethereum Mainnet...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Real mainnet addresses
  const ALVA_TOKEN_ADDRESS = "0x8e729198d1c59b82bd6bba579310c40d740a11c2";
  const VEALVA_TOKEN_ADDRESS = "0x07157d55112a6badd62099b8ad0bbdfbc81075bd";
  const WETH_TOKEN_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"; // WETH on mainnet
  const UNISWAP_V3_ROUTER_ADDRESS =
    "0xE592427A0AEce92De3Edee1F18E0157C05861564"; // Uniswap V3 SwapRouter

  console.log("\n📋 Contract Addresses:");
  console.log("ALVA Token:", ALVA_TOKEN_ADDRESS);
  console.log("veALVA Token:", VEALVA_TOKEN_ADDRESS);
  console.log("WETH Token:", WETH_TOKEN_ADDRESS);
  console.log("Uniswap V3 Router:", UNISWAP_V3_ROUTER_ADDRESS);

  // Deploy AlvaraMintIPFS Contract
  console.log("\n📦 Deploying AlvaraMintIPFS Contract...");

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

  const AlvaraMintIPFS = await hre.ethers.getContractFactory("AlvaraMintIPFS");
  const alvaraMint = await AlvaraMintIPFS.deploy(
    ALVA_TOKEN_ADDRESS, // ALVA token address
    VEALVA_TOKEN_ADDRESS, // veALVA token address
    WETH_TOKEN_ADDRESS, // WETH token address
    UNISWAP_V3_ROUTER_ADDRESS // Uniswap V3 SwapRouter address
  );

  console.log(
    "AlvaraMintIPFS deployment transaction hash:",
    alvaraMint.deployTransaction.hash
  );
  console.log("Waiting for AlvaraMintIPFS deployment confirmation...");
  await alvaraMint.deployed();
  const alvaraMintAddress = alvaraMint.address;
  console.log("✅ AlvaraMintIPFS deployed to:", alvaraMintAddress);

  console.log("\n🎉 Mainnet Deployment Summary:");
  console.log("================================");
  console.log("AlvaraMintIPFS Contract:", alvaraMintAddress);
  console.log("ALVA Token:", ALVA_TOKEN_ADDRESS);
  console.log("veALVA Token:", VEALVA_TOKEN_ADDRESS);
  console.log("WETH Token:", WETH_TOKEN_ADDRESS);
  console.log("Uniswap V3 Router:", UNISWAP_V3_ROUTER_ADDRESS);

  console.log("\n📝 Contract Addresses for Frontend:");
  console.log("=====================================");
  console.log(`ALVA_TOKEN_ADDRESS: "${ALVA_TOKEN_ADDRESS}"`);
  console.log(`VEALVA_TOKEN_ADDRESS: "${VEALVA_TOKEN_ADDRESS}"`);
  console.log(`WETH_TOKEN_ADDRESS: "${WETH_TOKEN_ADDRESS}"`);
  console.log(`UNISWAP_V3_ROUTER_ADDRESS: "${UNISWAP_V3_ROUTER_ADDRESS}"`);
  console.log(`CONTRACT_ADDRESS: "${alvaraMintAddress}"`);

  console.log("\n🔗 Verification Commands:");
  console.log("=========================");
  console.log(
    `npx hardhat verify --network mainnet ${alvaraMintAddress} "${ALVA_TOKEN_ADDRESS}" "${VEALVA_TOKEN_ADDRESS}" "${WETH_TOKEN_ADDRESS}" "${UNISWAP_V3_ROUTER_ADDRESS}"`
  );

  console.log("\n⚠️  Important Notes:");
  console.log("===================");
  console.log("1. This is a LIVE mainnet deployment - be careful!");
  console.log("2. Standard price: 0.001 ETH (settable by owner)");
  console.log(
    "3. Discount price: 0.0005 ETH (50% of standard price for veALVA holders)"
  );
  console.log("4. Users will receive ALVA tokens after minting via Uniswap V3");
  console.log("5. Update your frontend with the new contract addresses");
  console.log("6. Use setStandardPrice() to adjust pricing if needed");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
