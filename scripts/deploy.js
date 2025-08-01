const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Using Sepolia testnet token address for ALVA token
  const mockAlvaToken = "0x779877A7B0D9E8603169DdbD7836e478b4624789"; // Sepolia testnet token

  const AlvaraMint = await ethers.getContractFactory("AlvaraMint");
  const alvaraMint = await AlvaraMint.deploy(mockAlvaToken);

  await alvaraMint.deployed();

  console.log("AlvaraMint deployed to:", alvaraMint.address);
  console.log("Mint is permanently active - no time restrictions!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
