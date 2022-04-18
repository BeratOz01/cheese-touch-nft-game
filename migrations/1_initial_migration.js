const Cheese = artifacts.require("CheeseTouch");

module.exports = function (deployer, network, accounts) {
  // Constant parameters for contract constructor
  const name = "Cheese Touch";
  const symbol = "CHEESE";
  const baseTokenURI = "https://api.cheese.com/v1/cheeses/";

  // Owner of contract
  const owner = accounts[0];

  // Deploy the contract
  deployer.deploy(Cheese, name, symbol, baseTokenURI, {
    from: owner,
  });
};
