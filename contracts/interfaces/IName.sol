// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

interface IName {
    struct NameDetail {
        address owner;
        address nameContract;
        string name;
    }

    function owner() external view returns (address);

    function getName() external view returns (string memory);
}
