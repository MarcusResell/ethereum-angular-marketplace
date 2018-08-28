var Marketplace = artifacts.require('./Marketplace.sol');

contract('Marketplace', function(accounts) {
  const owner = accounts[0];
  const alice = accounts[1];
  const bob = accounts[2];
  const emptyAddress = '0x0000000000000000000000000000000000000000';

  it('Owner gets created with administrator status', async () => {
    let marketplace = await Marketplace.deployed();
    let ownerIsAdmin = await marketplace.isAdministrator(owner);
    assert.strictEqual(ownerIsAdmin, true);
  });

  it('The number of merchants should be zero when just created', async () => {
    let marketplace = await Marketplace.new();
    let storeOwnerCount = await marketplace.getStoreOwnerCount();
    assert.equal(storeOwnerCount, 0);
  });

  it('Should add a new merchant if admin sender', async () => {
    let marketplace = await Marketplace.new();
    await marketplace.createStoreOwner(alice, { from: owner });
    let isStoreOwner = await marketplace.isStoreOwner(alice);
    assert.strictEqual(isStoreOwner, true);
  });

  it('Should not add a new merchant if not admin sender', async () => {
    let marketplace = await Marketplace.new();
    try {
      await marketplace.createStoreOwner(alice, { from: bob });
      assert.fail('Should throw error');
    } catch (error) {
      assert.equal(
        error.message,
        'VM Exception while processing transaction: revert'
      );
    }
  });

  it('Should delete a merchant', async () => {
    let marketplace = await Marketplace.new();
    await marketplace.createStoreOwner(alice, { from: owner });
    await marketplace.removeMerchant(alice, { from: owner });
    let isStoreOwner = await marketplace.isStoreOwner(alice);
    assert.strictEqual(isStoreOwner, false);
  });

  it('Should enable emergency break', async () => {
    let marketplace = await Marketplace.new();
    await marketplace.toggleContractActive({ from: owner });
    await marketplace.createStoreOwner(alice, { from: owner });
    let isStoreOwner = await marketplace.isStoreOwner(alice);
    assert.strictEqual(isStoreOwner, false);
  });
});
