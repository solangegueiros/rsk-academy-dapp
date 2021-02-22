// SPDX-License-Identifier: MIT
pragma solidity 0.8.1;

contract Quote {
  string private message;

  function setQuote(string memory _message) public {
      message = _message;
  }

  function getQuote() public view returns (string memory) {
      return message;
  }
}
