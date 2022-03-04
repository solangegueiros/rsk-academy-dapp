// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "@openzeppelin/contracts/access/AccessControl.sol";

import "./Portfolio.sol";
import "./interfaces/ICourse.sol";
import "./interfaces/IStudents.sol";

contract Students is AccessControl, IStudents {
    bool public active;
    address public projectsContract;

    address[] private _studentAddresses;
    mapping(address => IStudents.StudentDetail) private _studentDetails;
    mapping(address => mapping(address => bool)) private _subscriptions;

    modifier onlyOwner() {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Students: only owner");
        _;
    }

    modifier onlyActive() {
        require(active, "Students: not active");
        _;
    }

    constructor(address addressProjects) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        active = true;
        projectsContract = addressProjects;
    }

    function addStudent(address account) public override onlyOwner onlyActive returns (uint256) {
        uint256 studentIndex;
        if (!isStudent(account)) {
            studentIndex = _addStudent(account);
        }

        Portfolio p = new Portfolio(account, projectsContract);
        _studentDetails[account].portfolioAddress = address(p);

        emit StudentCreated(account);

        return studentIndex;
    }

    function deleteStudent(address account) public override onlyOwner onlyActive returns (bool) {
        _deleteStudent(account);
        return true;
    }

    function enrollStudent(address account, address courseAddress) public override onlyOwner onlyActive returns (bool) {
        if (!isStudent(account)) return false;

        // Check if the student is already enrolled in this course
        if (!_subscriptions[account][courseAddress]) {
            _studentDetails[account].studentCourses.push(courseAddress);
            _subscriptions[account][courseAddress] = true;
        }

        emit StudentSubscribed(courseAddress, account);
        return true;
    }

    function changeActiveCourse(address courseAddress) public override returns (bool) {
        return _changeActiveCourse(msg.sender, courseAddress);
    }

    function changeStudentActiveCourse(address account, address courseAddress)
        public
        override
        onlyOwner
        returns (bool)
    {
        return _changeActiveCourse(account, courseAddress);
    }

    function toggleActive() public override onlyOwner returns (bool) {
        active = !active;
        return active;
    }

    function changeProjectsContract(address contractAddress) public override onlyOwner returns (bool) {
        projectsContract = contractAddress;
        return true;
    }

    function isStudent(address account) public view override returns (bool) {
        if (_studentAddresses.length == 0) return false;
        return (_studentAddresses[_studentDetails[account].index] == account);
    }

    function getStudent(address account) public view override returns (IStudents.StudentDetail memory) {
        if (!isStudent(account)) {
            IStudents.StudentDetail memory s;
            return s;
        } else return _studentDetails[account];
    }

    function countStudents() public view returns (uint256) {
        return _studentAddresses.length;
    }

    function getStudents() public view returns (address[] memory) {
        return _studentAddresses;
    }

    function _addStudent(address account) private returns (uint256) {
        if (isStudent(account)) return 0;

        _studentDetails[account].ownerAddress = account;
        _studentAddresses.push(account);
        uint256 index = _studentAddresses.length - 1;
        _studentDetails[account].index = index;

        emit StudentCreated(account);
        return index;
    }

    function _changeActiveCourse(address account, address courseAddress) private onlyActive returns (bool) {
        if (!isStudent(account)) return false;
        _studentDetails[account].activeCourse = courseAddress;
        emit CourseStudentDetailSelected(courseAddress, account);
        return true;
    }

    function _deleteStudent(address account) private returns (bool) {
        if (!isStudent(account)) return false;

        uint256 indexToDelete = _studentDetails[account].index;
        address keyToMove = _studentAddresses[_studentAddresses.length - 1];
        _studentAddresses[indexToDelete] = keyToMove;
        _studentDetails[keyToMove].index = indexToDelete;

        delete _studentDetails[account];
        _studentAddresses.pop();

        // Consider keeping student portfolio?

        emit StudentRemoved(account);
        return true;
    }

    function compareStrings(string memory a, string memory b) private pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }
}
