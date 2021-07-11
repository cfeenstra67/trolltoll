var lib = require("./lib.js");

var Migrations = artifacts.require("./Migrations.sol");

module.exports = function(deployer) {
  lib.unlockAccount(web3.eth, 3600 * 1000 * 3);
  deployer.deploy(Migrations);
};
