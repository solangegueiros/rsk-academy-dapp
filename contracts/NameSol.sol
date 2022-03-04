// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

contract NameSol {
    string private name;
    address public owner;

    constructor() {
        owner = msg.sender;
        name = "Solange Gueiros";
    }

    function getName() public view returns (string memory) {
        return name;
    }
}
