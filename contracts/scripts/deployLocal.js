const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying mock contracts for local testing...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Deploy Mock ALVA Token
  console.log("\n📦 Deploying Mock ALVA Token...");
  const MockALVA = await hre.ethers.getContractFactory("MockALVA");
  const mockALVA = await MockALVA.deploy();
  await mockALVA.deployed();
  const mockALVAAddress = mockALVA.address;
  console.log("✅ Mock ALVA deployed to:", mockALVAAddress);

  // Deploy Mock veALVA Token
  console.log("\n📦 Deploying Mock veALVA Token...");
  const MockVeALVA = await hre.ethers.getContractFactory("MockVeALVA");
  const mockVeALVA = await MockVeALVA.deploy();
  await mockVeALVA.deployed();
  const mockVeALVAAddress = mockVeALVA.address;
  console.log("✅ Mock veALVA deployed to:", mockVeALVAAddress);

  // Deploy Mock Uniswap V4 Router
  console.log("\n📦 Deploying Mock Uniswap V4 Router...");
  const MockUniswapV4Router = await hre.ethers.getContractFactory(
    "MockUniswapV4Router"
  );
  const mockRouter = await MockUniswapV4Router.deploy();
  await mockRouter.deployed();
  const mockRouterAddress = mockRouter.address;
  console.log("✅ Mock Uniswap V4 Router deployed to:", mockRouterAddress);

  // Deploy AlvaraMintIPFS Contract
  console.log("\n📦 Deploying AlvaraMintIPFS Contract...");
  const AlvaraMintIPFS = await hre.ethers.getContractFactory("AlvaraMintIPFS");
  const alvaraMint = await AlvaraMintIPFS.deploy(
    mockALVAAddress, // ALVA token address
    mockVeALVAAddress, // veALVA token address
    mockRouterAddress // Uniswap V4 router address
  );
  await alvaraMint.deployed();
  const alvaraMintAddress = alvaraMint.address;
  console.log("✅ AlvaraMintIPFS deployed to:", alvaraMintAddress);

  // Fund the router with some ALVA tokens for testing
  console.log("\n💰 Funding Mock Router with ALVA tokens...");
  const alvaBalance = await mockALVA.balanceOf(deployer.address);
  const transferAmount = alvaBalance.div(2); // Transfer half of deployer's balance
  await mockALVA.transfer(mockRouterAddress, transferAmount);
  console.log(
    "✅ Router funded with",
    ethers.utils.formatEther(transferAmount),
    "ALVA tokens"
  );

  // Distribute some veALVA tokens to test accounts
  console.log("\n💰 Distributing veALVA tokens for testing...");
  const accounts = await ethers.getSigners();

  // Give veALVA tokens to the first few test accounts
  for (let i = 1; i < Math.min(5, accounts.length); i++) {
    const account = accounts[i];
    const veALVAAmount = ethers.utils.parseEther("10"); // 10 veALVA tokens
    await mockVeALVA.transfer(account.address, veALVAAmount);
    console.log(
      `✅ Account ${i} (${account.address}) received 10 veALVA tokens`
    );
  }

  console.log("\n🎉 Deployment Summary:");
  console.log("================================");
  console.log("Mock ALVA Token:", mockALVAAddress);
  console.log("Mock veALVA Token:", mockVeALVAAddress);
  console.log("Mock Uniswap V4 Router:", mockRouterAddress);
  console.log("AlvaraMintIPFS Contract:", alvaraMintAddress);
  console.log("\n📝 Contract Addresses for Frontend:");
  console.log("=====================================");
  console.log(`ALVA_TOKEN_ADDRESS: "${mockALVAAddress}"`);
  console.log(`VEALVA_TOKEN_ADDRESS: "${mockVeALVAAddress}"`);
  console.log(`UNISWAP_V4_ROUTER_ADDRESS: "${mockRouterAddress}"`);
  console.log(`CONTRACT_ADDRESS: "${alvaraMintAddress}"`);

  console.log("\n🧪 Testing Instructions:");
  console.log("========================");
  console.log(
    "1. Update your frontend addresses with the above contract addresses"
  );
  console.log(
    "2. Connect with different accounts to test discount vs standard pricing"
  );
  console.log(
    "3. Accounts 1-4 have veALVA tokens and will get discount pricing"
  );
  console.log("4. Other accounts will pay standard pricing");
  console.log("5. Each mint will swap ETH for ALVA tokens via the mock router");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
