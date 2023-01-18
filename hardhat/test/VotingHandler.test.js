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
      await expect(votingHandler.connect(owner).removedInstance())
        .to.emit(votingHandler, "InstanceRemoved")
        .withArgs(votingHandler.address);
    });

    it("should revert (POV voter1)", async () => {
      const tx = votingHandler.connect(voter1).removedInstance();

      await expect(tx).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should revert: already paused (POV owner)", async () => {
      // Pause the instance
      await votingHandler.connect(owner).removedInstance();

      // Try to pause again the instance
      await expect(
        votingHandler.connect(owner).removedInstance()
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
      await votingHandler.connect(owner).removedInstance();
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

  describe("Reset session", async () => {
    beforeEach(async () => {
      // Add voter1 and voter2 as voters
      await votingHandler.connect(owner).authorized(voter1.address);
      await votingHandler.connect(owner).authorized(voter2.address);
      // Update workflow to VotingSessionEnded
      await votingHandler.connect(owner).startProposalsRegistration();
      await votingHandler.connect(owner).endProposalsRegistration();
      await votingHandler.connect(owner).startVotingSession();
      await votingHandler.connect(owner).endVotingSession();
    });

    it("should reset the votersAddress array (POV owner)", async () => {
      // Update workflow to VotesTallied
      await votingHandler.connect(owner).startTallySession();
      // Delete votersAddress array
      await votingHandler.connect(owner).resetSession();
      // Add voter1 as a voter (should succeed as votersAddress no longer has voter1 registered)
      await expect(votingHandler.connect(owner).authorized(voter1.address))
        .to.emit(votingHandler, "VoterRegistered")
        .withArgs(voter1.address);
    });

    it("should update the workflow to RegisteringVoters (POV owner)", async () => {
      // Update workflow to VotesTallied
      await votingHandler.connect(owner).startTallySession();
      await votingHandler.connect(owner).resetSession();

      expect(await votingHandler.votingStatus()).to.be.equal(0);
    });

    it("should revert (POV voter1)", async () => {
      await expect(
        votingHandler.connect(voter1).resetSession()
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should revert: instance is paused (POV owner)", async () => {
      // Pause the instance
      await votingHandler.connect(owner).removedInstance();
      await expect(
        votingHandler.connect(owner).resetSession()
      ).to.be.revertedWith("Pausable: paused");
    });

    it("should revert: session must be finished to be reseting (POV owner)", async () => {
      await expect(
        votingHandler.connect(owner).resetSession()
      ).to.be.revertedWith("0x03");
    });
  });

  // Reset Proposals
});
