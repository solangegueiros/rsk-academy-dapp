// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "@openzeppelin/contracts/access/AccessControl.sol";

import "./interfaces/IProjects.sol";

contract Projects is AccessControl, IProjects {
    /**
     * @dev No project can be created/modified/deleted unless the contract is active
     */
    bool public active;

    /**
     * @dev Project name is the index, can't be changed after creation.
     */
    mapping(string => uint256) private _projects;
    IProjects.ProjectDetail[] private _projectDetails;

    modifier onlyOwner() {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Projects: only owner");
        _;
    }

    modifier onlyActive() {
        require(active, "Projects: not active");
        _;
    }

    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        active = true;
    }

    function createProject(string memory name, string memory description)
        public
        override
        onlyOwner
        onlyActive
        returns (uint256)
    {
        if (exists(name)) return _projects[name];

        IProjects.ProjectDetail memory p;
        p.name = name;
        p.description = description;
        p.active = true;

        _projectDetails.push(p);
        uint256 index = _projectDetails.length;
        _projects[name] = index;

        emit ProjectAdded(name, description);

        return index;
    }

    function deleteProject(string memory name) public override onlyOwner onlyActive returns (bool) {
        if (!exists(name)) return false;

        uint256 indexToDelete = _projects[name] - 1;
        uint256 indexToMove = _projectDetails.length - 1;
        string memory keyToMove = _projectDetails[indexToMove].name;

        _projectDetails[indexToDelete] = _projectDetails[indexToMove];
        _projects[keyToMove] = indexToDelete + 1;

        delete _projects[name];
        _projectDetails.pop();

        emit ProjectDeleted(name);
        return true;
    }

    function updateProject(
        string memory name,
        bool activeProject,
        address master,
        string memory description,
        string memory contractAbi
    ) public override onlyOwner onlyActive returns (bool) {
        if (!exists(name)) return false;

        uint256 index = _projects[name] - 1;
        _projectDetails[index].active = activeProject;
        _projectDetails[index].master = master;
        _projectDetails[index].description = description;
        _projectDetails[index].contractAbi = contractAbi;

        emit ProjectUpdated(name, description, master, active);
        return true;
    }

    function toggleActive() public override onlyOwner returns (bool) {
        active = !active;
        return active;
    }

    function exists(string memory projectName) public view override returns (bool) {
        if (_projects[projectName] == 0) return false;
        else return true;
    }

    function isActive(string memory projectName) public view override returns (bool) {
        return _projectDetails[_projects[projectName] - 1].active;
    }

    function getProjects() public view returns (IProjects.ProjectDetail[] memory) {
        return _projectDetails;
    }

    function getProjectByName(string memory projectName) public view override returns (IProjects.ProjectDetail memory) {
        require(exists(projectName), "not exists");
        uint256 index = _projects[projectName] - 1;
        return _projectDetails[index];
    }

    function getProjectByIndex(uint256 index) public view override returns (IProjects.ProjectDetail memory) {
        require((index > 0) && (index <= _projectDetails.length), "out of range");
        return _projectDetails[index - 1];
    }

    function getProjectMaster(string memory projectName) public view override returns (address) {
        require(exists(projectName), "not exists");
        uint256 index = _projects[projectName] - 1;
        return _projectDetails[index].master;
    }

    function getProjectIndex(string memory projectName) public view override returns (uint256) {
        return _projects[projectName];
    }

    function countProjects() public view override returns (uint256) {
        return _projectDetails.length;
    }

    function compareStrings(string memory a, string memory b) private pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }
}
