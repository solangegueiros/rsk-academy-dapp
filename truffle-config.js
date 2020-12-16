const fs = require('fs');
const path = require("path");
const HDWalletProvider = require('@truffle/hdwallet-provider');

const mnemonic = fs.readFileSync(".secret").toString().trim();

module.exports = {
  contracts_build_directory: path.join(__dirname, "app/src/contracts"), 

  networks: {
    develop: {
      port: 8545
    },    
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
      //gas: 8000000,
    },    
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.5.4",
      //version: "0.7.5",
    }
  }
};
