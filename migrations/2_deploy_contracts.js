// Deploy Redpack
var Redpacket = artifacts.require("./Redpacket.sol");

module.exports = function(deployer) {
    deployer.deploy(Redpacket); //"参数在第二个变量携带"
};
