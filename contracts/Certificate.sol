// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "./interfaces/IQuiz.sol";
import "./interfaces/ICertificate.sol";
import "./interfaces/IName.sol";
import "./interfaces/IMasterName.sol";

/**
 * @dev This Certificate contract is exclusive for course Devs 2021-01!
 * This contract is solving an issue about retrieving student names from MasterName contract
 */
contract Certificate is AccessControl, ICertificate {
    using SafeMath for uint256;

    uint256 public constant decimalpercent = 100;

    ICertificate.CertificateDetail[] public certificateDetails;
    /**
     * @dev indexing by studentAddress and course
     */
    mapping(address => mapping(string => uint256)) public certificates;

    IQuiz public quiz;
    IMasterName public masterName;

    string[] public quizNames;
    mapping(string => uint256) public quizIds;
    uint256 public quizMinimum;

    modifier onlyOwner() {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Certificate: only owner");
        _;
    }

    constructor(address quizAddress, address masterNameAddress) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        quiz = IQuiz(quizAddress);
        masterName = IMasterName(masterNameAddress);
        quizMinimum = 60;
    }

    function addQuiz(string memory name) public override onlyOwner returns (uint256) {
        if (existQuiz(name)) return quizIds[name];

        quizNames.push(name);
        uint256 index = quizNames.length;
        quizIds[name] = index;
        return index;
    }

    function deleteQuiz(string memory name) public override onlyOwner returns (bool) {
        if (!existQuiz(name)) return false;

        uint256 indexToDelete = quizIds[name] - 1;
        uint256 indexToMove = quizNames.length - 1;
        string memory keyToMove = quizNames[indexToMove];
        quizNames[indexToDelete] = quizNames[indexToMove];
        quizIds[keyToMove] = indexToDelete + 1;
        delete quizIds[name];
        quizNames.pop();
        return true;
    }

    function registerCertificate(
        address studentAddress,
        string memory studentName,
        string memory course,
        string memory storageHash
    ) public override returns (bool) {
        require(masterName.existsOwner(studentAddress), "student must have a name contract");
        require(validateStudent(studentAddress), "student is not approved");

        uint256 index = _addCertificate(studentAddress, studentName, course, storageHash);
        if (index > 0) return true;
        else return false;
    }

    function updateQuizMinimum(uint256 value) public override onlyOwner returns (bool) {
        require(value <= decimalpercent, "Invalid quizMinimum");
        quizMinimum = value;
        return true;
    }

    function validateStudent(address studentAddress) public view override returns (bool) {
        bool pass = true;
        uint256 index;
        uint256 perc;

        for (uint256 i = 0; i < quizNames.length; i++) {
            index = quiz.getQuizIndex(studentAddress, quizNames[i]);

            if (index == 0) {
                pass = false;
                break;
            }

            IQuiz.QuizDetail memory info = quiz.getQuizByIndex(index);
            perc = (info.grade * decimalpercent) / info.total;

            if (perc < quizMinimum) {
                pass = false;
                break;
            }
        }

        return pass;
    }

    function existCertificate(address studentAddress, string memory course) public view override returns (bool) {
        if (certificates[studentAddress][course] == 0) return false;
        else return true;
    }

    function existQuiz(string memory name) public view override returns (bool) {
        if (quizIds[name] == 0) return false;
        else return true;
    }

    function countQuiz() public view override returns (uint256) {
        return quizNames.length;
    }

    function getQuizzes() public view override returns (string[] memory) {
        return quizNames;
    }

    function getCertificate(address studentAddress, string memory course)
        public
        view
        override
        returns (CertificateDetail memory)
    {
        CertificateDetail memory certificate;
        uint256 index = certificates[studentAddress][course];

        if (index > 0) {
            certificate = certificateDetails[index - 1];
        }

        return certificate;
    }

    function _addCertificate(
        address studentAddress,
        string memory studentName,
        string memory course,
        string memory storageHash
    ) private returns (uint256) {
        if (existCertificate(studentAddress, course)) return certificates[studentAddress][course];

        CertificateDetail memory c;
        c.studentAddress = studentAddress;
        c.studentName = studentName;
        c.courseName = course;
        c.storageHash = storageHash;

        certificateDetails.push(c);
        uint256 index = certificateDetails.length;
        certificates[studentAddress][course] = index;
        return index;
    }

    function compareStrings(string memory a, string memory b) private pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }
}
