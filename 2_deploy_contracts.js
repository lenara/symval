const SymbolicValueMantra = artifacts.require("SyMantra");

module.exports = function (deployer) {
    deployer.deploy(SymbolicValueMantra);
};