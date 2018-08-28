pragma solidity ^0.4.23;

import "../library_contracts/Ownable.sol";


import "./Marketplace.sol";

/*
Contract for managing stores in the Marketplace contract.
--------------------
--------------------.
*/

/** @title MarketplaceStores. */
contract MarketplaceStores is Ownable{

    /* Variable to hold a reference to the instance of the Marketplace contract */
    Marketplace public marketplace;

    /* Address of the Marketplace contract */
    address public marketplaceAddress;

    /* Used for emergency stop mechanism */
    bool private stopped = false;

    /* Used for generating product id numbers */
    uint productIndex;

    /* Used for generating store id numbers */
    uint storeIndex;

    /* Array that holds all Stores */
    Store[] public storesArr;

    /* Mappping between store id and store index inside storesArr */
    mapping (uint => uint) public indexOfStore;

    /* Mapping between merchant address and array of ids relating to their stores */
    mapping (address => uint[]) public merchantStoreIds;

    /* Array that holds all products */
    Product[] public productsArr;

    /* Mapping between product id and product index inside productsArr */
    mapping (uint => uint) public indexOfProduct;

    /* Mapping between store id and an array of products relating to that store */
    mapping (uint => uint[]) public storeProductIds;

    /* ProductState enum with two states, ForSale and Removed */
    enum ProductState { ForSale, Removed }

    /** @dev Stores Store data
      * @param id Store id.
      * @param merchant Address of store owner (merchant).
      * @param name Store name.
      * @param balance Store balance.
      */
    struct Store {
        uint id;
        address merchant;
        string name;
        uint balance;
    }

    /** @dev Stores product data
      * @param id Product id.
      * @param name Product name.
      * @param description Product description.
      * @param price Product price.
      * @param state Product state.
      * @param storeId StoreId that product belongs to.
      * @param quantity Remaining product quantity.
      */
    struct Product {
        uint id;
        string name;
        string description;
        uint price;
        ProductState state;
        uint storeId;
        uint quantity;
    }

    // Emitted contract events
    event StoreCreated(uint id);
    event StoreDeleted(uint id);
    event ProductCreated(uint id, string name, string description, uint price, uint storeId, uint quantity);
    event ProductDeleted(uint id, uint storeId);
    event ProductPriceUpdated(uint id, uint price);
    event ProductQuantityUpdated(uint id, uint quantity);
    event ProductPriceAndQuantityUpdated(uint id, uint price, uint quantity);
    event ProductSold(uint id, uint storeId, uint price, uint quantity, uint total, address buyer);
    event StoreBalanceWithdraw(address merchant, uint amount, uint storeId);

    /** @dev Emergency stop modifier which restricts certain functions from executing if toggled on */
    modifier stopInEmergency {if (!marketplace.isStopped()) _;}

    /** @dev Modifier function to check if sender is of merchant status  */
    modifier isStorekeeper() {require(marketplace.isStoreOwner(msg.sender) == true, "Only owner allowed"); _;}

    /** @dev Modifier function to check if sender is owner of store  */
    modifier isOwnerOfStore(uint id) {require(storesArr[indexOfStore[id]].merchant == msg.sender, "Only merchant of store allowed"); _;}


    /** @dev Contract constructor, initializes with reference to Marketplace contract.
      * @param _marketplaceAddress Address of related Marketplace contract.
      */
    constructor(address _marketplaceAddress) public {
        owner = msg.sender;
        marketplaceAddress = _marketplaceAddress;
        marketplace = Marketplace(marketplaceAddress);

        productIndex = 0;
        storeIndex = 0;
    }

    /** @dev Creates a new store where msg.sender is the merchant.
      * @param name Store name.
      * @return The new store id
      */
    function createStore(string name) public isStorekeeper() stopInEmergency returns (uint) {
        Store memory newStore = Store(storeIndex, msg.sender, name, 0);
        storesArr.push(newStore);
        merchantStoreIds[msg.sender].push(storeIndex);
        indexOfStore[storeIndex] = storesArr.length - 1;
        storeIndex++;
        emit StoreCreated(newStore.id);
        return newStore.id;
    }

    /** @dev Returns the current number of stores.
      * @return Number of current stores.
      */
    function getStoreCount() public view returns (uint) {
        return storesArr.length;
    }

    /** @dev Returns Store data related to id.
      * @param _id Store id.
      * @return id Id of Store.
      * @return merchant Store owner address.
      * @return name Store name
      * @return balance Store balance
      */
    function getStoreById(uint _id) public view returns (uint id, address merchant, string name, uint balance) {
        id = storesArr[indexOfStore[_id]].id;
        merchant = storesArr[indexOfStore[_id]].merchant;
        name = storesArr[indexOfStore[_id]].name;
        balance = storesArr[indexOfStore[_id]].balance;
        return (id, merchant, name, balance);
    }

    /** @dev Returns related store ids for given address.
      * @param _address Owner of stores to return.
      * @return Array that holds id numbers of related stores for address
      */
    function getStoreIdsByMerchant(address _address) public view returns (uint[]) {
        return merchantStoreIds[_address];
    }

    /** @dev Adds a new product to existing store
      * @param storeId Id of Store that will hold the product.
      * @param name Product name.
      * @param description Product description.
      * @param price Product price (Wei).
      * @param quantity Product quantity (stock amount).
      * @return Id of created Product.
      */
    function addProduct(uint storeId, string name, string description, uint price, uint quantity)
	public isStorekeeper
    isOwnerOfStore(storeId)
    stopInEmergency
    returns (uint) {
        Product memory product = Product(
            productIndex,
            name,
            description,
            price,
            ProductState.ForSale,
            storeId,
            quantity
            );
        productsArr.push(product);
        indexOfProduct[productIndex] = productsArr.length - 1;
        storeProductIds[indexOfStore[storeId]].push(indexOfProduct[productIndex]);
        productIndex++;
        emit ProductCreated(product.id, product.name, product.description, product.price, product.storeId, product.quantity);
        return product.id;
    }

    /** @dev Returns Product ids for a given Store id.
      * @param storeId Id of Store for which to return Product ids.
      * @return Array of Product ids related to given Store id.
      */
    function getProductIdsInStore(uint storeId) public view returns (uint[]) {
        return storeProductIds[indexOfStore[storeId]];
    }

    /** @dev Return Product data related to Product id.
      * @param productId Id of Product for which to return data.
      * @return id Product id.
      * @return name Product name.
      * @return description Product description.
      * @return price Product price.
      * @return state Product state.
      * @return storeId Store id that product belongs to.
      * @return quantity Remaining quantity for product.
      */
    function getProductById(uint productId) public view returns (
        uint id,
        string name,
        string description,
        uint price,
        uint state,
        uint storeId,
        uint quantity
        ) {
        id = productsArr[indexOfProduct[productId]].id;
        name = productsArr[indexOfProduct[productId]].name;
        description = productsArr[indexOfProduct[productId]].description;
        price = productsArr[indexOfProduct[productId]].price;
        state = uint(productsArr[indexOfProduct[productId]].state);
        storeId = productsArr[indexOfProduct[productId]].storeId;
        quantity = productsArr[indexOfProduct[productId]].quantity;
        return (id, name, description, price, state, storeId, quantity);
    }

    /** @dev Updates price for given Product id.
      * @param productId Id of Product for which to update price.
      * @param price The new price of the Product.
      */
    function updateProductPrice(uint productId, uint price)
    public
    stopInEmergency
    isStorekeeper
    isOwnerOfStore(productsArr[indexOfProduct[productId]].storeId) {
        require(price > 0, "Price must be positive");
        Product storage product = productsArr[indexOfProduct[productId]];
        product.price = price;
        emit ProductPriceUpdated(productId, price);
    }

    /** @dev Updates quantity for given Product id.
      * @param productId Id of Product for which to update quantity.
      * @param quantity The new quantity of the Product.
      */
    function updateProductQuantity(uint productId, uint quantity)
    public
    stopInEmergency
    isStorekeeper
    isOwnerOfStore(productsArr[indexOfProduct[productId]].storeId) {
        Product storage product = productsArr[indexOfProduct[productId]];
        product.quantity = quantity;
        emit ProductQuantityUpdated(productId, quantity);
    }

    /** @dev Updates price and quantity for given Product id.
      * @param productId Id of Product for which to update price and quantity.
      * @param price The new price of the Product.
      * @param quantity The new quantity of the Product.
      */
    function updateProductPriceAndQuantity(uint productId, uint price, uint quantity)
    public
    stopInEmergency
    isStorekeeper
    isOwnerOfStore(productsArr[indexOfProduct[productId]].storeId)
    {
        require(price > 0, "Price must be positive");
        Product storage product = productsArr[indexOfProduct[productId]];
        product.quantity = quantity;
        product.price = price;
        emit ProductPriceAndQuantityUpdated(productId, price, quantity);
    }

    /** @dev Deletes a products from the Product array.
      * @param productId Id of Product to delete.
      */
    function deleteProduct(uint productId)
    public
    stopInEmergency
    isStorekeeper
    isOwnerOfStore(productsArr[indexOfProduct[productId]].storeId)
    {
        Product storage product = productsArr[indexOfProduct[productId]];
        product.state = ProductState.Removed;

        uint index = 0;
        uint productCountInStore = storeProductIds[indexOfStore[product.storeId]].length;

        // Set removed state for product
        productsArr[indexOfProduct[productId]].state = ProductState.Removed;

        // Find the index of the Product in the storeProductIds mapping array
        for (uint i = 0; i < productCountInStore; i++) {
            if(storeProductIds[indexOfStore[product.storeId]][i] == productId) {
                index = i;
                break;
            }
        }

        // Move the last element of the array to the index position, then delete the duplicate, dont care about order
        if (productCountInStore > 1) {
            storeProductIds[indexOfStore[product.storeId]][index] = storeProductIds[indexOfStore[product.storeId]][productCountInStore-1];
            delete(storeProductIds[indexOfStore[product.storeId]][productCountInStore-1]); // recover gas
        }
        // Reduce the size of the mapped array
        storeProductIds[indexOfStore[product.storeId]].length--;
        emit ProductDeleted(productId, product.storeId);
    }

    /** @dev Withdraws Store balance to its corresponding merchant.
      * @param storeId Id of Store of which to withdraw balance from.
      */
    function withdrawStoreBalance(uint storeId)
    public
    stopInEmergency
    isStorekeeper
    isOwnerOfStore(storeId)
    {
        require(storesArr[indexOfStore[storeId]].balance > 0, "Balance must be greated than zero");

        uint balance = storesArr[indexOfStore[storeId]].balance;

        // Set balance to zero before transfering funds to prevent re-entrance attack
        storesArr[indexOfStore[storeId]].balance = 0;
        storesArr[indexOfStore[storeId]].merchant.transfer(balance);
        emit StoreBalanceWithdraw(storesArr[indexOfStore[storeId]].merchant, balance, storeId);
    }

     /** @dev Remove specified Store from market.
      * Removes any product mappings.
      * Deletes products for store to product mappings.
      * Sets Product state in productsArr to Removed
      * Refunds any remaining balance to merchant of store.
      * @param storeId Id of Store of which to remove.
      */
    function removeStore(uint storeId)
    public
    stopInEmergency
    isStorekeeper
    isOwnerOfStore(storeId)
    {
        uint index = indexOfStore[storeId];

        // Send remaining balance to merchant
        if(storesArr[indexOfStore[storeId]].balance > 0) {
            uint balance = storesArr[indexOfStore[storeId]].balance;
            storesArr[indexOfStore[storeId]].balance = 0;
            storesArr[indexOfStore[storeId]].merchant.transfer(balance);
        }

        // Mark products in products array as removed
        for(uint x = 0; x < storeProductIds[indexOfStore[storeId]].length; x++) {
            productsArr[indexOfProduct[storeProductIds[indexOfStore[storeId]][x]]].state = ProductState.Removed;
        }
        // Delete products mapping
        delete storeProductIds[indexOfStore[storeId]];

        if (storesArr.length > 1) {
            storesArr[index] = storesArr[storesArr.length-1];
            delete(storesArr[storesArr.length-1]); // recover gas
        }

        // Find index of correct Store in the merchants Store mapping array
        if (merchantStoreIds[msg.sender].length > 1) {
            uint merchantMappingIndex = 0;
            for(uint i = 0; i < merchantStoreIds[msg.sender].length; i++) {
                if(merchantStoreIds[msg.sender][i] == indexOfStore[storeId]) {
                    merchantMappingIndex = i;
                    break;
                }
            }

            // Move the last element of the array to the index position, then delete the duplicate, dont care about order
            merchantStoreIds[msg.sender][index] = merchantStoreIds[msg.sender][merchantStoreIds[msg.sender].length-1];
            delete(merchantStoreIds[msg.sender][merchantStoreIds[msg.sender].length-1]); // recover gas
        }

        // Reduce the size of the mapping array
        merchantStoreIds[msg.sender].length--;
        // Reduce the size of the storesArr
        storesArr.length--;
        emit StoreDeleted(storeId);
    }

    /** @dev Buy a product.
      * @param productId Id of Product of which to buy.
      * @param quantity Quantity of product of which to buy.
      */
    function buyProduct(uint productId, uint quantity)
    public
    payable
    stopInEmergency
    {
        Product storage product = productsArr[indexOfProduct[productId]];
        require(product.state == ProductState.ForSale, "Product is not for sale");
        require(product.quantity >= quantity, "Not enough product in stock");
        uint totalPrice = quantity * product.price;
        require(msg.value >= totalPrice, "Not enough value sent");

        // Refund excess value sent
        if (msg.value > totalPrice) {
            uint excessEther = msg.value - totalPrice;
            msg.sender.transfer(excessEther);
		}

        product.quantity -= quantity;
        storesArr[indexOfStore[product.storeId]].balance += totalPrice;
        emit ProductSold(product.id, product.storeId, product.price, quantity, totalPrice, msg.sender);
    }
}