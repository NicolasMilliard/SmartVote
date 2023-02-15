const { expect } = require("chai");
const hre = require("hardhat");

describe("InstancesList", async () => {
  // Variables used through all tests
  let owner;
  let contract1;
  let contract2;
  let instancesList;
  const zeroAddress = hre.ethers.constants.AddressZero;

  // Deploy InstancesList and get signer
  beforeEach(async () => {
    // Get signer
    [owner, contract1, contract2] = await hre.ethers.getSigners();

    const InstancesList = await hre.ethers.getContractFactory("InstancesList");
    instancesList = await InstancesList.deploy();
    await instancesList.deployed();
  });

  describe("b_A6Q (register an instance)", async () => {
    it("should store an instance", async () => {
      // Store the instance
      await instancesList.connect(owner).b_A6Q(contract1.address);

      // Get the instance array
      expect(await instancesList.connect(owner).getInstancesList()).to.include(
        contract1.address
      );
    });

    it("should store multiple instances", async () => {
      // Store the first instance
      await instancesList.connect(owner).b_A6Q(contract1.address);

      // Store the second instance
      await instancesList.connect(owner).b_A6Q(contract2.address);

      // Get the instance array (contract1)
      expect(await instancesList.connect(owner).getInstancesList()).to.include(
        contract1.address
      );

      // Get the instance array (contract2)
      expect(await instancesList.connect(owner).getInstancesList()).to.include(
        contract2.address
      );
    });

    it("should store instance after a removing", async () => {
      // Store the first instance
      await instancesList.connect(owner).b_A6Q(contract1.address);

      // Store the second instance
      await instancesList.connect(owner).b_A6Q(contract2.address);

      // Remove the first instance
      await instancesList.connect(owner).removeInstance(contract1.address);

      // Get the instance array (zeroAddress)
      expect(await instancesList.connect(owner).getInstancesList()).to.include(
        zeroAddress
      );

      // Store the first instance again
      await instancesList.connect(owner).b_A6Q(contract1.address);

      // Get the instance array (zeroAddress must be replace with contract1)
      expect(
        await instancesList.connect(owner).getInstancesList()
      ).to.not.include(zeroAddress);
    });

    it("should revert: instance is already store", async () => {
      // Store the instance
      await instancesList.connect(owner).b_A6Q(contract1.address);

      // Try to store the same instance twice
      await expect(
        instancesList.connect(owner).b_A6Q(contract1.address)
      ).to.be.revertedWith("0x19");
    });
  });

  describe("removeInstance", async () => {
    it("should remove the first instance", async () => {
      // Store the instance
      await instancesList.connect(owner).b_A6Q(contract1.address);

      // Remove the instance
      await instancesList.connect(owner).removeInstance(contract1.address);

      // Get the instance array
      expect(await instancesList.connect(owner).getInstancesList()).to.include(
        zeroAddress
      );
    });

    it("should remove the second instance", async () => {
      // Store two instances
      await instancesList.connect(owner).b_A6Q(contract1.address);
      await instancesList.connect(owner).b_A6Q(contract2.address);

      // Remove the second instance
      await instancesList.connect(owner).removeInstance(contract2.address);

      // Get the instance array
      expect(await instancesList.connect(owner).getInstancesList()).to.include(
        zeroAddress
      );
    });

    it("should revert: array is empty", async () => {
      await expect(
        instancesList.connect(owner).removeInstance(contract1.address)
      ).to.be.revertedWith("0x20");
    });
  });
});
