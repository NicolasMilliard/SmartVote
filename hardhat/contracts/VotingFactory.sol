// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "./VotingHandler.sol";

/**
 * @title VotingFactory
 * @author Nicolas Milliard
 * @notice Factory from the VotingHandler Smart Contract
 * @dev Everyone can create an instance of VotingHandler
 */
contract VotingFactory {
    address immutable votingHandlerImplementation;

    mapping(bytes32 => address) public deployedInstances;

    event NewInstance(address indexed _from, address indexed _contract, bytes32 indexed _votingId);

    constructor() {
        votingHandlerImplementation = address(new VotingHandler());
    }

    function b_A6Q() external {
        bytes32 votingId = keccak256(abi.encodePacked(msg.sender, address(this), block.timestamp));
        
        require(deployedInstances[votingId] == address(0), "Instance already exists");

        address clone = Clones.cloneDeterministic(votingHandlerImplementation, votingId);
        VotingHandler(clone).initialize(msg.sender);

        emit NewInstance(msg.sender, clone, votingId);
    }
}