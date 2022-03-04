// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

interface ICourse {
    /**
     * @dev enum studentStatus { Canceled = 0, InProgress = 1, Completed = 2 }
     */
    enum StudentStatus {
        Canceled,
        InProgress,
        Completed
    }

    struct CourseStudentDetail {
        StudentStatus status;
        /**
         * @dev UNIX timestamp indicating when the student enrolled in the course
         */
        uint256 start;
        /**
         * @dev UNIX timestamp indicating when the student ended the course
         */
        uint256 end;
    }

    event StudentAddedInCourse(address indexed _studentAddress);
    event StudentStatusChanged(address indexed _studentAddress, StudentStatus _status);

    /**
     * @dev Students can enroll in the course by subscribing the course.
     */
    function subscribe() external returns (bool);

    /**
     * @dev Changes student status to `Cancelled` instead of removing from
     * students list.
     */
    function unsubscribe() external returns (bool);

    /**
     * @dev Admin adds any student to course by it's account address
     */
    function addStudent(address account) external returns (bool);

    /**
     * @dev Admin changes student status to `Cancelled`. That means
     * student will not be counted as subscriber.
     */
    function cancelStudent(address account) external returns (bool);

    /**
     * @dev Changes student status to `Completed` and sets ending time
     * of the course for a student. Student will still be stayed on the
     * students list after completing the course just by changing the status
     */
    function completeCourse(address account) external returns (bool);

    /**
     * @dev Submits a quiz.
     *
     * Only subscribers can submit quizzes of the course.
     */
    function submitQuiz(
        string memory quiz,
        string memory answer,
        uint8 total,
        uint8 grade
    ) external returns (uint256);

    /**
     * @dev Switches between the course is active or not.
     *
     * Returns boolean value indicating active status after change
     */
    function toggleCourseActive() external returns (bool);

    /**
     * @dev Switches between the course is open or not.
     *
     * Returns boolean value indicating open status after change
     */
    function toggleCourseOpen() external returns (bool);

    /**
     * @dev Indicates that the student is currently a subscriber of the course.
     * And it means that student status is `InProgress`
     */
    function isStudent(address account) external view returns (bool);

    /**
     * @dev Returns course status of giving student account
     */
    function getCourseStudent(address account) external view returns (CourseStudentDetail memory);

    /**
     * Returns address list of the course students
     */
    function getStudents() external view returns (address[] memory);

    function countStudents() external view returns (uint256);
}
