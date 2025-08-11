const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting deployment...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);

  // Deploy MockERC20 first (for testing)
  console.log("🔧 Deploying MockERC20...");
  const MockERC20 = await ethers.getContractFactory("MockERC20");
  const mockERC20 = await MockERC20.deploy();
  await mockERC20.waitForDeployment();
  console.log("✅ MockERC20 deployed to:", await mockERC20.getAddress());

  // Deploy AlvaraMint with the MockERC20 address
  console.log("🎨 Deploying AlvaraMint...");
  const AlvaraMint = await ethers.getContractFactory("AlvaraMint");
  const alvaraMint = await AlvaraMint.deploy(await mockERC20.getAddress());
  await alvaraMint.waitForDeployment();
  console.log("✅ AlvaraMint deployed to:", await alvaraMint.getAddress());

  // Deploy AlvaraMintIPFS with the MockERC20 address
  console.log("🌐 Deploying AlvaraMintIPFS...");
  const AlvaraMintIPFS = await ethers.getContractFactory("AlvaraMintIPFS");
  const alvaraMintIPFS = await AlvaraMintIPFS.deploy(
    await mockERC20.getAddress()
  );
  await alvaraMintIPFS.waitForDeployment();
  console.log(
    "✅ AlvaraMintIPFS deployed to:",
    await alvaraMintIPFS.getAddress()
  );

  console.log("\n🎉 Deployment completed successfully!");
  console.log("\n📋 Contract Addresses:");
  console.log("MockERC20:", await mockERC20.getAddress());
  console.log("AlvaraMint:", await alvaraMint.getAddress());
  console.log("AlvaraMintIPFS:", await alvaraMintIPFS.getAddress());

  console.log("\n💡 Next steps:");
  console.log(
    "1. Update src/contracts/addresses.ts with the new contract addresses"
  );
  console.log("2. Verify contracts on Etherscan");
  console.log("3. Test the minting functionality");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
