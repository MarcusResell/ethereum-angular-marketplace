# Avoiding common attacks

There's quite a lot too think about when developing smart contracts, especially security-wise.
This document uses https://consensys.github.io/smart-contract-best-practices/recommendations/ as reference.

## External calls

It is known that introducing external calls can be a factor of unexpected risk and vulnerability.
This projects has two external calls made by a contract, both in the `MarketplaceStores.sol` contract.
They are both made in modifier functions:

- `modifier stopInEmergency {if (!marketplace.isStopped()) _;}`
- `modifier isStorekeeper() {require(marketplace.isStoreOwner(msg.sender) == true, "Only owner allowed"); _;}`
  These functions only read values from the `Marketplace.sol` contract, the first one reads a value that can only be set by the contract owner of the `Marketplace.sol` contract, and the second one conditionally checks an address against the owner address of the `Marketplace.sol` contract.
  The owner address itself is set on deploy inside the constructor and cannot be changed afterwards, hence not exposing unneccessary risk unless the owner of the contract is foul.

## Avoid state changes after external calls

There is one external call which affects state change due to it being neccessary to check if a user is allowed to create a store or not. The merchant status is handled inside the `Marketplace.sol` contract and creating stores is done inside the `MarketplaceStores.sol` contract.
The function that makes this call is controlled by the circuit breaker mentioned in the `design_pattern_decisions.md` document.

## Be aware of the tradeoffs between send(), transfer(), and call.value()()

The contracts in this project only uses the `transfer()` function when transferring ether.

## Favor pull over push for external calls

The `withdraw()` function as well as the functions deleting stores also take extra caution about re-entrancy attacks by utilizing a balances mapping instead of transferring value directly between two different addresses. The balance is always set to zero before the transfer is being initiated.
Worth to mention is that the `payable` function also refunds excessive value sent to the contract for a product.

## Don't assume contracts are created with zero balance

There is no assumption made about the contracts balances, instead the `balances` mapping handles everything that has to do with value.

## Remember that on-chain data is public

Nothing in the contracts are secret, and the functions that exists are necessary to show the data inside the UI of the web application.
The only functions that are not supposed to be executed by everyone are protected with modifier functions.

## In 2-party or N-party contracts, beware of the possibility that some participants may "drop offline" and not return

There is no interest for any party using these contracts to try and grief or delay any other party.

## Use assert() and require() properly

Only require() is used in these contracts to verify input to functions.

## Beware rounding with integer division

Only three basic rules of arithmetic are used, addition, subtraction and multiplication, hence guarding against possible rounding errors caused by for example division.

## Remember that Ether can be forcibly sent to an account

There is no function that neither strictly or at all checks the balance of the contract.

## Lock pragmas to specific compiler version

All pragma versions are locked to 0.4.24

## Avoid using tx.origin

tx.origin is never used

## Timestamp Dependence

Timestamps are not used

## Multiple Inheritance Caution

Multiple inheritance is not used
