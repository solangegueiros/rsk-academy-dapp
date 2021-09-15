// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "@openzeppelin/contracts/access/AccessControl.sol";

import "./Course.sol";
import "./Students.sol";
import "./Quiz.sol";
import "./interfaces/ICourses.sol";

contract Courses is AccessControl, ICourses {
    bool public active;
    CourseDetail[] private _courseDetails;
    mapping(address => uint256) private _courseIds;

    modifier onlyOwner() {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Courses: only owner");
        _;
    }

    modifier onlyActive() {
        require(active, "Courses: not active");
        _;
    }

    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        active = true;
    }

    function createCourse(
        address studentsContractAddress,
        address quizContractAddress,
        string memory courseName
    ) public override onlyOwner onlyActive returns (address) {
        // courseName = "Devs 2021-01";
        // Can repeat courseName? YES

        Course ac = new Course(studentsContractAddress, quizContractAddress, courseName);
        address courseAddress = address(ac);

        CourseDetail memory c;
        c.courseAddress = courseAddress;
        c.active = true;
        c.name = courseName;
        _courseDetails.push(c);
        uint256 index = _courseDetails.length; // Attention: real location is index-1!
        _courseIds[courseAddress] = index;

        Students students = Students(studentsContractAddress);
        students.grantRole(DEFAULT_ADMIN_ROLE, courseAddress);

        Quiz quiz = Quiz(quizContractAddress);
        quiz.grantRole(DEFAULT_ADMIN_ROLE, courseAddress);

        emit CourseCreated(courseAddress, courseName);
        return courseAddress;
    }

    function toggleActiveStatusByCourse(address courseAddress) public override onlyOwner onlyActive returns (bool) {
        require(!isCourse(courseAddress), "course doesn't exists");

        uint256 index = _courseIds[courseAddress] - 1;
        _courseDetails[index].active = !_courseDetails[index].active;

        Course c = Course(courseAddress);
        c.toggleCourseActive();
        return true;
    }

    function toggleActiveStatus() public override onlyOwner returns (bool) {
        active = !active;
        return active;
    }

    function addCourseOwner(address account, address courseAddress) public override onlyOwner onlyActive {
        Course c = Course(courseAddress);
        c.grantRole(DEFAULT_ADMIN_ROLE, account);
    }

    function deleteCourseOwner(address account, address courseAddress) public override onlyOwner onlyActive {
        Course c = Course(courseAddress);
        c.revokeRole(DEFAULT_ADMIN_ROLE, account);
    }

    function isCourse(address courseAddress) public view override returns (bool) {
        if (_courseIds[courseAddress] == 0) return false;
        else return true;
    }

    function getCourse(address courseAddress) public view override returns (CourseDetail memory) {
        uint256 index = _courseIds[courseAddress] - 1;
        return _courseDetails[index];
    }

    function getCourses() public view override returns (CourseDetail[] memory) {
        return _courseDetails;
    }

    function countCoursees() public view override returns (uint256) {
        return (_courseDetails.length);
    }
}
