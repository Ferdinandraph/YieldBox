const hre = require("hardhat");

async function main() {
  const ownerAddress = "0xF875868609b5de20d65E0Bd01D2A48Da0621cb30";
  const YieldBlox = await hre.ethers.getContractFactory("YieldBlox");
  const yieldBlox = await YieldBlox.deploy(ownerAddress);
  await yieldBlox.waitForDeployment();
  console.log("YieldBlox deployed to:", yieldBlox.target);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});