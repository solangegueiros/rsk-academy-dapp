// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

contract DefaultQuote {
    address public owner;
    string private message;
    mapping(address => bool) public whiteLists;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    modifier onlyWhitelist() {
        require(whiteLists[msg.sender] == true, "Only whitelist");
        _;
    }

    constructor() {
        owner = msg.sender;
        whiteLists[msg.sender] = true;
    }

    function setQuote(string memory _message) public onlyWhitelist {
        message = _message;
    }

    function addMember(address _member) public onlyOwner {
        whiteLists[_member] = true;
    }

    function delMember(address _member) public onlyOwner {
        whiteLists[_member] = false;
    }

    function getQuote() public view returns (string memory) {
        return message;
    }
}
