// SPDX-License-Identifier: MIT
pragma solidity 0.8.1;

//import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/AccessControl.sol";
//import '@openzeppelin/contracts/access/AccessControl.sol';
import './oz-contracts/access/AccessControl.sol';

struct StudentQuizStruct {
    uint8 total;
    uint8 grade;
    uint8 atempt;
    string name;
}

//Who is the owner?
//Who can change information? It cannot be the student directly

contract StudentQuiz is AccessControl {

    bool public active;

    StudentQuizStruct[] private studentQuizInfo; 
    //Quiz name is an index, can't be changed after created.
    mapping(string => uint256) private studentQuizIndexName;

    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        active = true;
    }    
    
    event StudentGradeUpdated(string indexed name, uint8 total, uint8 grade, uint8 atempt);
    event StudentGradeDeleted(string name);

    modifier onlyOwner() {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "AcademyProjectList: only owner");
        _;
    }
    
    modifier onlyActive() {
        require(active, "StudentQuiz: not active");
        _;
    }

    function addStudentQuiz (string memory name, uint8 total, uint8 grade) public onlyOwner onlyActive returns(uint256) {
        if (exists(name))
            return studentQuizIndexName[name];
        require (!compareStrings(name, ""), "portfolio: invalid name");
            
        StudentQuizStruct memory q;
        q.name = name;
        q.total = total;
        q.grade = grade;
        q.atempt = 1;
        
        studentQuizInfo.push(q);
        uint256 index = studentQuizInfo.length;
        studentQuizIndexName[name] = index;
        emit StudentGradeUpdated(name, total, grade, q.atempt);
        return index;
    }
    
    function delStudentQuiz (string memory name) public onlyOwner onlyActive returns (bool) {
        if (!exists(name))
            return false;

        uint256 indexToDelete = studentQuizIndexName[name]-1;
        uint256 indexToMove = studentQuizInfo.length-1;
        string memory keyToMove = studentQuizInfo[indexToMove].name;
        
        studentQuizInfo[indexToDelete] = studentQuizInfo[indexToMove];
        studentQuizIndexName[keyToMove] = indexToDelete+1;

        delete studentQuizIndexName[name];
        studentQuizInfo.pop();

        emit StudentGradeDeleted(name);
        return true;
    }
    
    function updateStudentQuiz (string memory name, uint8 total, uint8 grade) public onlyOwner onlyActive returns (bool) {
        if (!exists(name))
            return false;
        
        uint256 index = studentQuizIndexName[name]-1;
        
        studentQuizInfo[index].name = name;
        studentQuizInfo[index].total = total;
        studentQuizInfo[index].grade = grade;
        studentQuizInfo[index].atempt = studentQuizInfo[index].atempt + 1;
        
        emit StudentGradeUpdated(name, total, grade, studentQuizInfo[index].atempt);
        return true;
    }    
    
    function changeActive () public onlyOwner returns (bool) {
        active = !active;
        return active;
    }
    
    function exists(string memory name) public view returns (bool) {
        if (studentQuizIndexName[name] == 0)
            return false;
        else
            return true;
    }    

    function getProject (string memory name) public view returns (StudentQuizStruct memory) {
        require (exists(name), "not exists");
        uint256 index = studentQuizIndexName[name]-1;
        return studentQuizInfo[index];
    }
    
    function getProject (uint256 index) public view returns (StudentQuizStruct memory) {
        require ((index > 0 ) && (index <= studentQuizInfo.length), "out of range");
        return studentQuizInfo[index-1];
    }
    
    function getIndexByName (string memory name) public view returns (uint256) {
        return studentQuizIndexName[name];
    }
    
    function countStudentQuiz () public view returns (uint256) {
        return studentQuizInfo.length;
    }
     
    function listStudentQuiz () public view returns (StudentQuizStruct[] memory) {
        return studentQuizInfo;
    }
    function compareStrings(string memory a, string memory b) private pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }   
}