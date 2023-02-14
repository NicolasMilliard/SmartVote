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
    it("should set owner address during initialize (POV owner)", async () => {
      expect(await votingHandler.connect(owner).owner()).to.be.equal(
        owner.address
      );
    });

    it("should revert: try to init a second time (POV owner)", async () => {
      await expect(
        votingHandler.connect(owner).initialize(owner.address)
      ).to.be.revertedWith("Initializable: contract is already initialized");
    });
  });

  describe("Remove instance", async () => {
    it("should pause the instance (POV owner)", async () => {
      await expect(votingHandler.connect(owner).removeInstance())
        .to.emit(votingHandler, "InstanceRemoved")
        .withArgs(votingHandler.address);
    });

    it("should revert (POV voter1)", async () => {
      await expect(
        votingHandler.connect(voter1).removeInstance()
      ).to.be.revertedWith("Ownable: caller is not the owner");
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
      ).to.be.revertedWith("0x03");
    });

    it("should revert: voter1 is already registered (POV owner)", async () => {
      await votingHandler.connect(owner).authorize(voter1.address);
      await expect(
        votingHandler.connect(owner).authorize(voter1.address)
      ).to.be.revertedWith("0x04");
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
      ).to.be.revertedWith("0x04");
      // Must revert if voter2 was properly added
      await expect(
        votingHandler.connect(owner).authorize(voter2.address)
      ).to.be.revertedWith("0x04");
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
      ).to.be.revertedWith("0x03");
    });

    it("should revert: voter1 is already registered (POV owner)", async () => {
      await votingHandler
        .connect(owner)
        .batchAuthorize([voter1.address, voter2.address]);
      await expect(
        votingHandler
          .connect(owner)
          .batchAuthorize([voter1.address, voter2.address])
      ).to.be.revertedWith("0x04");
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
      ).to.be.revertedWith("0x05");
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
      ).to.be.revertedWith("0x06");
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
      // Voter1 add a proposal
      await expect(votingHandler.connect(voter1).registerProposal(description))
        .to.emit(votingHandler, "ProposalRegistered")
        .withArgs(0);
    });

    it("should revert: caller is not a voter (POV nonVoter)", async () => {
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
      ).to.be.revertedWith("0x07");
    });

    it("should revert: voters can't add proposals (POV voter1)", async () => {
      const description = "Proposal description";
      // Update workflow status
      await votingHandler.connect(owner).startProposalsRegistration();
      await expect(
        votingHandler.connect(voter1).registerProposal(description)
      ).to.be.revertedWith("0x08");
    });

    it("should revert: proposal already submitted (POV owner)", async () => {
      const description = "Proposal description";
      // Update workflow status
      await votingHandler.connect(owner).startProposalsRegistration();
      votingHandler.connect(owner).registerProposal(description);
      // Add same proposal a second time
      await expect(
        votingHandler.connect(owner).registerProposal(description)
      ).to.be.revertedWith("0x18");
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
      ).to.be.revertedWith("0x09");
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

    it("should revert: caller is not a voter (POV nonVoter)", async () => {
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
      ).to.be.revertedWith("0x10");
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

    it("should revert: caller is not a voter (POV nonVoter)", async () => {
      // Update workflow status
      await votingHandler.connect(owner).startVotingSession();
      await expect(votingHandler.connect(nonVoter).vote(0)).to.be.revertedWith(
        "0x01"
      );
    });

    it("should revert: already paused (POV owner)", async () => {
      // Pause the instance
      await votingHandler.connect(owner).removeInstance();
      await expect(votingHandler.connect(voter1).vote(0)).to.be.revertedWith(
        "Pausable: paused"
      );
    });

    it("should revert: workflow status is not VotingSessionStarted (POV owner)", async () => {
      await expect(votingHandler.connect(voter1).vote(0)).to.be.revertedWith(
        "0x11"
      );
    });

    it("should revert: voter has already voted once (POV voter1)", async () => {
      // Update workflow status
      await votingHandler.connect(owner).startVotingSession();
      await votingHandler.connect(voter1).vote(0);
      await expect(votingHandler.connect(voter1).vote(0)).to.be.revertedWith(
        "0x12"
      );
    });
  });

  describe("End voting session", async () => {
    beforeEach(async () => {
      // Update workflow status
      await votingHandler.connect(owner).startProposalsRegistration();
      await votingHandler.connect(owner).endProposalsRegistration();
      await votingHandler.connect(owner).startVotingSession();
    });

    it("should update workflow to VotingSessionEnded", async () => {
      await expect(votingHandler.connect(owner).endVotingSession())
        .to.emit(votingHandler, "WorkflowStatusChange")
        .withArgs(3, 4);
    });

    it("should revert (POV voter1)", async () => {
      await expect(
        votingHandler.connect(voter1).endVotingSession()
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should revert: instance is paused (POV owner)", async () => {
      // Pause the instance
      await votingHandler.connect(owner).removeInstance();
      await expect(
        votingHandler.connect(owner).endVotingSession()
      ).to.be.revertedWith("Pausable: paused");
    });

    it("should revert: workflow status is already VotingSessionEnded (POV owner)", async () => {
      await votingHandler.connect(owner).endVotingSession();
      await expect(
        votingHandler.connect(owner).endVotingSession()
      ).to.be.revertedWith("0x13");
    });
  });

  describe("Start tally session", async () => {
    beforeEach(async () => {
      // Update workflow status
      await votingHandler.connect(owner).startProposalsRegistration();
      await votingHandler.connect(owner).endProposalsRegistration();
      await votingHandler.connect(owner).startVotingSession();
      await votingHandler.connect(owner).endVotingSession();
    });

    it("should update workflow to VotesTallied", async () => {
      await expect(votingHandler.connect(owner).startTallySession())
        .to.emit(votingHandler, "WorkflowStatusChange")
        .withArgs(4, 5);
    });

    it("should revert (POV voter1)", async () => {
      await expect(
        votingHandler.connect(voter1).startTallySession()
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should revert: instance is paused (POV owner)", async () => {
      // Pause the instance
      await votingHandler.connect(owner).removeInstance();
      await expect(
        votingHandler.connect(owner).startTallySession()
      ).to.be.revertedWith("Pausable: paused");
    });

    it("should revert: workflow status is already VotingSessionEnded (POV owner)", async () => {
      await votingHandler.connect(owner).startTallySession();
      await expect(
        votingHandler.connect(owner).startTallySession()
      ).to.be.revertedWith("0x14");
    });
  });

  describe("Tally votes", async () => {
    beforeEach(async () => {
      // Register voter1 and voter2 as voters
      await votingHandler
        .connect(owner)
        .batchAuthorize([voter1.address, voter2.address]);
      // Allow voters to add proposals
      await votingHandler.connect(owner).authorizeVotersToAddProposals(true);
      // Update workflow status
      await votingHandler.connect(owner).startProposalsRegistration();
      // Register proposals
      await votingHandler.connect(voter1).registerProposal("Proposal 1");
      await votingHandler.connect(voter2).registerProposal("Proposal 2");
      // Update workflow status
      await votingHandler.connect(owner).endProposalsRegistration();
      await votingHandler.connect(owner).startVotingSession();
    });

    it("should get winner (POV owner)", async () => {
      const description = "Proposal 1";
      // Voters vote for a proposal
      await votingHandler.connect(voter1).vote(0);
      await votingHandler.connect(voter2).vote(0);
      // Update workflow status
      await votingHandler.connect(owner).endVotingSession();
      await votingHandler.connect(owner).startTallySession();
      // Tally votes
      await votingHandler.connect(owner).tallyVotes();
      // Get winner
      expect(await votingHandler.connect(owner).getWinner()).to.be.equal(
        description
      );
    });

    it("should detect an equality and store the proposals concerned (POV owner)", async () => {
      // Voters vote for two proposals
      await votingHandler.connect(voter1).vote(0);
      await votingHandler.connect(voter2).vote(1);
      // Update workflow status
      await votingHandler.connect(owner).endVotingSession();
      await votingHandler.connect(owner).startTallySession();
      // Tally votes
      await votingHandler.connect(owner).tallyVotes();

      // Proposals array must be updated
      const tx = await votingHandler.connect(voter1).displayProposals();

      for (i = 0; i < 2; i++) {
        expect(tx[i][0]).to.be.equal("Proposal " + (i + 1));
        expect(tx[i][1]).to.be.equal(0);
      }
    });

    it("should start a second tour (POV owner)", async () => {
      // Voters vote for two proposals
      await votingHandler.connect(voter1).vote(0);
      await votingHandler.connect(voter2).vote(1);
      // Update workflow status
      await votingHandler.connect(owner).endVotingSession();
      await votingHandler.connect(owner).startTallySession();
      // Tally votes
      await expect(votingHandler.connect(owner).tallyVotes())
        .to.emit(votingHandler, "WorkflowStatusChange")
        .withArgs(5, 3);
    });

    it("should get winner after a second tour (POV owner)", async () => {
      const description = "Proposal 1";
      // Voters vote for two proposals
      await votingHandler.connect(voter1).vote(0);
      await votingHandler.connect(voter2).vote(1);
      // Update workflow status
      await votingHandler.connect(owner).endVotingSession();
      await votingHandler.connect(owner).startTallySession();
      // Tally votes
      await votingHandler.connect(owner).tallyVotes();
      // Second tour
      await votingHandler.connect(voter1).vote(0);
      await votingHandler.connect(voter2).vote(0);
      // Update workflow status
      await votingHandler.connect(owner).endVotingSession();
      await votingHandler.connect(owner).startTallySession();
      // Tally votes
      await votingHandler.connect(owner).tallyVotes();
      // Get winner
      expect(await votingHandler.connect(owner).getWinner()).to.be.equal(
        description
      );
    });

    it("should revert (POV voter1)", async () => {
      await expect(
        votingHandler.connect(voter1).tallyVotes()
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should revert: instance is paused (POV owner)", async () => {
      // Pause the instance
      await votingHandler.connect(owner).removeInstance();
      await expect(
        votingHandler.connect(owner).tallyVotes()
      ).to.be.revertedWith("Pausable: paused");
    });

    it("should revert: workflow status is not VotesTallied (POV owner)", async () => {
      await expect(
        votingHandler.connect(owner).tallyVotes()
      ).to.be.revertedWith("0x15");
    });
  });

  describe("Get a specific vote", async () => {
    beforeEach(async () => {
      // Register voter1
      await votingHandler.connect(owner).authorize(voter1.address);
      // Allow voters to add proposals
      await votingHandler.connect(owner).authorizeVotersToAddProposals(true);
      // Update workflow status
      await votingHandler.connect(owner).startProposalsRegistration();
      // Register proposals
      await votingHandler.connect(voter1).registerProposal("Proposal 1");
      // Update workflow status
      await votingHandler.connect(owner).endProposalsRegistration();
      await votingHandler.connect(owner).startVotingSession();
      // Vote for a proposal
      await votingHandler.connect(voter1).vote(0);
    });

    it("should get the proposal id voted by voter1", async () => {
      expect(
        await votingHandler.connect(voter1).getSpecificVote(voter1.address)
      ).to.be.equal(0);
    });

    it("should revert: caller is not a voter (POV nonVoter)", async () => {
      await expect(
        votingHandler.connect(nonVoter).getSpecificVote(voter1.address)
      ).to.be.revertedWith("0x01");
    });

    it("should revert: instance is paused (POV voter1)", async () => {
      // Pause the instance
      await votingHandler.connect(owner).removeInstance();
      await expect(
        votingHandler.connect(voter1).getSpecificVote(voter1.address)
      ).to.be.revertedWith("Pausable: paused");
    });

    it("should revert: voter2 has not voted (POV voter1)", async () => {
      await expect(
        votingHandler.connect(voter1).getSpecificVote(voter2.address)
      ).to.be.revertedWith("0x16");
    });
  });

  describe("Get winner", async () => {
    beforeEach(async () => {
      // Register voter1
      await votingHandler.connect(owner).authorize(voter1.address);
      // Allow voters to add proposals
      await votingHandler.connect(owner).authorizeVotersToAddProposals(true);
      // Update workflow status
      await votingHandler.connect(owner).startProposalsRegistration();
      // Register proposals
      await votingHandler.connect(voter1).registerProposal("Proposal 1");
      // Update workflow status
      await votingHandler.connect(owner).endProposalsRegistration();
      await votingHandler.connect(owner).startVotingSession();
      // Vote for a proposal
      await votingHandler.connect(voter1).vote(0);
      // Update workflow status
      await votingHandler.connect(owner).endVotingSession();
    });

    it("should get winner description (POV owner)", async () => {
      // Update workflow status
      await votingHandler.connect(owner).startTallySession();
      // Tally votes
      await votingHandler.connect(owner).tallyVotes();
      // Get winner
      expect(await votingHandler.connect(owner).getWinner()).to.be.equal(
        "Proposal 1"
      );
    });

    it("should revert: instance is paused (POV owner)", async () => {
      // Pause the instance
      await votingHandler.connect(owner).removeInstance();
      await expect(votingHandler.connect(owner).getWinner()).to.be.revertedWith(
        "Pausable: paused"
      );
    });

    it("should revert: workflow status is not VotesTallied (POV owner)", async () => {
      await expect(votingHandler.connect(owner).getWinner()).to.be.revertedWith(
        "0x17"
      );
    });
  });
});
