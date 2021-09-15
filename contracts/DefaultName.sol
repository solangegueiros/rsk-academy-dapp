// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

contract DefaultName {
    string private name;
    address public owner;

    constructor() {
        owner = msg.sender;
        name = "Your name";
    }

    function getName() public view returns (string memory) {
        return name;
    }
}
