# dMarket

dMarket is my (first) take on building a marketplace application in Solidity. It is powered by a local development Ethereum blockchain through Ganache and developed with the help of Truffle. The frontend is an Angular 6 project.
The project contains three roles: Administrator, Merchant and Shopper. All three roles automatically get redirected to their main view once entering the page. Administrators manage merchants, merchants manage their stores and inventory, shoppers... Manage shopping. 

# How to run the project

## Project requirements

The following is required to run the project
- Truffle (`npm install -g truffle`)
- Ganache CLI (`npm install -g ganache-cli`) or the Ganache UI application
- MetaMask
- Installning Angular CLI may be needed depending on your environment
	- npm install -g @angular/cli

## Setting it up
Clone the repository and browse the directory with a terminal. Inside the `ethDapp` folder type `npm install`.
After installing has complete, start your local blockchain by running `ganache-cli` or by using the application.
If you have not done it before, copy the mnemonic phrase that you get as output, open up MetaMask and click on restore from seed phrase. Paste the seed phrase and enter a password.
Once you are logged in, in the network settings of MetaMask choose `localhost:8545`.

Open up a new terminal window and browse the project directory. Go to the contracts directory and run `truffle migrate`.
Finally run `npm run dev` to start off the local web server, it will run on port `4200`.

If everything is set up right you can now browse the site at `http://localhost:4200/`.

## Using the web application


## Running tests
To run the test, browse the project directory and run the command `truffle test`, you should see all tests executing successfully.

## Troubleshooting
If you are getting weird errors visiting the site, try running `truffle migrate --reset` first. 
