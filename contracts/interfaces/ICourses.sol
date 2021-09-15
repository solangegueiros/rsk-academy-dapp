// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

interface ICourses {
    struct CourseDetail {
        address courseAddress;
        bool active;
        string name;
    }

    event CourseCreated(address indexed courseAddress, string courseName);

    /**
     * @dev Admin creates courses which is attached to both `Students` and `Quiz` contracts.
     *
     * Returns created course address
     *
     * Emits CourseCreated event
     */
    function createCourse(
        address studentsContractAddress,
        address quizContractAddress,
        string memory courseName
    ) external returns (address);

    function toggleActiveStatusByCourse(address courseAddress) external returns (bool);

    function toggleActiveStatus() external returns (bool);

    function addCourseOwner(address account, address courseAddress) external;

    function deleteCourseOwner(address account, address courseAddress) external;

    function isCourse(address courseAddress) external view returns (bool);

    function getCourse(address courseAddress) external view returns (CourseDetail memory);

    function getCourses() external view returns (CourseDetail[] memory);

    function countCoursees() external view returns (uint256);
}
