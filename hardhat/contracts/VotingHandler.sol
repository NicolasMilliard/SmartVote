// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";

/**
 * @title Voting
 * @author Nicolas Milliard
 * @notice Voting system with simple majority including features like equality management, reset all proposals, reset session (all voters and all proposals) and avoid duplicate proposals.
 */
contract VotingHandler is Initializable, OwnableUpgradeable, PausableUpgradeable {
    /// @dev Store the id of the winning proposal after tallying votes
    uint winningProposalId;

    /// @notice Store the name of the voting instance
    string public votingSessionName;

    /// @dev Determine if voters can add proposals or not
    bool votersCanAddProposals;

    /// @dev Store the details of each voter in a mapping
    mapping (address => Voter) voters;

    /// @dev Store all votersAddress in an array
    address[] votersAddress;

    /// @dev Store all proposals in an array
    Proposal[] allProposals;

    /// @dev Store all equal proposals in an array
    Proposal[] equalProposals;

    /// @notice Store the current workflow status
    enum WorkflowStatus { RegisteringVoters, ProposalsRegistration, VotingSession, VotesTallied }
    WorkflowStatus public votingStatus;

    /// @dev Store voter's details
    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
    }

    /// @dev Store proposal's details
    struct Proposal {
        string description;
        uint voteCount;
    }
    
    /**
     * @notice Emitted when the instance is paused
     * @param contractAddress Address of the current instance
     */
    event InstanceRemoved(address contractAddress);

    /**
     * @notice Emitted when the instance is renamed
     * @param contractAddress Address of the current instance
     */
    event InstanceRenamed(address indexed contractAddress);

    /**
     * @notice Emitted when a new voter is registered
     * @param voterAddress Address of the new voter
     */
    event VoterRegistered(address indexed voterAddress);

    /**
     * @notice Emitted when voters are allowed to add proposals
     * @param votersCanAddProposals Boolean which represents the authorization
     */
    event VotersAuthorizedToAddProposals(bool votersCanAddProposals);

    /**
     * @notice Emitted when the votingStatus is updated
     * @param previousStatus Represent the previous status
     * @param newStatus Represent the current status
     */
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);

    /**
     * @notice Emitted when a proposal is registered
     * @param proposalId Represent the id of the proposal registered
     */   
    event ProposalRegistered(uint proposalId);

    /**
     * @notice Emitted when a user has voted for a proposal
     * @param voter Address of the voter
     * @param proposalId Id of the voted proposal
     */
    event Voted(address voter, uint proposalId);

    /**
     * @notice Emitted in cas of an equality
     * @param equalProposals Represent the array of all the equal proposals
     */
    event Equality(Proposal[] equalProposals);

    /// @notice Check if the address is whitelisted
    modifier checkVoter {
        require(voters[msg.sender].isRegistered, "0x01");
        _;
    }

    /**
     * @notice Transfer ownership to the address calling the function from VotingFactory
     * @dev VotingHandler is upgradeable so initialize is used instead of a constructor
     */
    function initialize(address _newOwner) external initializer {
        _transferOwnership(_newOwner);
    }

    /**
     * @notice Remove the current voting session (pause it definitively)
     * @dev Only the owner of the contract can call this function when the contract is not paused
     */
    function removeInstance() external onlyOwner whenNotPaused {
        _pause();

        emit InstanceRemoved(address(this));
    }

    /**
     * @notice Name or rename instance
     * @dev Only the owner of the contract can call this function when the contract is not paused
     * @param _votingSessionName is the new name of this instance
     */
    function renameInstance(string calldata _votingSessionName) external onlyOwner whenNotPaused {
        require(keccak256(abi.encode(_votingSessionName)) != keccak256(abi.encode(votingSessionName)) , "0x02");
        votingSessionName = _votingSessionName;

        emit InstanceRenamed(address(this));
    }

    /**
     * @notice Administrator add a voter to the whitelist. A voter can only be authorized once
     * @dev Only the owner of the contract can call this function when the contract is not paused
     * @dev Set isRegistered for the address to true and store this address in votersAddress array
     * @param _address is the address of the Voter who is added by the owner
     */
    function authorize(address _address) public onlyOwner whenNotPaused {
        require(votingStatus == WorkflowStatus.RegisteringVoters, "0x03");
        require(!voters[_address].isRegistered, "0x04");

        voters[_address].isRegistered = true;

        votersAddress.push(_address);

        emit VoterRegistered(_address);
    }

    /**
     * @notice Administrator add multiple voters to the whitelist. A voter can only be authorized once
     * @dev Only the owner of the contract can call this function when the contract is not paused
     * @dev Call authorized() for each value of the array
     * @param _addresses is the array of all addresses of voters who are added by the owner
     */
    function batchAuthorize(address[] calldata _addresses) external onlyOwner whenNotPaused {
        require(votingStatus == WorkflowStatus.RegisteringVoters, "0x03");

        uint length = _addresses.length;
        for(uint i; i < length;) {
            authorize(_addresses[i]);
            // Safely optimize gas cost (i can't be overflow)
            unchecked { i++; }
        }
    }

    /**
     * @notice By default, only Administrator can add proposals. This function allow Voters to add Proposals
     * @dev Only the owner of the contract can call this function when the contract is not paused
     * @param _votersCanAddProposals is used to determine if Voters can add Proposals
     */
    function authorizeVotersToAddProposals(bool _votersCanAddProposals) external onlyOwner whenNotPaused {
        require(votingStatus == WorkflowStatus.RegisteringVoters, "0x05");

        votersCanAddProposals = _votersCanAddProposals;

        emit VotersAuthorizedToAddProposals(votersCanAddProposals);
    }

    /**
     * @notice Administrator starts proposals registration session
     * @dev Only the owner of the contract can call this function when the contract is not paused
     */
    function startProposalsRegistration() external onlyOwner whenNotPaused {
        require(votingStatus == WorkflowStatus.RegisteringVoters, "0x06");
        updateWorkflow(WorkflowStatus.ProposalsRegistration);
    }

    /**
     * @notice Voters can register their proposal
     * @dev Only voters can call this function
     * @dev checkProposals is called to check if this proposals wasn't already be added to allProposals array
     * @dev allProposals array is incremented at each new proposal so allProposals.length - 1 is equal to the index of the right proposal
     * @param _description is necessary to check if the proposal has already been register
     */
    function registerProposal(string calldata _description) external checkVoter whenNotPaused {
        require(votingStatus == WorkflowStatus.ProposalsRegistration, "0x07");

        // If msg.sender is not the owner, we check votersCanAddProposals
        if(msg.sender != owner()) {
            require(votersCanAddProposals == true, "0x08");
        }

        Proposal memory proposal;
        proposal.description = _description;

        checkProposals(proposal.description);

        allProposals.push(proposal);
        
        emit ProposalRegistered(allProposals.length - 1);
    }

    /**
     * @notice Display all proposals for all voters
     * @dev Only voters can call this function
     * @return Proposal[] which contains description and voteCount for each proposal
     */
    function displayProposals() external checkVoter whenNotPaused view returns(Proposal[] memory) {
        return allProposals;
    }

    /** 
     * @notice Administrator starts voting session
     * @dev Only the owner of the contract can call this function when the contract is not paused
     */
    function startVotingSession() external onlyOwner whenNotPaused {
        require(votingStatus == WorkflowStatus.ProposalsRegistration, "0x10");
        updateWorkflow(WorkflowStatus.VotingSession);
    }

    /**
     * @notice Voters can vote for their favorite proposal. A voter can only vote once
     * @dev Only voters can call this function. Voter's vote is registered (votedProposalId)
     * @dev voteCount of the _proposalId is increments by one
     * @param _proposalId is the id of the proposal selected by the Voter
     */
    function vote(uint _proposalId) external checkVoter whenNotPaused {
        require(votingStatus == WorkflowStatus.VotingSession, "0x11");
        require(!voters[msg.sender].hasVoted, "0x12");

        voters[msg.sender].hasVoted = true;
        voters[msg.sender].votedProposalId = _proposalId;

        // ++X costs less gas than X++
        ++allProposals[_proposalId].voteCount;

        emit Voted(msg.sender, _proposalId);
    }

    /**
     * @notice Administrator starts tally session
     * @dev Only the owner of the contract can call this function when the contract is not paused
     */
    function startTallySession() external onlyOwner whenNotPaused {
        require(votingStatus == WorkflowStatus.VotingSession, "0x14");
        updateWorkflow(WorkflowStatus.VotesTallied);
    }

    /** 
     * @notice Administrator tally votes
     * @dev Only the owner of the contract can call this function when the contract is not paused
     * @dev Call getHighestVoteCount function. Compare all voteCount of each proposals and store proposals with an equal voteCount in a new array (equalProposals)
     * @dev If there is no equality, winningProposalId is set
     */
    function tallyVotes() external onlyOwner whenNotPaused {
        require(votingStatus == WorkflowStatus.VotesTallied, "0x15");
        
        uint highestNumber = getHighestVoteCount();

        uint allProposalsLength = allProposals.length;
        for(uint i; i < allProposalsLength;) {
            if(allProposals[i].voteCount == highestNumber) {
                winningProposalId = i;
                equalProposals.push(Proposal(allProposals[i].description, 0));
            }
            // Safely optimize gas cost (i can't be overflow)
            unchecked { i++; }
        }
        
        // If there is an equality: equalProposals.length must contains at least 2 proposals
        if(equalProposals.length > 1) {
            emit Equality(equalProposals);

            delete allProposals;

            /// @dev Save equalProposals into allProposals
            uint equalProposalsLength = equalProposals.length; 
            for(uint i; i < equalProposalsLength;) {
                allProposals.push(Proposal(equalProposals[i].description, 0));
                // Safely optimize gas cost (i can't be overflow)
                unchecked { i++; }
            }
            
            delete equalProposals;

            /// @dev Reset all hasVoted and votedProposalId for all voters
            uint votersAddressLength = votersAddress.length; 
            for(uint i; i < votersAddressLength;) {
                voters[votersAddress[i]].hasVoted = false;
                voters[votersAddress[i]].votedProposalId = 0;
                // Safely optimize gas cost (i can't be overflow)
                unchecked { i++; }
            }

            // Restart voting session with equal proposals         
            updateWorkflow(WorkflowStatus.VotingSession);
        }
    }

    /**
     * @notice A voter can check the vote of another voter
     * @dev Only voters can call this function
     * @dev Function revert if the target voter hasn't voted yet
     * @param _address is the address of a Voter to get his vote
     * @return votedProposalId
     */
    function getSpecificVote(address _address) external checkVoter whenNotPaused view returns(uint) {
        require(voters[_address].hasVoted == true, "0x16");

        return voters[_address].votedProposalId;
    }

    /**
     * @notice Everyone can check the winner's proposal details
     * @return winning proposal's description
     */
    function getWinner() external whenNotPaused view returns(string memory) {
        require(votingStatus == WorkflowStatus.VotesTallied, "0x17");
        return allProposals[winningProposalId].description;
    }

    /**
     * @notice Update the Workflow status
     * @param _newStatus is the next status of the WorkflowStatus
     */
    function updateWorkflow(WorkflowStatus _newStatus) private {
        WorkflowStatus previousStatus = votingStatus;
        votingStatus = _newStatus;

        emit WorkflowStatusChange(previousStatus, votingStatus);
    }

    /**
     * @dev Called by registerProposals. Revert if keccak256 of two descriptions are equal
     * @param _description is the description of a new proposal suggested by a Voter
     */
    function checkProposals(string memory _description) private whenNotPaused view {
        uint allProposalsLength = allProposals.length; 
        for(uint i; i < allProposalsLength;) {
            require(keccak256(abi.encode(_description)) != keccak256(abi.encode(allProposals[i].description)), "0x18");
            // Safely optimize gas cost (i can't be overflow)
            unchecked { i++; }
        }
    }

    /**
     * @dev Called by tallyVotes
     * @return highestNumber voteCount number for a proposal
     */
    function getHighestVoteCount() private whenNotPaused view returns(uint highestNumber) {
        uint allProposalsLength = allProposals.length; 
        for(uint i; i < allProposalsLength;) {
            if(allProposals[i].voteCount > highestNumber) {
                highestNumber = allProposals[i].voteCount;
            }
            // Safely optimize gas cost (i can't be overflow)
            unchecked { i++; }
        }
        return highestNumber;
    }
}