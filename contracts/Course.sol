// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "@openzeppelin/contracts/access/AccessControl.sol";

import "./interfaces/ICourse.sol";
import "./interfaces/IStudents.sol";
import "./interfaces/IQuiz.sol";

/**
 * @dev Contract module which controls multiple courses management.
 *
 * If it's not `active` the following functions cannot be called:
 *  _addStudent, _cancelStudent, completeCourseStudentDetail, submitQuiz
 *
 * If it's not open, no student cannot be added to the target course
 */
contract Course is AccessControl, ICourse {
    bool public active;
    bool public open;
    string public courseName;

    IStudents public students;
    IQuiz public quiz;
    mapping(address => CourseStudentDetail) private _studentsDetails;
    address[] private _students;

    modifier onlyOwner() {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Course: only owner");
        _;
    }

    modifier onlyActive() {
        require(active, "Course: not active");
        _;
    }

    modifier onlyOpen() {
        require(open, "Course: not open");
        _;
    }

    constructor(
        address studentsContractAddress,
        address quizContractAddress,
        string memory courseName_
    ) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        courseName = courseName_;
        active = true;
        open = true;
        students = IStudents(studentsContractAddress);
        quiz = IQuiz(quizContractAddress);
    }

    function subscribe() public override onlyOpen returns (bool) {
        _addStudent(msg.sender);
        return true;
    }

    function unsubscribe() public override returns (bool) {
        _cancelStudent(msg.sender);
        return true;
    }

    function addStudent(address account) public override onlyOwner onlyActive returns (bool) {
        _addStudent(account);
        return true;
    }

    function cancelStudent(address account) public override onlyOwner returns (bool) {
        _cancelStudent(account);
        return true;
    }

    function completeCourse(address account) public override onlyOwner onlyActive returns (bool) {
        require(isStudent(account), "student doesn't exists");
        _studentsDetails[account].status = StudentStatus.Completed;
        _studentsDetails[account].end = block.timestamp;
        emit StudentStatusChanged(account, StudentStatus.Completed);
        return true;
    }

    function submitQuiz(
        string memory quizName,
        string memory answer,
        uint8 total,
        uint8 grade
    ) public override onlyActive returns (uint256) {
        require(isStudent(msg.sender), "student doesnt exists");
        uint256 index = quiz.submitQuiz(msg.sender, quizName, answer, total, grade);
        return index;
    }

    function toggleCourseActive() public override onlyOwner returns (bool) {
        active = !active;
        return active;
    }

    function toggleCourseOpen() public override onlyOwner returns (bool) {
        open = !open;
        return open;
    }

    function isStudent(address account) public view override returns (bool) {
        if (_studentsDetails[account].start > 0) return true;
        else return false;
    }

    function getCourseStudent(address account) public view override returns (CourseStudentDetail memory) {
        require(isStudent(account), "not a student");
        return _studentsDetails[account];
    }

    function getStudents() public view override returns (address[] memory) {
        return _students;
    }

    function countStudents() public view override returns (uint256) {
        return (_students.length);
    }

    function _addStudent(address account) private returns (uint256) {
        require(!isStudent(account), "student already exists");
        uint256 indexStudent = 0;

        _studentsDetails[account].status = StudentStatus.InProgress;
        _studentsDetails[account].start = block.timestamp;
        _students.push(account);

        // In Students?
        if (!students.isStudent(account)) {
            indexStudent = students.addStudent(account);
        }

        address courseAddress = address(this);
        require(students.enrollStudent(account, courseAddress), "Error in students.addCourse");
        require(
            students.changeStudentActiveCourse(account, courseAddress),
            "Error in studentList.updateStudentActiveCourse"
        );

        emit StudentAddedInCourse(account);
        return indexStudent;
    }

    function _cancelStudent(address account) private onlyActive {
        require(isStudent(account), "student doesn't exists");
        _studentsDetails[account].status = StudentStatus.Canceled;
        _studentsDetails[account].end = block.timestamp;
        emit StudentStatusChanged(account, StudentStatus.Canceled);
    }
}
