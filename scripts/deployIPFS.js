const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log(
    "Deploying improved IPFS contract with the account:",
    deployer.address
  );
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Using Sepolia testnet token address for ALVA token
  const mockAlvaToken = "0x779877A7B0D9E8603169DdbD7836e478b4624789"; // Sepolia testnet token

  const AlvaraMintIPFS = await ethers.getContractFactory("AlvaraMintIPFS");
  const alvaraMint = await AlvaraMintIPFS.deploy(mockAlvaToken);

  await alvaraMint.deployed();

  console.log("AlvaraMintIPFS deployed to:", alvaraMint.address);
  console.log("✅ This contract has built-in IPFS metadata mapping!");

  // Test the tokenURI generation
  console.log("\n🔗 Testing metadata URLs:");
  for (let i = 1; i <= 3; i++) {
    const hash = await alvaraMint.designMetadataHash(i);
    console.log(`Design ${i}: https://gateway.pinata.cloud/ipfs/${hash}`);
  }

  console.log("\n📋 Next steps:");
  console.log("1. Update frontend to use new contract address");
  console.log("2. Test minting - tokenURI will work automatically!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
