// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "./IName.sol";

interface IMasterName {
    event NameContractAdded(address indexed owner, address indexed nameContract, string name);
    event NameContractRemoved(address indexed owner, address indexed nameContract);

    /**
     * @dev Adds deployed Name Contract to the contract list.
     * Student will be stored as the owner of the contract
     *
     * Emits {NameContractAdded} event
     */
    function addName(address contractAddress, string memory name) external returns (bool);

    /**
     * @dev Adds deployed Name Contract to the contract list.
     * Admin can associate any student account with a contract as the owner.
     *
     * Emits {NameContractAdded} event
     */
    function addContract(
        address ownerAddress,
        address contractAddress,
        string memory name
    ) external returns (bool);

    /**
     * @dev Student removes his/her own deployed contract from contract list.
     * This is necessary when student needs to change name value in the contract.
     * Contract value cannot be edited after deployed. It has to be removed from list
     * and new deployed contract with correct name value should be added to the list.
     *
     * Emits {NameContractRemoved} event
     */
    function removeOwnContract() external returns (bool);

    /**
     * @dev Admin can remove student's associated contract from the list.
     *
     * Emits {NameContractRemoved} event
     */
    function removeContract(address ownerAddress) external returns (bool);

    /**
     * @dev Admin changes {Students} contract address which should be associated with {MasterName}
     */
    function changeStudentsContract(address studentsContractAddress) external returns (bool);

    /**
     * @dev Checks if student has already a deployed {Name} contract on the list.
     * Student cannot have more than one deployed contract on the list.
     */
    function existsOwner(address account) external view returns (bool);

    /**
     * @dev Checks if a deployed {Name} contract is on the contract list.
     */
    function existsNameContract(address contractAddress) external view returns (bool);

    /**
     * @dev Checks if the given name and the name value of the target {Name} contract are the same.
     */
    function checkName(address contractAddress, string memory name) external view returns (bool);

    /**
     * @dev Returns name value of the target {Name} contract
     */
    function getName(address contractAddress) external view returns (string memory);

    /**
     * @dev Returns all the {Name} contract details on the contract list.
     */
    function getContracts() external view returns (IName.NameDetail[] memory);

    function countContracts() external view returns (uint256);

    function getOwnerAddress(address contractAddress) external view returns (address);

    function getNameDetailByOwner(address account) external view returns (IName.NameDetail memory);

    function getNameDetailByContract(address contractAddress) external view returns (IName.NameDetail memory);

    function getNameDetailByIndex(uint256 index) external view returns (IName.NameDetail memory);
}
