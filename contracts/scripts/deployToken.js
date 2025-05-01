async function main() {
    const TestToken = await ethers.getContractFactory("TestToken");
    const token = await TestToken.deploy();
    await token.waitForDeployment();
    console.log("TestToken deployed to:", token.target);
  }
  
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });