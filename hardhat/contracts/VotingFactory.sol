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

    event NewInstance(address indexed _from, address indexed _contract);

    constructor() {
        votingHandlerImplementation = address(new VotingHandler());
    }

    function b_A6Q() external {
        address clone = Clones.clone(votingHandlerImplementation);
        VotingHandler(clone).initialize(msg.sender);

        emit NewInstance(msg.sender, clone);
    }
}