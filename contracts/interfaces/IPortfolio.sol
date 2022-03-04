// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

interface IPortfolio {
    struct ProjectDetail {
        address projectAddress; // Key
        string name; // Key for IPortfolio.ProjectDetail
    }

    event PortfolioProjectAdded(address indexed projectAddress, string projectName);
    event PortfolioProjectDeleted(address indexed projectAddress, string projectName);

    /**
     * @dev Adds new project into student's portfolio.
     * Students cannot have more than one same type of project in their portfolio.
     *
     * Returns index of the project
     *
     * Emits {PortfolioProjectAdded} event
     */
    function addProject(address projectAddress, string memory projectName) external returns (uint256);

    /**
     * @dev Deletes project from portfolio project list.
     *
     * Emits {PortfolioProjectDeleted} event
     */
    function deleteProject(address projectAddress) external returns (bool);

    /**
     * @dev Admin changes {Projects} contract address which is attached to {Portfolio} contract
     */
    function changeProjectsContract(address projectsContractAddress) external returns (bool);

    /**
     * @dev Checks if student's project exists on the {Projects} contract list
     */
    function checkProjectByAddress(address projectAddress) external view returns (bool);

    function checkProjectByName(string memory projectName) external view returns (bool);

    /**
     * @dev Returns projects list
     */
    function getProjects() external view returns (IPortfolio.ProjectDetail[] memory);

    function getProjectByName(string memory projectName) external view returns (IPortfolio.ProjectDetail memory);

    function getProjectByAddress(address projectAddress) external view returns (IPortfolio.ProjectDetail memory);

    function getProjectByIndex(uint256 index) external view returns (IPortfolio.ProjectDetail memory);

    function getProjectIndex(address projectAddress) external view returns (uint256);

    function countProjects() external view returns (uint256);
}
