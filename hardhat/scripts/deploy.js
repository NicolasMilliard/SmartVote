const hre = require("hardhat");

const main = async () => {
  await hre.ethers.provider.ready;
  const [deployer] = await hre.ethers.getSigners();

  // Deployer's balance before deployment
  let balance = await deployer.getBalance();
  console.log(
    `Deployer original balance: ${hre.ethers.utils.formatEther(balance)}`
  );

  // Deploy VotingFactory
  const VotingFactory = await hre.ethers.getContractFactory("VotingFactory");
  const votingFactory = await VotingFactory.deploy();
  await votingFactory.deployed();
  console.log(`VotingFactory is deployed: ${votingFactory.address}`);

  // Deploy VotingHandler
  const VotingHandler = await hre.ethers.getContractFactory("VotingHandler");
  const votingHandler = await VotingHandler.deploy();
  await votingHandler.deployed();
  console.log(`VotingHandler is deployed: ${votingHandler.address}`);

  // Deployer's balance after deployment
  balance = await deployer.getBalance();
  console.log(`Deployer new balance: ${hre.ethers.utils.formatEther(balance)}`);
};

main().catch((error) => {
  console.log(error);
  process.exitCode = 1;
});
