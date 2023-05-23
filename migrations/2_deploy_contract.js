const Marketplace = artifacts.require("Marketplace");
const NFT = artifacts.require("NFT");
module.exports = function(deployer) {
  deployer.deploy(NFT);
  deployer.deploy(Marketplace,0);
  
};

