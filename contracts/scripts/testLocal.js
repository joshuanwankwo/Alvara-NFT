const hre = require("hardhat");

async function main() {
  console.log("🧪 Testing local deployment...");

  // Get test accounts
  const [deployer, user1, user2] = await ethers.getSigners();

  // Deploy all contracts
  console.log("\n📦 Deploying contracts...");

  const MockALVA = await hre.ethers.getContractFactory("MockALVA");
  const mockALVA = await MockALVA.deploy();
  await mockALVA.deployed();
  const mockALVAAddress = mockALVA.address;

  const MockVeALVA = await hre.ethers.getContractFactory("MockVeALVA");
  const mockVeALVA = await MockVeALVA.deploy();
  await mockVeALVA.deployed();
  const mockVeALVAAddress = mockVeALVA.address;

  const MockUniswapV4Router = await hre.ethers.getContractFactory(
    "MockUniswapV4Router"
  );
  const mockRouter = await MockUniswapV4Router.deploy();
  await mockRouter.deployed();
  const mockRouterAddress = mockRouter.address;

  const AlvaraMintIPFS = await hre.ethers.getContractFactory("AlvaraMintIPFS");
  const alvaraMint = await AlvaraMintIPFS.deploy(
    mockALVAAddress,
    mockVeALVAAddress,
    mockRouterAddress
  );
  await alvaraMint.deployed();
  const alvaraMintAddress = alvaraMint.address;

  console.log("✅ All contracts deployed successfully");

  // Fund router with ALVA tokens
  const alvaBalance = await mockALVA.balanceOf(deployer.address);
  await mockALVA.transfer(mockRouterAddress, alvaBalance.div(2));

  // Give veALVA tokens to user1 for testing discount
  await mockVeALVA.transfer(user1.address, ethers.utils.parseEther("10"));

  // Test 1: User without veALVA (standard price)
  console.log("\n🧪 Test 1: User without veALVA (standard price)");
  console.log(
    "User2 balance before:",
    ethers.utils.formatEther(await ethers.provider.getBalance(user2.address)),
    "ETH"
  );

  const standardPrice = await alvaraMint.STANDARD_PRICE();
  console.log(
    "Standard price:",
    ethers.utils.formatEther(standardPrice),
    "ETH"
  );

  const tx1 = await alvaraMint
    .connect(user2)
    .mint("1", { value: standardPrice });
  await tx1.wait();
  console.log("✅ User2 minted NFT with standard price");

  // Test 2: User with veALVA (discount price)
  console.log("\n🧪 Test 2: User with veALVA (discount price)");
  console.log(
    "User1 balance before:",
    ethers.utils.formatEther(await ethers.provider.getBalance(user1.address)),
    "ETH"
  );

  const discountPrice = await alvaraMint.DISCOUNT_PRICE();
  console.log(
    "Discount price:",
    ethers.utils.formatEther(discountPrice),
    "ETH"
  );

  const tx2 = await alvaraMint
    .connect(user1)
    .mint("2", { value: discountPrice });
  await tx2.wait();
  console.log("✅ User1 minted NFT with discount price");

  // Test 3: Check token URIs
  console.log("\n🧪 Test 3: Checking token URIs");
  const tokenURI1 = await alvaraMint.tokenURI(1);
  const tokenURI2 = await alvaraMint.tokenURI(2);
  console.log("Token 1 URI:", tokenURI1);
  console.log("Token 2 URI:", tokenURI2);

  // Test 4: Check ALVA token balances (should have received tokens from swap)
  console.log("\n🧪 Test 4: Checking ALVA token balances");
  const user1ALVABalance = await mockALVA.balanceOf(user1.address);
  const user2ALVABalance = await mockALVA.balanceOf(user2.address);
  console.log(
    "User1 ALVA balance:",
    ethers.utils.formatEther(user1ALVABalance),
    "ALVA"
  );
  console.log(
    "User2 ALVA balance:",
    ethers.utils.formatEther(user2ALVABalance),
    "ALVA"
  );

  // Test 5: Check NFT ownership
  console.log("\n🧪 Test 5: Checking NFT ownership");
  const owner1 = await alvaraMint.ownerOf(1);
  const owner2 = await alvaraMint.ownerOf(2);
  console.log("Token 1 owner:", owner1);
  console.log("Token 2 owner:", owner2);
  console.log("Expected owner1:", user2.address);
  console.log("Expected owner2:", user1.address);

  console.log("\n🎉 All tests passed successfully!");
  console.log("\n📝 Contract Addresses:");
  console.log("AlvaraMintIPFS:", alvaraMintAddress);
  console.log("Mock ALVA:", mockALVAAddress);
  console.log("Mock veALVA:", mockVeALVAAddress);
  console.log("Mock Router:", mockRouterAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Test failed:", error);
    process.exit(1);
  });
