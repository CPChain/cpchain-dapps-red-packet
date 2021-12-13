// Deploy Redpack
var Redpack = artifacts.require("./Redpack.sol");

module.exports = function(deployer) {
        deployer.deploy(Redpack); //"参数在第二个变量携带"
};
