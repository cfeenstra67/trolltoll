var Riddler = artifacts.require("./Riddler.sol");

module.exports = function(deployer) {
  // 5% Service fee
  deployer.deploy(Riddler, 5);
};
