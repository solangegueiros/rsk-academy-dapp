// SPDX-License-Identifier: MIT
pragma solidity 0.8.1;

//import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/AccessControl.sol";
//import '@openzeppelin/contracts/access/AccessControl.sol';
import './oz-contracts/access/AccessControl.sol';

import './iAcademyClass.sol';
import './iAcademyStudents.sol';


contract AcademyClass is AccessControl {
    
    bool public active;    // If NOT active, can't add students
    string public className;

    iAcademyStudents public studentList;
    mapping(address => StudentInClass) private studentInClassInfo;
    address[] private studentAddressList;

    constructor(address addressStudentList, string memory className_) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        className = className_;
        active = true;
        studentList = iAcademyStudents(addressStudentList);
    }
    
    event StudentAddedInClass(address indexed _studentAddress);
    event StudentStatusChanged(address indexed _studentAddress, StudentStatus _status);

    modifier onlyOwner() {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "AcademyClass: only owner");
        _;
    }
    
    modifier onlyActive() {
        require(active, "AcademyClass: not active");
        _;
    }

    function subscribe () public returns (bool) {
        _addStudent(msg.sender);
        return true;
    }
    
    function addStudent (address account) public onlyOwner returns (bool) {
        _addStudent(account);
        return true;
    }    
    
    function _addStudent (address account) private onlyActive returns (uint256) {
        require (!isStudent(account), "student already exists");
        uint256 indexStudent = 0;

        studentInClassInfo[account].status = StudentStatus.InProgress;
        studentInClassInfo[account].start = block.timestamp;
        studentAddressList.push(account);
        
        //In AcademyStudents?
        if (!studentList.isStudent(account)) {
            indexStudent = studentList.addStudent(account);
        }
        else {
            //getStudent
        }
        
        address classAddress = address(this);
        require (studentList.addClass(account, classAddress), "Error in studentList.addClass");
        require (studentList.updateStudentActiveClass(account, classAddress), "Error in studentList.updateStudentActiveClass");

        emit StudentAddedInClass(account);
        return indexStudent;
    }

    function courseComplete (address account) onlyOwner onlyActive public returns (bool) {
        require (isStudent(account), "student not exists");
        studentInClassInfo[account].status = StudentStatus.Completed;
        studentInClassInfo[account].end = block.timestamp;
        emit StudentStatusChanged (account, StudentStatus.Completed);
        return true;
    }
    
    function unsubscribe () public returns (bool) {
        //require (account == msg.sender, "only himself");
        _cancelStudent(msg.sender);
        return true;
    }    
    
    function cancelStudent (address account) onlyOwner public returns (bool) {
        _cancelStudent(account);
        return true;
    }    

    function _cancelStudent (address account) private onlyActive {
        require (isStudent(account), "student not exists");
        studentInClassInfo[account].status = StudentStatus.Canceled;
        studentInClassInfo[account].end = block.timestamp;
        emit StudentStatusChanged (account, StudentStatus.Canceled);
    }
    
    function changeClassStatus () public onlyOwner returns (bool) {
        active = !active;
        return active;
    }
    
    function isStudent (address account) public view returns (bool) {
        //if (!compareStrings(studentInfo[account].name, ""))
        if (studentInClassInfo[account].start > 0)
            return true;
        else
            return false;
    }

    function getStudentByAddress (address account) public view returns (StudentInClass memory) {
        require(isStudent(account), "not student");
        return studentInClassInfo[account];
    }

    function listStudentsByAddress () public view returns (address[] memory) {
        return studentAddressList;
    }

    function countStudents () public view returns (uint) {
        return (studentAddressList.length);
    }
    
    function compareStrings(string memory a, string memory b) private pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }

}
