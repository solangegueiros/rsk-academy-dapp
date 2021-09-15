// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

interface IQuiz {
    struct QuizDetail {
        address student;
        uint8 total;
        uint8 grade;
        uint8 attempt;
        string quiz;
        string answer;
    }

    event StudentGradeAdded(address indexed student, string indexed quiz, uint8 total, uint8 grade, uint8 attempt);
    event StudentGradeDeleted(address indexed student, string quiz);

    /**
     * @dev Creates a quiz if the student has not submitted the quiz before.
     * Updates number of attempts, answers and grade of the quiz if it's been
     * submitted by the student
     *
     * Emits {StudentGradeAdded} event
     */
    function submitQuiz(
        address student,
        string memory quiz,
        string memory answer,
        uint8 total,
        uint8 grade
    ) external returns (uint256);

    function getQuizIndex(address student, string memory quiz) external view returns (uint256);

    function exists(address student, string memory quiz) external view returns (bool);

    function getQuiz(address student, string memory quiz) external view returns (QuizDetail memory);

    function getQuizByIndex(uint256 index) external view returns (QuizDetail memory);

    function countQuizStudents(string memory quiz) external view returns (uint256);

    function countStudentQuizzes(address student) external view returns (uint256);

    function getQuizStudents(string memory quiz) external view returns (address[] memory);

    function getStudentQuizzes(address student) external view returns (string[] memory);
}
