// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "@openzeppelin/contracts/access/AccessControl.sol";

import "./interfaces/IStudents.sol";
import "./interfaces/IPortfolio.sol";

contract MasterQuote is AccessControl {
    struct QuoteDetail {
        address owner;
        address scProject;
        string info;
    }

    string public constant PROJECT_NAME = "Quote";
    IStudents public students;

    QuoteDetail[] private _quotes;
    mapping(address => uint256) private _owners;
    mapping(address => uint256) private _quoteContracts;

    event ProjectAdded(address indexed owner, address indexed scProject);
    event ProjectDeleted(address indexed owner, address indexed scProject);

    modifier onlyOwner() {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "MasterName: only owner");
        _;
    }

    constructor(address studentsContractAddress) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        students = IStudents(studentsContractAddress);
    }

    function validate(address contractAddress) public returns (bool) {
        _validate(msg.sender, contractAddress);
        return true;
    }

    function validateBySC(address scOwner, address contractAddress) public onlyOwner returns (bool) {
        _validate(scOwner, contractAddress);
        return true;
    }

    function deleteProject() public returns (bool) {
        _deleteProject(msg.sender);
        return true;
    }

    function deleteProjectBySC(address scOwner) public onlyOwner returns (bool) {
        _deleteProject(scOwner);
        return true;
    }

    function updateStudentList(address studentsContractAddress) public onlyOwner returns (bool) {
        students = IStudents(studentsContractAddress);
        return true;
    }

    // Owner can have more than one scProject? NO
    function existsOwner(address account) public view returns (bool) {
        if (_owners[account] == 0) return false;
        else return true;
    }

    function existsScProject(address contractAddress) public view returns (bool) {
        if (_quoteContracts[contractAddress] == 0) return false;
        else return true;
    }

    function getProjects() public view returns (QuoteDetail[] memory) {
        return _quotes;
    }

    function countProjects() public view returns (uint256) {
        return (_quotes.length);
    }

    function getProjectByIndex(uint256 index) public view returns (QuoteDetail memory) {
        return _quotes[index - 1];
    }

    function getProjectByOwner(address scOwner) public view returns (QuoteDetail memory) {
        uint256 index = _owners[scOwner];
        return _quotes[index - 1];
    }

    function _validate(address scOwner, address contractAddress) private returns (bool) {
        //Does it already exist?
        require(!existsScProject(contractAddress), "scProject exists");
        require(!existsOwner(scOwner), "owner exists");

        //TODO: call Project and validate it

        // Only owner's sc can add
        // require (scProject.owner() == scOwner, "only sc owner");

        QuoteDetail memory sps;
        sps.owner = scOwner;
        sps.scProject = contractAddress;

        _quotes.push(sps);
        uint256 index = _quotes.length; //Attention: real location is index-1!
        _owners[scOwner] = index;
        _quoteContracts[contractAddress] = index;

        _addInProject(scOwner, contractAddress);

        emit ProjectAdded(scOwner, contractAddress);
        return true;
    }

    function _addInProject(address scOwner, address contractAddress) private returns (bool) {
        if (!students.isStudent(scOwner)) return false;

        IStudents.StudentDetail memory s = students.getStudent(scOwner);
        if (s.portfolioAddress != address(0x0)) {
            IPortfolio p = IPortfolio(s.portfolioAddress);
            p.addProject(contractAddress, PROJECT_NAME);
        }
        return true;
    }

    function _deleteProject(address scOwner) private returns (bool) {
        require(existsOwner(scOwner), "owner not exists");

        uint256 indexToDelete = _owners[scOwner] - 1;
        address scProjectToDelete = _quotes[indexToDelete].scProject;

        uint256 indexToMove = _quotes.length - 1;
        address ownerToMove = _quotes[indexToMove].owner;
        address scProjectToMove = _quotes[indexToMove].scProject;

        _quotes[indexToDelete] = _quotes[indexToMove];
        _owners[ownerToMove] = indexToDelete + 1;
        _quoteContracts[scProjectToMove] = indexToDelete + 1;

        delete _owners[scOwner];
        delete _quoteContracts[scProjectToDelete];
        _quotes.pop();

        IStudents.StudentDetail memory s = students.getStudent(scOwner);
        if (s.portfolioAddress != address(0x0)) {
            IPortfolio p = IPortfolio(s.portfolioAddress);
            p.deleteProject(scProjectToDelete);
        }

        emit ProjectDeleted(scOwner, scProjectToDelete);
        return true;
    }
}
