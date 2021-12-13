// Deploy Redpack
var Redpack = artifacts.require("./Redpack.sol");

module.exports = function(deployer) {
        deployer.deploy(Redpack, "0x99a1241822011A95aBF6d32c00BB3dF0A6b717Ee"); //"参数在第二个变量携带"
};
