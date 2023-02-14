// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "./VotingHandler.sol";

/**
 * @title VotingFactory
 * @author Nicolas Milliard
 * @notice Factory of the VotingHandler Smart Contract
 * @dev Everyone can create an instance of VotingHandler
 */
contract VotingFactory {
    /// @dev Store the instance model address of VotingHandler
    address immutable votingHandlerImplementation;

    /**
     * @notice Emitted when a new instance of VotingHandler has been created
     * @param _from The address of the caller
     * @param _contract The address where the new instance has been deployed
     */
    event NewInstance(address indexed _from, address indexed _contract);

    /**
     * @notice Create the instance model of VotingHandler
     * @dev Create the instance model of VotingHandler and store its address
     */
    constructor() {
        votingHandlerImplementation = address(new VotingHandler());
    }

    /**
     * @notice Create a new instance of VotingHandler and initialize it with the caller address
     * @dev The new instance is created using the Clones library from OpenZeppelin and the VotingHandler Smart Contract
     * @dev The initialize function of the VotingHandler Smart Contract is then called to set the owner of the new instance
     * @dev The address of the new instance is then emitted in the NewInstance event
     */
    function b_A6Q() external {
        address clone = Clones.clone(votingHandlerImplementation);
        VotingHandler(clone).initialize(msg.sender);

        emit NewInstance(msg.sender, clone);
    }
}