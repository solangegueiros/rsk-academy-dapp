// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

interface IProjects {
    struct ProjectDetail {
        bool active;
        address master;
        string name;
        string description;
        string contractAbi;
    }

    event ProjectAdded(string name, string description);
    event ProjectDeleted(string name);
    event ProjectUpdated(string name, string description, address indexed master, bool active);

    /**
     * @dev Admin creates a new project which can be associated
     * with projects that students deploy to add into their portfolios.
     *
     * Emits {ProjectAdded} event
     */
    function createProject(string memory name, string memory description) external returns (uint256);

    /**
     * @dev Admin can delete any project by its name from the {Projects} list
     *
     * Emits {ProjectDeleted} event
     */
    function deleteProject(string memory name) external returns (bool);

    /**
     * @dev Admin can modify any created project by its name
     *
     * Emits {ProjectUpdated} event
     */
    function updateProject(
        string memory name,
        bool activeProject,
        address master,
        string memory description,
        string memory contractAbi
    ) external returns (bool);

    /**
     * @dev Admin can lock/unlock {Projects} contract which will not allow
     * to add/delete/modify any project from the list
     */
    function toggleActive() external returns (bool);

    /**
     * @dev Checks if the project with a given name is in the list.
     */
    function exists(string memory name) external view returns (bool);

    /**
     * @dev Checks if the project with a given name is active.
     */
    function isActive(string memory name) external view returns (bool);

    /**
     * @dev Returns project's details
     */
    function getProjectByName(string memory name) external view returns (ProjectDetail memory);

    function getProjectByIndex(uint256 index) external view returns (IProjects.ProjectDetail memory);

    /**
     * @dev Returns master (owner) of a project.
     */
    function getProjectMaster(string memory name) external view returns (address);

    function getProjectIndex(string memory projectName) external view returns (uint256);

    function countProjects() external view returns (uint256);
}
