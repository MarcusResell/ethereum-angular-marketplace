# Design Pattern Decisions

## Fail early and fail loud

Both contracts use `require` statements instead of `if`-conditionals in their functions where it's necessary to determine input.

## Restricting Access

There are several modifier functions that restrict execution to only permitted addresses.
Such modifier functions are:

- stopInEmergency
- isOwner
- verifyAdmin
- isStorekeeper
- isOwnerOfStore

## Auto Deprecation

There is no need for auto deprecation due to the project not being required to expire after time.

## Mortal

The contract is not implementing the mortal design pattern. However, deleting stores (admin or merchant himself) will transfer the remaining balance to the merchants address.

## Pull over Push Payments

The withdrawal pattern is taken into consideration in the `withdrawStoreBalance()` function in `MarketplaceStores.sol` and also in the store deletion functions. The balance stored in the state is always set to zero before doing a transaction. There is also no direct transfers between two different addressen, the values transferred are instead kept note on in a balances variable.

## Circuit Breaker

The contracts uses a boolean in the Marketplace contract called `stopped` to determine if execution of certain functions are allowed.
The boolean is used in the `stopInEmergency` function modifier and halts all functions that changes any state in the two contracts if true.
Only the owner of the contract can toggle the `stopped` boolean. This is made sure by using the library `Ownable` from Zeppelin.

## State Machine

There is no real state machine implemented in the contracts, unfortunately due to time. Though the Product struct uses an ProductState enum to determine if the product is still for sale or if it has been removed.

## Speed bump

There is no speed bump implemented due to being too unattractive to merchants. Joke aside, this could definetely be of interest to stop any eventual malicious behavior. For now the circuit breaker will have to do.

# Test coverage

The tests files `marketplace_stores.test.js` and `marketplace.test.js` are found in the `test` folder in the project root.
The tests are run by running `truffle test`.

The tests run checks to see that the basic funcationality works.

- It's vital to see that the deployer of the contract gets the administrator status, or else there would be no possibility too interact in more than read operations.
- Admin should be able to grant merchant status to addresses or there would be no stores
- Non-admins should not be able to grant merchant status to addresses or there would be a security design flaw.
- Another important aspect to test is that the circuit breaker actually works.
- It's of course also important to test that merchants actually can create products, and only them.
- Final vital functionality to test is the ability for customers to buy a product
