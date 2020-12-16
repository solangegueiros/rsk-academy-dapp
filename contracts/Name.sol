pragma solidity 0.5.4;

contract Name {
    string private name;
    address public owner;

    constructor() public {
        owner = msg.sender;
        name = "Nome";
    }

    function getName() public view returns (string memory) {
        return name;
    }
}