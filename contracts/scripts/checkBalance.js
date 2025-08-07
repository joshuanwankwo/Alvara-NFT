const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Checking balance for account:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Balance:", ethers.utils.formatEther(balance), "ETH");
  
  // Estimate gas for deployment
  const AlvaraMintIPFS = await hre.ethers.getContractFactory("AlvaraMintIPFS");
  const deploymentData = AlvaraMintIPFS.getDeployTransaction(
    "0x8e729198d1c59b82bd6bba579310c40d740a11c2", // ALVA
    "0x07157d55112a6badd62099b8ad0bbdfbc81075bd", // veALVA
    "0x66a9893cc07d91d95644aedd05d03f95e1dba8af"  // Uniswap V4 Router
  );
  
  const gasEstimate = await ethers.provider.estimateGas(deploymentData);
  const gasPrice = await ethers.provider.getGasPrice();
  const totalCost = gasEstimate.mul(gasPrice);
  
  console.log("Estimated gas:", gasEstimate.toString());
  console.log("Current gas price:", ethers.utils.formatUnits(gasPrice, "gwei"), "gwei");
  console.log("Estimated total cost:", ethers.utils.formatEther(totalCost), "ETH");
  console.log("Sufficient funds:", balance.gte(totalCost) ? "✅ Yes" : "❌ No");
}

main().then(() => process.exit(0)).catch((error) => {
  console.error("❌ Error:", error);
  process.exit(1);
}); 