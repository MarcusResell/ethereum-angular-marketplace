var Marketplace = artifacts.require('./Marketplace.sol');
var MarketplaceStores = artifacts.require('./MarketplaceStores.sol');
var Ownable = artifacts.require('./library_contracts/Ownable.sol');

module.exports = function(deployer) {
  deployer.deploy(Ownable);
  deployer.deploy(Marketplace).then(function() {
    return deployer.deploy(MarketplaceStores, Marketplace.address);
  });

  deployer.link(Marketplace, Ownable);
  deployer.link(MarketplaceStores, Ownable);
};
