const { expect } = require("chai");
const hre = require("hardhat");

describe("InstancesList", async () => {
  // Variables used through all tests
  let owner;
  let instancesList;

  // Deploy InstancesList and get signer
  beforeEach(async () => {
    // Get signer
    [owner] = await hre.ethers.getSigners();

    const InstancesList = await hre.ethers.getContractFactory("InstancesList");
    instancesList = await InstancesList.deploy();
    await instancesList.deployed();
  });

  describe("b_A6Q (register an instance)", async () => {
    it("should store an instance", async () => {
      // Store the instance
      await instancesList.connect(owner).b_A6Q(instancesList.address);

      // Get the instance array
      expect(await instancesList.connect(owner).getInstancesList()).to.include(
        instancesList.address
      );
    });
  });
});
