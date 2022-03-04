// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

interface ICertificate {
    struct CertificateDetail {
        address studentAddress;
        string studentName;
        string courseName;
        string storageHash;
    }

    /**
     * @dev Adds a new quiz that will be mandatory for a student
     * to get the certificate
     *
     * Returns the index of the added quiz on the quizList
     *
     * Only admin can add a quiz for a course certification.
     */
    function addQuiz(string memory name) external returns (uint256);

    /**
     * @dev Removes the given quiz from the certification quiz list.
     *
     * Returns a boolean value indicating if the quiz has been deleted
     *
     * Only admin can delete the quiz from the list.
     */
    function deleteQuiz(string memory name) external returns (bool);

    /**
     * @dev Validates if a student qualifies for the certificate
     * which means that student has made and passed all the quizzes
     * on the certification quiz list.
     */
    function validateStudent(address studentAddress) external returns (bool);

    /**
     @dev Registers a student for a new certificate. Student must have a deployed
     * `Name` contract, must be approved (`validateStudent`) and should not exist
     * on the certificate list.
     *
     * Returns a boolean value indicating if the certificate has been created successfully.
     */
    function registerCertificate(
        address studentAddress,
        string memory studentName,
        string memory course,
        string memory storageHash
    ) external returns (bool);

    /**
     * @dev Updates the minimum quiz score for newly created certificates
     * Score will be evaluated over 100 points
     *
     * Only admin can update the minimun quiz score
     */
    function updateQuizMinimum(uint256 value) external returns (bool);

    /**
     * @dev Checks if a student has certificate for a giving course
     */
    function existCertificate(address studentAddress, string memory course) external view returns (bool);

    /**
     * @dev Checks if the giving quiz exists on the certification quiz list
     */
    function existQuiz(string memory name) external view returns (bool);

    function countQuiz() external view returns (uint256);

    /**
     * @dev Returns string array values indicate the certification quiz list
     */
    function getQuizzes() external view returns (string[] memory);

    /**
     * @dev Returns certificate info of a student for a giving course
     */
    function getCertificate(address studentAddress, string memory course)
        external
        view
        returns (CertificateDetail memory);
}
