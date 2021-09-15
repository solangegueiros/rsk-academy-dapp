// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "@openzeppelin/contracts/access/AccessControl.sol";

import "./interfaces/IPortfolio.sol";
import "./interfaces/IProjects.sol";

contract Portfolio is AccessControl, IPortfolio {
    // One Project per Student
    address public student;

    // address public studentProject;
    IProjects public studentProject;

    IPortfolio.ProjectDetail[] private _projects;
    mapping(address => uint256) private _projectAddresses;
    mapping(string => uint256) private _projectNames;

    modifier onlyOwner() {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Project: only owner");
        _;
    }

    modifier onlyOwnerOrStudent() {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender) || (msg.sender == student), "Project: only student or owner");
        _;
    }

    constructor(address account, address projectsContractAddress) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        student = account;
        studentProject = IProjects(projectsContractAddress);
    }

    function addProject(address projectAddress, string memory projectName) public override returns (uint256) {
        // Owners are the Masters of the Academy.
        // Only they can add projects in portfolio, because they validate the project before add it.
        require(!compareStrings(projectName, ""), "portfolio: invalid name");
        require(!(projectAddress == address(0x0)), "portfolio: invalid address");
        require(studentProject.exists(projectName), "portfolio: project doesn't exists");
        require(studentProject.isActive(projectName), "portfolio: project isn't active");
        require(msg.sender == studentProject.getProjectMaster(projectName), "Only Master can add project in portfolio");

        // Can the student have more than one same type of project in portfolio? NO
        require(!checkProjectByAddress(projectAddress), "portfolio: address exists");
        require(!checkProjectByName(projectName), "portfolio: project exists");

        IPortfolio.ProjectDetail memory p;
        p.projectAddress = projectAddress;
        p.name = projectName;

        _projects.push(p);
        uint256 index = _projects.length;
        _projectAddresses[projectAddress] = index;
        _projectNames[projectName] = index;

        emit PortfolioProjectAdded(projectAddress, projectName);
        return index;
    }

    function deleteProject(address projectAddress) public override returns (bool) {
        // If the student don't like your project, or did a mistake, he can delete it ad submit again.
        require(!(projectAddress == address(0x0)), "invalid address");
        require(checkProjectByAddress(projectAddress), "address not exists");

        // Called only by your MasterProject
        address masterAddress = studentProject.getProjectMaster(_projects[_projectAddresses[projectAddress] - 1].name);
        require(msg.sender == masterAddress, "Only Master can add project in portfolio");

        uint256 indexToDelete = _projectAddresses[projectAddress] - 1;
        string memory nameToDelete = _projects[indexToDelete].name;

        uint256 indexToMove = _projects.length - 1;
        address keyToMove = _projects[indexToMove].projectAddress;
        _projects[indexToDelete] = _projects[indexToMove];
        _projectAddresses[keyToMove] = indexToDelete + 1;
        _projectNames[_projects[indexToMove].name] = indexToDelete + 1;

        delete _projectAddresses[projectAddress];
        delete _projectNames[nameToDelete];
        _projects.pop();

        emit PortfolioProjectDeleted(projectAddress, nameToDelete);
        return true;
    }

    function changeProjectsContract(address projectsContractAddress) public override onlyOwner returns (bool) {
        studentProject = IProjects(projectsContractAddress);
        return true;
    }

    function checkProjectByAddress(address projectAddress) public view override returns (bool) {
        if (_projectAddresses[projectAddress] == 0) return false;
        else return true;
    }

    function checkProjectByName(string memory projectName) public view override returns (bool) {
        if (_projectNames[projectName] == 0) return false;
        else return true;
    }

    function getProjects() public view override returns (IPortfolio.ProjectDetail[] memory) {
        return (_projects);
    }

    function getProjectByName(string memory projectName)
        public
        view
        override
        returns (IPortfolio.ProjectDetail memory)
    {
        return _projects[_projectNames[projectName] - 1];
    }

    function getProjectByAddress(address projectAddress)
        public
        view
        override
        returns (IPortfolio.ProjectDetail memory)
    {
        return _projects[_projectAddresses[projectAddress] - 1];
    }

    function getProjectByIndex(uint256 index) public view override returns (IPortfolio.ProjectDetail memory) {
        require((index > 0) && (index <= _projects.length), "out of range");
        return _projects[index - 1];
    }

    function getProjectIndex(address projectAddress) public view override returns (uint256) {
        return _projectAddresses[projectAddress];
    }

    function countProjects() public view override returns (uint256) {
        return (_projects.length);
    }

    function compareStrings(string memory a, string memory b) private pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }
}
