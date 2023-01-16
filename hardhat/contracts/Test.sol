// SPDX-License-Identifier: Unlicensed

pragma solidity 0.8.17;

contract Test {
    string message;

    constructor() {
        message = "Hello World";
    }

    function setMsg(string calldata _message) external {
        message = _message;
    }

    function getMsg() external view returns(string memory) {
        return message;
    }
}