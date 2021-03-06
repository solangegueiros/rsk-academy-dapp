// SPDX-License-Identifier: MIT
pragma solidity 0.8.1;

struct StudentQuizStruct {
    address student;
    uint8 total;
    uint8 grade;
    uint8 attempt;
    string quiz;
    string answer;
}

interface iAcademyStudentQuiz {
    function addStudentQuizAnswer (address student, string memory quiz, string memory answer, uint8 total, uint8 grade) external returns(uint256);
    function grantRole (bytes32 role, address account) external;
}
