// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

interface IStudents {
    struct StudentDetail {
        uint256 index;
        address ownerAddress;
        address portfolioAddress;
        address activeCourse;
        address[] studentCourses;
    }

    event StudentCreated(address indexed studentAddress);
    event StudentRemoved(address indexed studentAddress);
    event StudentSubscribed(address indexed courseAddress, address indexed studentAddress);
    event CourseStudentDetailSelected(address indexed courseAddress, address indexed studentAddress);

    /**
     * @dev Admin can add student and thus a portfolio will be created for the student.
     *
     * Emits {StudentCreated} event
     */
    function addStudent(address account) external returns (uint256);

    /**
     * @dev Admin removes student address from list.
     * Also student details and student portfolio will be deleted.
     *
     * Emits {StudentRemoved} event
     */
    function deleteStudent(address account) external returns (bool);

    /**
     * @dev Admin can register a student for a specific course.
     *
     * Emits {StudentSubscribed} event
     */
    function enrollStudent(address account, address courseAddress) external returns (bool);

    /**
     * @dev Student changes his/her active course.
     *
     * Emits {CourseStudentDetailSelected} event
     */
    function changeActiveCourse(address courseAddress) external returns (bool);

    /**
     * @dev Admin can change the active course of any student.
     *
     * Emits {CourseStudentDetailSelected} event
     */
    function changeStudentActiveCourse(address account, address courseAddress) external returns (bool);

    /**
     * @dev Admin can lock/unlock {Students} contract which will not allow
     * to add/delete/modify any student
     */
    function toggleActive() external returns (bool);

    /**
     * @dev Changes {Projects} contract address which is attached to {Students}
     */
    function changeProjectsContract(address contractAddress) external returns (bool);

    function isStudent(address account) external view returns (bool);

    function getStudent(address account) external view returns (StudentDetail memory);

    // function delStudent (address account) external returns (bool);
    // function updateName (address account, address scAddress, string memory name_) external returns (bool);
    // function updatePortfolio (address account, address portfolioAddress) external returns (bool);
}
