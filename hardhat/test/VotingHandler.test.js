const { expect } = require("chai");
const hre = require("hardhat");

describe("VotingHandler", async () => {
  // Variables used through all tests
  let owner;
  let voter1;
  let voter2;
  let nonVoter;
  let votingHandler;

  // Deploy VotingHandler and get signers
  beforeEach(async () => {
    // Get signers
    [owner, voter1, voter2, nonVoter] = await hre.ethers.getSigners();

    const VotingHandler = await hre.ethers.getContractFactory("VotingHandler");
    // Initialize owner
    votingHandler = await hre.upgrades.deployProxy(VotingHandler, [
      owner.address,
    ]);
    await votingHandler.deployed();
  });

  describe("Test initialize", async () => {
    it("should set owner address (POV owner)", async () => {
      const tx = await votingHandler.owner();
      expect(tx).to.be.equal(owner.address);
    });
  });

  describe("Remove instance", async () => {
    it("should pause the instance (POV owner)", async () => {
      await expect(votingHandler.connect(owner).removeInstance())
        .to.emit(votingHandler, "InstanceRemoved")
        .withArgs(votingHandler.address);
    });

    it("should revert (POV voter1)", async () => {
      const tx = votingHandler.connect(voter1).removeInstance();

      await expect(tx).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should revert: already paused (POV owner)", async () => {
      // Pause the instance
      await votingHandler.connect(owner).removeInstance();

      // Try to pause again the instance
      await expect(
        votingHandler.connect(owner).removeInstance()
      ).to.be.revertedWith("Pausable: paused");
    });
  });

  describe("Rename instance", async () => {
    it("should rename the instance (POV owner)", async () => {
      const newName = "New name";
      // Rename the instance
      await votingHandler.connect(owner).renameInstance(newName);

      // Get the new name
      expect(await votingHandler.votingSessionName()).to.be.equal(newName);
    });

    it("should emit an event (POV owner)", async () => {
      const newName = "New name";
      await expect(votingHandler.connect(owner).renameInstance(newName))
        .to.emit(votingHandler, "InstanceRenamed")
        .withArgs(votingHandler.address);
    });

    it("should revert (POV voter1)", async () => {
      const newName = "New name";
      // Rename the instance
      await expect(
        votingHandler.connect(voter1).renameInstance(newName)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should revert: instance is paused (POV owner)", async () => {
      const newName = "New name";
      // Pause the instance
      await votingHandler.connect(owner).removeInstance();
      await expect(
        votingHandler.connect(owner).renameInstance(newName)
      ).to.be.revertedWith("Pausable: paused");
    });

    it("should revert: new name is the same as the previous one (POV owner)", async () => {
      const newName = "New name";
      await votingHandler.connect(owner).renameInstance(newName);
      // Rename the instance with same name
      await expect(
        votingHandler.connect(owner).renameInstance(newName)
      ).to.be.revertedWith("0x02");
    });
  });

  describe("Authorize", async () => {
    it("should authorize voter1 as a voter (POV owner)", async () => {
      await expect(votingHandler.connect(owner).authorize(voter1.address))
        .to.emit(votingHandler, "VoterRegistered")
        .withArgs(voter1.address);
    });

    it("should revert (POV voter1)", async () => {
      await expect(
        votingHandler.connect(voter1).authorize(voter1.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should revert: instance is paused (POV owner)", async () => {
      // Pause the instance
      await votingHandler.connect(owner).removeInstance();
      await expect(
        votingHandler.connect(owner).authorize(voter1.address)
      ).to.be.revertedWith("Pausable: paused");
    });

    it("should revert: votingStatus is not RegisteringVoters (POV owner)", async () => {
      await votingHandler.connect(owner).startProposalsRegistration();
      await expect(
        votingHandler.connect(owner).authorize(voter1.address)
      ).to.be.revertedWith("0x05");
    });

    it("should revert: voter1 is already registered (POV owner)", async () => {
      await votingHandler.connect(owner).authorize(voter1.address);
      await expect(
        votingHandler.connect(owner).authorize(voter1.address)
      ).to.be.revertedWith("0x06");
    });
  });

  describe("Batch authorize", async () => {
    it("should authorize voter1 and voter2 as voters (POV owner)", async () => {
      await votingHandler
        .connect(owner)
        .batchAuthorize([voter1.address, voter2.address]);
      // Must revert if voter1 was properly added
      await expect(
        votingHandler.connect(owner).authorize(voter1.address)
      ).to.be.revertedWith("0x06");
      // Must revert if voter2 was properly added
      await expect(
        votingHandler.connect(owner).authorize(voter2.address)
      ).to.be.revertedWith("0x06");
    });

    it("should revert (POV voter1)", async () => {
      await expect(
        votingHandler
          .connect(voter1)
          .batchAuthorize([voter1.address, voter2.address])
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should revert: instance is paused (POV owner)", async () => {
      // Pause the instance
      await votingHandler.connect(owner).removeInstance();
      await expect(
        votingHandler
          .connect(owner)
          .batchAuthorize([voter1.address, voter2.address])
      ).to.be.revertedWith("Pausable: paused");
    });

    it("should revert: votingStatus is not RegisteringVoters (POV owner)", async () => {
      await votingHandler.connect(owner).startProposalsRegistration();
      await expect(
        votingHandler
          .connect(owner)
          .batchAuthorize([voter1.address, voter2.address])
      ).to.be.revertedWith("0x05");
    });

    it("should revert: voter1 is already registered (POV owner)", async () => {
      await votingHandler
        .connect(owner)
        .batchAuthorize([voter1.address, voter2.address]);
      await expect(
        votingHandler
          .connect(owner)
          .batchAuthorize([voter1.address, voter2.address])
      ).to.be.revertedWith("0x06");
    });
  });
});
