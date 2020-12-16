pragma solidity 0.5.4;
pragma experimental ABIEncoderV2;

interface iName {
    function owner() external returns (address);
    function getName() external view returns (string memory);
}

contract MasterName {
    
    mapping(address => string) public scNamesByContract;
    mapping(address => string) public scNamesByOwner;
    address[] public addressNameSCs;
    address[] public addressNamesOwners;
    address public owner;
    
    constructor() public {
        owner = msg.sender;
    }

    function listAddressNameSCs () public view returns (address[] memory) {
        return addressNameSCs;
    }
    
    function listNameOwners () public view returns (address[] memory) {
        return addressNamesOwners;
    }
    
    string[] private namesList;
    function listNames () public returns (string[] memory) {
        delete namesList;

        for(uint i=0; i<addressNameSCs.length; i++) {
            namesList.push(scNamesByContract[addressNameSCs[i]]);
        }
        return namesList;
    }
    
    function getOwnerSC (address _scAddress) public returns (address) {
        iName scName = iName(_scAddress);
        return scName.owner();
    }
    
    function getNameSC (address _scAddress) public view returns (string memory) {
        iName scName = iName(_scAddress);
        return scName.getName();
    }
    
    function checkName (address _scAddress, string memory _scName) public view returns (bool) {
        iName scName = iName(_scAddress);
        string memory name = scName.getName();
        if (compareStrings(name, _scName)) {
            return true;
        }
        return false;
    }
    
    function addName (address _scAddress, string memory _scName) public returns (bool) {
        //Verificar se ja existe
        iName scName = iName(_scAddress);
        string memory name = scName.getName();
        require (compareStrings(name, _scName), "different name");
        //Only owner's sc can add
        require (scName.owner() == msg.sender, "only sc owner");
        addressNameSCs.push(_scAddress);
        addressNamesOwners.push(scName.owner());
        scNamesByOwner[scName.owner()] = name;  //account owner of SC => name
        scNamesByContract[_scAddress] = name;   //sc => name
        return true;
    }
    
    function addNameBySC (address _scAddress, address _scOwner, string memory _scName) public returns (bool) {
        iName scName = iName(_scAddress);
        string memory name = scName.getName();
        require (compareStrings(name, _scName), "different name");
        //Only owner's sc can add
        require (scName.owner() == _scOwner, "only sc owner");
        addressNameSCs.push(_scAddress);
        addressNamesOwners.push(scName.owner());
        scNamesByOwner[scName.owner()] = name;  //account owner of SC => name
        scNamesByContract[_scAddress] = name;   //sc => name
        return true;
    }    

    function compareStrings(string memory a, string memory b) private pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }
    
}
