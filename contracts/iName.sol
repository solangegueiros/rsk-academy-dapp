// SPDX-License-Identifier: MIT
pragma solidity 0.8.1;


interface iName {
    function owner() external view returns (address);
    function getName() external view returns (string memory);
}

