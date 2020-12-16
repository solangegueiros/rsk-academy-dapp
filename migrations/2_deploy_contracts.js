const Name = artifacts.require("Name");
const MasterName = artifacts.require("MasterName");

module.exports = function (deployer) {
  deployer.deploy(MasterName);
};
