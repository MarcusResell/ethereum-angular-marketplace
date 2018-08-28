# dMarket

dMarket is my (first) take on building a marketplace application in Solidity. It is powered by a local development Ethereum blockchain through Ganache and developed with the help of Truffle. The frontend is an Angular 6 project.
The project contains three roles: Administrator, Merchant and Shopper. All three roles automatically get redirected to their main view once entering the page. Administrators manage merchants, merchants manage their stores and inventory, shoppers... Manage shopping.

# How to run the project

## Project requirements

### Important about versions

If you are running this on a fresh install of Ubuntu 16.0.4 you will need to run these commands before continuing:

- `sudo apt install curl`
- `curl -sL https://deb.nodesource.com/setup_9.x | sudo -E bash -`
- `sudo apt-get install -y nodejs`
  This is to make sure you have installed and updated versions of node and npm

The following is required to run the project

- Truffle (`npm install -g truffle`)
- Ganache CLI (`npm install -g ganache-cli`) or the Ganache UI application
- MetaMask
- Installning Angular CLI may be needed depending on your environment
- - npm install -g @angular/cli

## Setting it up

Clone the repository and browse the directory with a terminal. Inside the `ethDapp` folder type `npm install`.
After installing has complete, start your local blockchain by running `ganache-cli` or by using the application.
If you have not done it before, copy the mnemonic phrase that you get as output, open up MetaMask and click on restore from seed phrase. Paste the seed phrase and enter a password.
Once you are logged in, in the network settings of MetaMask choose `localhost:8545`.

Open up a new terminal window and browse the project directory. Go to the contracts directory and run `truffle migrate`.
Finally run `npm run dev` to start off the local web server, it will run on port `4200`.

If everything is set up right you can now browse the site at `http://localhost:4200/`.

# Using the web application

The site has as previously mentioned three types of roles, administrator, merchant and shopper.
When you first visit the site you will automatically identified as an administrator.
If you see a blank page while browsing the site, try hitting the refresh button, it's most likely due to Angular not detecting UI changes when the data comes from the blockchain.
Also, not all events are listened for in the UI, so if you make a change like adding a product, store or updating prices, try refreshing the browser if the changes are not shown.
`Important note:` Some transactions require more Gas than the default limit in MetaMask, if you get an error, please try and increase the Gas limit in MetaMask for the transactions.

## Administrator

As an administrator you will have access to the admin page. On this page you can add an address into an input field to make that address a merchant on the marketplace. The button will only enabled if the input is a valid Ethereum address.
Try adding one of the other account addresses from MetaMask, dont forget to sign the transaction or nothing will happen.
It is also possible to revoke merchant status from currently active merchants by clicking the remove button in the list below.

## Merchant

Merchant will, just as administrators, automatically be redirected to the merchant page. From here you have an overview of all your stores. You can also create new stores, just dont forget to sign the transaction in MetaMask!
By clicking on the button to manage a store, you will be taken to a more detailed view of that particular store. From here you can add products, manage products (change price and stock), and remove products. You can also remove the store from this view, or withdraw any balance the store has collected from your sales.

## Shopper

As a shopper you will see a dashboard containing all the stores currently available in the marketplace. You can then browse any store you see, and eventually buy any product that caught your eye. Just dont forget to sign the transaction!

## Running tests

To run the test, browse the project directory and run the command `truffle test`, you should see all tests executing successfully.
All tests are located in the `tests` folder.

# Troubleshooting

If you are getting weird errors visiting the site, try running `truffle migrate --reset` first.
Some transactions require more Gas than the default in MetaMask, please increase the amount of gas for the transaction if it fails
