// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "@openzeppelin/contracts/access/AccessControl.sol";

import "./interfaces/IName.sol";
import "./interfaces/IMasterName.sol";
import "./interfaces/IStudents.sol";
import "./interfaces/IPortfolio.sol";

/**
 * @dev It must have a Project in Projects in order for a Master to works.
 * The Master validates the project which is in Projects.
 *
 * PROJECT_NAME is a key.
 * So every Master must hava a PROJECT_NAME which the same name in project in Projects.
 *
 * Master is linked to addressStudentList
 * After creater a Master:
 *     your address must be updated in the project in Projects.
 *
 * A Master has the student list who submited this project.
 *
 * MasterName validates the Name and adds it into student's project.
 * MasterName has the student's names = student list!
 */

contract MasterName is AccessControl, IMasterName {
    string public constant PROJECT_NAME = "Name";
    IStudents public students;

    IName.NameDetail[] private _names;
    mapping(address => uint256) private _owners;
    mapping(address => uint256) private _nameContracts;

    modifier onlyOwner() {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "MasterName: only owner");
        _;
    }

    constructor(address studentsContract) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        students = IStudents(studentsContract);
    }

    function addName(address contractAddress, string memory name) public override returns (bool) {
        _addContract(msg.sender, contractAddress, name);
        return true;
    }

    function addContract(
        address ownerAddress,
        address contractAddress,
        string memory name
    ) public override onlyOwner returns (bool) {
        _addContract(ownerAddress, contractAddress, name);
        return true;
    }

    function removeOwnContract() public override returns (bool) {
        _removeContract(msg.sender);
        return true;
    }

    function removeContract(address ownerAddress) public override onlyOwner returns (bool) {
        _removeContract(ownerAddress);
        return true;
    }

    function changeStudentsContract(address studentsContract) public override onlyOwner returns (bool) {
        students = IStudents(studentsContract);
        return true;
    }

    // Owner can have more than one name contract? NO
    function existsOwner(address account) public view override returns (bool) {
        if (_owners[account] == 0) return false;
        else return true;
    }

    function existsNameContract(address contractAddress) public view override returns (bool) {
        if (_nameContracts[contractAddress] == 0) return false;
        else return true;
    }

    function checkName(address contractAddress, string memory name) public view override returns (bool) {
        // Name stored in nameContract equal name_
        IName nameContract = IName(contractAddress);
        string memory nameInSC = nameContract.getName();
        if (compareStrings(nameInSC, name)) {
            return true;
        }
        return false;
    }

    function getName(address contractAddress) public view override returns (string memory) {
        IName nameContract = IName(contractAddress);
        return nameContract.getName();
    }

    function getContracts() public view override returns (IName.NameDetail[] memory) {
        return _names;
    }

    function countContracts() public view override returns (uint256) {
        return (_names.length);
    }

    function getOwnerAddress(address contractAddress) public view override returns (address) {
        IName nameContract = IName(contractAddress);
        return nameContract.owner();
    }

    function getNameDetailByOwner(address account) public view override returns (IName.NameDetail memory) {
        return _names[_owners[account]];
    }

    function getNameDetailByContract(address contractAddress) public view override returns (IName.NameDetail memory) {
        return _names[_nameContracts[contractAddress]];
    }

    function getNameDetailByIndex(uint256 index) public view override returns (IName.NameDetail memory) {
        return _names[index - 1];
    }

    function _addContract(
        address ownerAddress,
        address contractAddress,
        string memory name
    ) private returns (bool) {
        // Does it already exist?
        require(!existsNameContract(contractAddress), "nameContract exists");
        require(!existsOwner(ownerAddress), "owner exists");

        IName nameContract = IName(contractAddress);
        require(compareStrings(nameContract.getName(), name), "different name");

        // Only owner's contract can add
        require(nameContract.owner() == ownerAddress, "only contract owner");

        IName.NameDetail memory n;
        n.owner = ownerAddress;
        n.nameContract = contractAddress;
        n.name = name;

        _names.push(n);
        uint256 index = _names.length; // Attention: real location is index-1!
        _owners[ownerAddress] = index;
        _nameContracts[contractAddress] = index;

        _addInProject(ownerAddress, contractAddress);

        emit NameContractAdded(contractAddress, ownerAddress, name);
        return true;
    }

    function _addInProject(address ownerAddress, address contractAddress) private returns (bool) {
        if (!students.isStudent(ownerAddress)) return false;

        IStudents.StudentDetail memory s = students.getStudent(ownerAddress);
        if (s.portfolioAddress != address(0x0)) {
            IPortfolio p = IPortfolio(s.portfolioAddress);
            p.addProject(contractAddress, PROJECT_NAME);
        }

        return true;
    }

    function _removeContract(address ownerAddress) private returns (bool) {
        require(existsOwner(ownerAddress), "owner not exists");

        uint256 indexToBeDeleted = _owners[ownerAddress] - 1;
        address contractToBeDeleted = _names[indexToBeDeleted].nameContract;

        uint256 indexToBeMoved = _names.length - 1;
        address ownerToBeMoved = _names[indexToBeMoved].owner;
        address contractToBeMoved = _names[indexToBeMoved].nameContract;

        _names[indexToBeDeleted] = _names[indexToBeMoved];
        _owners[ownerToBeMoved] = indexToBeDeleted + 1;
        _nameContracts[contractToBeMoved] = indexToBeDeleted + 1;

        delete _owners[ownerAddress];
        delete _nameContracts[contractToBeDeleted];
        _names.pop();

        IStudents.StudentDetail memory s = students.getStudent(ownerAddress);
        if (s.portfolioAddress != address(0x0)) {
            IPortfolio p = IPortfolio(s.portfolioAddress);
            p.deleteProject(contractToBeDeleted);
        }

        emit NameContractRemoved(ownerAddress, contractToBeDeleted);
        return true;
    }

    function compareStrings(string memory a, string memory b) private pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }
}
