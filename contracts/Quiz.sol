// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "@openzeppelin/contracts/access/AccessControl.sol";

import "./interfaces/IQuiz.sol";

// Off-contract: must be a subscribed student
// A quiz isn't linked to a course, it must be implemented

contract Quiz is AccessControl, IQuiz {
    IQuiz.QuizDetail[] private _quizDetails;

    /**
     * @dev Last attempt quizzes from Student
     */
    mapping(address => mapping(string => uint256)) private _quizzes;

    /**
     * @dev Quiz list which is taken by each student
     */
    mapping(address => string[]) private _studentQuizzes;

    /**
     * @dev Students of each quiz
     */
    mapping(string => address[]) private _quizTakers;

    modifier onlyOwner() {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Quiz: only owner");
        _;
    }

    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function submitQuiz(
        address student,
        string memory quiz,
        string memory answer,
        uint8 total,
        uint8 grade
    ) public override onlyOwner returns (uint256) {
        require(!compareStrings(quiz, ""), "quiz: invalid quiz");
        uint256 index = _quizzes[student][quiz];
        uint8 lastAttempt = 0;

        if (index == 0) {
            // Create
            lastAttempt = 1;
            IQuiz.QuizDetail memory q;
            q.student = student;
            q.quiz = quiz;
            q.answer = answer;
            q.attempt = 1;
            q.total = total;
            q.grade = grade;
            _quizDetails.push(q);
            index = _quizDetails.length;
            _quizzes[student][quiz] = index;

            // Which quiz the student submitted?
            _studentQuizzes[student].push(quiz);
            // Who submitted the quiz?
            _quizTakers[quiz].push(student);
        } else {
            index = index - 1;
            _quizDetails[index].answer = answer;
            _quizDetails[index].total = total;
            _quizDetails[index].grade = grade;
            _quizDetails[index].attempt = _quizDetails[index].attempt + 1;
            lastAttempt = _quizDetails[index].attempt;
        }

        emit StudentGradeAdded(student, quiz, total, grade, lastAttempt);
        return index;
    }

    function getQuizIndex(address student, string memory quiz) public view override returns (uint256) {
        return _quizzes[student][quiz];
    }

    function exists(address student, string memory quiz) public view override returns (bool) {
        if (_quizzes[student][quiz] == 0) return false;
        else return true;
    }

    function getQuiz(address student, string memory quiz) public view override returns (IQuiz.QuizDetail memory) {
        require(exists(student, quiz), "not exists");

        uint256 index = _quizzes[student][quiz] - 1;
        return _quizDetails[index];
    }

    function getQuizByIndex(uint256 index) public view override returns (IQuiz.QuizDetail memory) {
        require((index > 0) && (index <= _quizDetails.length), "out of range");
        return _quizDetails[index - 1];
    }

    function countQuizStudents(string memory quiz) public view override returns (uint256) {
        return _quizTakers[quiz].length;
    }

    function countStudentQuizzes(address student) public view override returns (uint256) {
        return _studentQuizzes[student].length;
    }

    function getQuizStudents(string memory quiz) public view override returns (address[] memory) {
        return _quizTakers[quiz];
    }

    function getStudentQuizzes(address student) public view override returns (string[] memory) {
        return _studentQuizzes[student];
    }

    function compareStrings(string memory a, string memory b) private pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }
}
