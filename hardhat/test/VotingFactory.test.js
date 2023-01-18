const { expect } = require("chai");
const hre = require("hardhat");

describe("VotingFactory", async () => {
  // Variables used through all tests
  let votingFactory;
  let account;

  // Deploy contract and get signer
  beforeEach(async () => {
    const VotingFactory = await hre.ethers.getContractFactory("VotingFactory");
    votingFactory = await VotingFactory.deploy();
    await votingFactory.deployed();
    [account] = await hre.ethers.getSigners();
  });

  describe("b_A6Q (create a new clone)", async () => {
    it("should emit an event", async () => {
      await expect(votingFactory.connect(account).b_A6Q()).to.emit(
        votingFactory,
        "NewInstance"
      );
    });

    it("should emit an event with the acount address", async () => {
      const tx = await votingFactory.b_A6Q();
      const txReceipt = await tx.wait();
      const from = txReceipt.events[2].args[0];

      expect(from).to.be.equal(account.address);
    });
  });
});
