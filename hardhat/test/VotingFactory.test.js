const { expect } = require("chai");
const hre = require("hardhat");

describe("VotingFactory", async () => {
  // Variables used through all tests
  const zeroAddress = hre.ethers.constants.AddressZero;
  let votingFactory;
  let account;

  // Deploy contract and get signers
  beforeEach(async () => {
    const VotingFactory = await hre.ethers.getContractFactory("VotingFactory");
    votingFactory = await VotingFactory.deploy();
    await votingFactory.deployed();
    [account] = await hre.ethers.getSigners();
  });

  describe("b_A6Q (create a new clone)", async () => {
    it("should emit an event", async () => {
      await expect(votingFactory.b_A6Q({ from: account.address })).to.emit(
        votingFactory,
        "NewInstance"
      );
    });

    it("should emit an event with the acount address", async () => {
      const tx = await votingFactory.b_A6Q();
      const txReceipt = await tx.wait();
      const from = txReceipt.events[2].args[0];

      await expect(from).to.equal(account.address);
    });
  });
});
