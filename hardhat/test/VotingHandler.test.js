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
      // Update workflow status
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
      // Update workflow status
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

  describe("Authorize voters to add proposals", async () => {
    it("should authorize all voters to add proposals (POV owner)", async () => {
      const permission = true;
      await expect(
        votingHandler.connect(owner).authorizeVotersToAddProposals(permission)
      )
        .to.emit(votingHandler, "VotersAuthorizedToAddProposals")
        .withArgs(permission);
    });

    it("should revert (POV voter1)", async () => {
      const permission = true;
      await expect(
        votingHandler.connect(voter1).authorizeVotersToAddProposals(permission)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should revert: instance is paused (POV owner)", async () => {
      const permission = true;
      // Pause the instance
      await votingHandler.connect(owner).removeInstance();
      await expect(
        votingHandler.connect(owner).authorizeVotersToAddProposals(permission)
      ).to.be.revertedWith("Pausable: paused");
    });

    it("should revert: votingStatus is not RegisteringVoters (POV owner)", async () => {
      const permission = true;
      // Update workflow status
      await votingHandler.connect(owner).startProposalsRegistration();
      await expect(
        votingHandler.connect(owner).authorizeVotersToAddProposals(permission)
      ).to.be.revertedWith("0x07");
    });
  });

  describe("Start proposals registration", async () => {
    it("should update workflow to ProposalsRegistrationStarted", async () => {
      await expect(votingHandler.connect(owner).startProposalsRegistration())
        .to.emit(votingHandler, "WorkflowStatusChange")
        .withArgs(0, 1);
    });

    it("should revert (POV voter1)", async () => {
      await expect(
        votingHandler.connect(voter1).startProposalsRegistration()
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should revert: instance is paused (POV owner)", async () => {
      // Pause the instance
      await votingHandler.connect(owner).removeInstance();
      await expect(
        votingHandler.connect(owner).startProposalsRegistration()
      ).to.be.revertedWith("Pausable: paused");
    });

    it("should revert: workflow status is already ProposalsRegistrationStarted (POV owner)", async () => {
      // Update workflow status
      await votingHandler.connect(owner).startProposalsRegistration();
      await expect(
        votingHandler.connect(owner).startProposalsRegistration()
      ).to.be.revertedWith("0x08");
    });
  });

  describe("Register a proposal", async () => {
    beforeEach(async () => {
      await votingHandler.connect(owner).authorize(owner.address);
      await votingHandler.connect(owner).authorize(voter1.address);
    });

    it("should register a proposal (POV owner)", async () => {
      const description = "Proposal description";
      // Update workflow status
      await votingHandler.connect(owner).startProposalsRegistration();
      // Owner add a proposal
      await expect(votingHandler.connect(owner).registerProposal(description))
        .to.emit(votingHandler, "ProposalRegistered")
        .withArgs(0);
    });

    it("should register a proposal (POV voter1)", async () => {
      const description = "Proposal description";
      // Authorize voters to add proposals
      await votingHandler.connect(owner).authorizeVotersToAddProposals(true);
      // Update workflow status
      await votingHandler.connect(owner).startProposalsRegistration();
      // Owner add a proposal
      await expect(votingHandler.connect(owner).registerProposal(description))
        .to.emit(votingHandler, "ProposalRegistered")
        .withArgs(0);
    });

    it("should revert (POV nonVoter)", async () => {
      const description = "Proposal description";
      await expect(
        votingHandler.connect(nonVoter).registerProposal(description)
      ).to.be.revertedWith("0x01");
    });

    it("should revert: instance is paused (POV owner)", async () => {
      const description = "Proposal description";
      // Pause the instance
      await votingHandler.connect(owner).removeInstance();
      await expect(
        votingHandler.connect(owner).registerProposal(description)
      ).to.be.revertedWith("Pausable: paused");
    });

    it("should revert: workflow status is already ProposalsRegistrationStarted (POV owner)", async () => {
      const description = "Proposal description";
      await expect(
        votingHandler.connect(owner).registerProposal(description)
      ).to.be.revertedWith("0x09");
    });
  });

  describe("End proposals registration", async () => {
    it("should update workflow to ProposalsRegistrationEnded", async () => {
      // Update workflow status
      await votingHandler.connect(owner).startProposalsRegistration();
      await expect(votingHandler.connect(owner).endProposalsRegistration())
        .to.emit(votingHandler, "WorkflowStatusChange")
        .withArgs(1, 2);
    });

    it("should revert (POV voter1)", async () => {
      await expect(
        votingHandler.connect(voter1).endProposalsRegistration()
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should revert: instance is paused (POV owner)", async () => {
      // Pause the instance
      await votingHandler.connect(owner).removeInstance();
      await expect(
        votingHandler.connect(owner).endProposalsRegistration()
      ).to.be.revertedWith("Pausable: paused");
    });

    it("should revert: workflow status is already ProposalsRegistrationEnded (POV owner)", async () => {
      // Update workflow status
      await votingHandler.connect(owner).startProposalsRegistration();
      await votingHandler.connect(owner).endProposalsRegistration();
      await expect(
        votingHandler.connect(owner).endProposalsRegistration()
      ).to.be.revertedWith("0x11");
    });
  });

  describe("Display all Proposals", async () => {
    beforeEach(async () => {
      // Add voter1 as a voter
      await votingHandler.connect(owner).authorize(voter1.address);
      // Allow voters to add proposals
      await votingHandler.connect(owner).authorizeVotersToAddProposals(true);
      // Add a proposal
      const description = "Proposal 1";
      await votingHandler.connect(owner).startProposalsRegistration();
      await votingHandler.connect(voter1).registerProposal(description);
    });

    it("should return all proposals details (POV voter1 - Single proposal)", async () => {
      const description = "Proposal 1";
      const tx = await votingHandler.connect(voter1).displayProposals();

      expect(tx[0][0]).to.be.equal(description);
      expect(tx[0][1]).to.be.equal(0);
    });

    it("should return all proposals details (POV voter1 - Multiple proposals)", async () => {
      const description = "Proposal 2";
      await votingHandler.connect(voter1).registerProposal(description);

      const tx = await votingHandler.connect(voter1).displayProposals();

      for (i = 0; i < 2; i++) {
        expect(tx[i][0]).to.be.equal("Proposal " + (i + 1));
        expect(tx[i][1]).to.be.equal(0);
      }
    });

    it("should revert (POV nonVoter)", async () => {
      await expect(
        votingHandler.connect(nonVoter).displayProposals()
      ).to.be.revertedWith("0x01");
    });

    it("should revert: instance is paused (POV voter1)", async () => {
      // Pause the instance
      await votingHandler.connect(owner).removeInstance();
      await expect(
        votingHandler.connect(voter1).displayProposals()
      ).to.be.revertedWith("Pausable: paused");
    });
  });

  describe("Start voting session", async () => {
    beforeEach(async () => {
      // Update workflow status
      await votingHandler.connect(owner).startProposalsRegistration();
      await votingHandler.connect(owner).endProposalsRegistration();
    });

    it("should update workflow to VotingSessionStarted", async () => {
      await expect(votingHandler.connect(owner).startVotingSession())
        .to.emit(votingHandler, "WorkflowStatusChange")
        .withArgs(2, 3);
    });

    it("should revert (POV voter1)", async () => {
      await expect(
        votingHandler.connect(voter1).startVotingSession()
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should revert: instance is paused (POV owner)", async () => {
      // Pause the instance
      await votingHandler.connect(owner).removeInstance();
      await expect(
        votingHandler.connect(owner).startVotingSession()
      ).to.be.revertedWith("Pausable: paused");
    });

    it("should revert: workflow status is already ProposalsRegistrationEnded (POV owner)", async () => {
      await votingHandler.connect(owner).startVotingSession();
      await expect(
        votingHandler.connect(owner).startVotingSession()
      ).to.be.revertedWith("0x12");
    });
  });

  describe("Vote", async () => {
    beforeEach(async () => {
      // Add voter1 as a voter
      await votingHandler.connect(owner).authorize(voter1.address);
      // Authorize voters to add proposals
      await votingHandler.connect(owner).authorizeVotersToAddProposals(true);
      // Update workflow status
      await votingHandler.connect(owner).startProposalsRegistration();
      // Add a proposal
      await votingHandler.connect(voter1).registerProposal("Proposal");
      // Update workflow status
      await votingHandler.connect(owner).endProposalsRegistration();
    });

    it("should vote for a proposal", async () => {
      // Update workflow status
      await votingHandler.connect(owner).startVotingSession();
      await expect(votingHandler.connect(voter1).vote(0))
        .to.emit(votingHandler, "Voted")
        .withArgs(voter1.address, 0);
    });

    it("should revert (POV nonVoter)", async () => {
      // Update workflow status
      await votingHandler.connect(owner).startVotingSession();
      const tx = votingHandler.connect(nonVoter).vote(0);
      await expect(tx).to.be.revertedWith("0x01");
    });

    it("should revert: already paused (POV owner)", async () => {
      // Pause the instance
      await votingHandler.connect(owner).removeInstance();
      await expect(votingHandler.connect(voter1).vote(0)).to.be.revertedWith(
        "Pausable: paused"
      );
    });
  });
});
