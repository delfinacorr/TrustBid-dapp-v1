import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const platformFee = 250; // 2.5%

  const TrustBid = await ethers.getContractFactory("TrustBid");
  const trustBid = await TrustBid.deploy(platformFee);
  await trustBid.waitForDeployment();

  const address = await trustBid.getAddress();
  console.log("TrustBid deployed to:", address);
  console.log("Platform fee:", platformFee, "basis points");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
