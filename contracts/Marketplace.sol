pragma solidity 0.4.24;

import "../library_contracts/Ownable.sol";

/*
Online marketplace contract.
This contract manages and keeps track of administrators, store owners, statuses and provides functions to support the stores contract.
*/

/** @title Marketplace. */
contract Marketplace is Ownable {

    /* Used for emergency stop */
    bool private stopped = false;

    /* Variable storeOwnerCount tracks the number of store owners */
    uint storeOwnerCount;

    /* Variable administratorCount tracks the number of administrators */
    uint administratorCount;

    /* Array that holds all merchants */
    address[] merchants;

    /* Mapping between address and position in merchants array */
    mapping (address => uint) public indexOfMerchant;

    /* Mapping between address and administrator status */
    mapping (address => bool) public administrators;

    /* Mapping between address and merchant status */
    mapping (address => bool) public storeOwners;


    // Emitted contract events
    event AdminCreated(address _address);
    event StoreOwnerCreated(address _address);
    event StoreOwnerDeleted(address _address);

    /** @dev Modifier function to check if sender is owner of contract  */
    modifier isOwner() {
        require(msg.sender == owner, "Only owner allowed");
        _;
    }

    /** @dev Emergency stop modifier which restricts certain functions from executing if toggled on */
    modifier stopInEmergency {if (!stopped) _;}

    /** @dev Checks if the msg.sender is admin */
    modifier verifyAdmin() {require (administrators[msg.sender] == true, "Administrator status required"); _;}

    /** @dev Deployer address is made owner of contract and also given administrator status */
    constructor() public{
        owner = msg.sender;
        administrators[msg.sender] = true;
        storeOwnerCount = 0;
        administratorCount = 1;
    }

    /** @dev Returns the number of current store owners.
      * @return The number of store owners.
      */
    function getStoreOwnerCount() public view returns (uint) {
        return storeOwnerCount;
    }

    /** @dev Returns the number of administrators
      * @return The number of administrators.
      */
    function getAdministratorCount() public view returns (uint) {
        return administratorCount;
    }

    /** @dev Creates a new Marketplace admin.
      * @param newAdminAddress The address of which to set as admin.
      */
    function createAdmin(address newAdminAddress) public stopInEmergency() verifyAdmin() {
        administrators[newAdminAddress] = true;
        administratorCount += administratorCount;
        emit AdminCreated(newAdminAddress);
    }

    /** @dev Checks if given address is administrator.
      * @param _address Address to check for administrator status.
      * @return True if address is admin, otherwise false.
      */
    function isAdministrator(address _address) public view returns (bool) {
        return administrators[_address];
    }

    /** @dev Grants given address merchant status and allows them to create stores.
      * @param _address Address of which to grant merchant status.
      */
    function createStoreOwner(address _address) public stopInEmergency() verifyAdmin() {
        if(storeOwners[_address] == false) {
            storeOwners[_address] = true;
            storeOwnerCount += storeOwnerCount;
            merchants.push(_address);
            indexOfMerchant[_address] = merchants.length - 1;
            emit StoreOwnerCreated(_address);
        }
    }

    /** @dev Removes merchant status from address.
      * @param _address Address of which to remove merchant status.
      */
    function removeMerchant(address _address) public stopInEmergency() verifyAdmin() {
        if(storeOwners[_address] == true) {
            storeOwners[_address] = false;

            uint index = indexOfMerchant[_address];
            // if (!index) return;

            if (merchants.length > 1) {
                merchants[index] = merchants[merchants.length-1];
                delete(merchants[merchants.length-1]); // recover gas
            }
            merchants.length--;

            storeOwnerCount -= storeOwnerCount;
            emit StoreOwnerCreated(_address);
        }
    }

    /** @dev Check if given address has merchant status.
      * @param _address Address to check for merchant status.
      * @return True if merchant, otherwise false
      */
    function isStoreOwner(address _address) public view returns (bool) {
        return storeOwners[_address];
    }

    /** @dev Returns number of merchants.
      * @return Number of merchants in Marketplace
      */
    function getNumberOfMerchants() public view returns (uint) {
        return merchants.length;
    }

    /** @dev Returns address of merchant in given array position.
      * @param index Index in merchants array of which to return merchant address.
      * @return The merchant address corresponding to the index.
      */
    function getMerchantByArrayId(uint index) public view returns (address) {
        return merchants[index];
    }

    /** @dev Emergency stop function only callable by owner of contract
      */
    function toggleContractActive() public onlyOwner {
        stopped = !stopped;
    }

    function isStopped() public view returns (bool) {
        return stopped;
    }
}