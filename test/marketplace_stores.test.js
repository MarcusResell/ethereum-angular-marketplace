var Marketplace = artifacts.require('./Marketplace.sol');
var MarketplaceStores = artifacts.require('./MarketplaceStores.sol');

contract('MarketplaceStores', function(accounts) {
  const owner = accounts[0];
  const alice = accounts[1];
  const bob = accounts[2];
  const emptyAddress = '0x0000000000000000000000000000000000000000';

  it('Should not be able to create store if not merchant', async () => {
    let marketplace = await Marketplace.new();
    let stores = await MarketplaceStores.new(marketplace.address);

    try {
      await stores.createStore('Store name', { from: bob });
      assert.fail('Should throw error');
    } catch (error) {
      assert.equal(
        error.message,
        'VM Exception while processing transaction: revert'
      );
    }
  });

  it('Should not be able to add product if not merchant', async () => {
    let marketplace = await Marketplace.new();
    let stores = await MarketplaceStores.new(marketplace.address);

    try {
      await stores.addProduct(0, 'Product name', 'description', 5000, 10, {
        from: bob
      });
      assert.fail('Should throw error');
    } catch (error) {
      assert.equal(
        error.message,
        'VM Exception while processing transaction: revert'
      );
    }
  });

  it('Should be able to add store if merchant', async () => {
    let marketplace = await Marketplace.new();
    let stores = await MarketplaceStores.new(marketplace.address);

    await marketplace.createStoreOwner(alice, { from: owner });
    await stores.createStore('Store name', { from: alice });
    let storeIds = await stores.getStoreIdsByMerchant(alice);
    assert.strictEqual(storeIds[0].toString(), '0');
  });

  it('Should be able to add product to store if merchant', async () => {
    let marketplace = await Marketplace.new();
    let stores = await MarketplaceStores.new(marketplace.address);

    await marketplace.createStoreOwner(alice, { from: owner });
    await stores.createStore('Store name', { from: alice });
    await stores.addProduct(0, 'Product name', 'description', 5000, 10, {
      from: alice
    });
    let storeIds = await stores.getStoreIdsByMerchant(alice);
    let storeId = +storeIds[0].toString();
    let productIds = await stores.getProductIdsInStore(storeId);
    let productId = +productIds[0].toString();
    let product = await stores.getProductById(productId);

    assert.strictEqual(product[1], 'Product name');
  });

  it('Should be able to buy a product', async () => {
    let marketplace = await Marketplace.new();
    let stores = await MarketplaceStores.new(marketplace.address);

    await marketplace.createStoreOwner(alice, { from: owner });
    await stores.createStore('Store name', { from: alice });
    await stores.addProduct(0, 'Product name', 'description', 5000, 10, {
      from: alice
    });
    await stores.buyProduct(0, 2, { from: bob, value: 10000 });
    let product = await stores.getProductById(0);
    let quantity = +product[6].toString();
    assert.strictEqual(quantity, 8);
    let store = await stores.getStoreById(0);
    let balance = +store[3].toString();
    assert.strictEqual(balance, 10000);
  });
});
