// Artifacts: test/cheese.test.js.map
const Cheese = artifacts.require("CheeseTouch");

// Test helpers
const { time } = require("@openzeppelin/test-helpers");
const { assert } = require("chai");
const truffleAssert = require("truffle-assertions");

// Web3
const Web3 = require("web3");

// Contract Parameters from migrations/1_initial_migration.js
const name = "Cheese Touch";
const symbol = "CHEESE";

contract("cheese", (accounts) => {
  // Global variables for all tests
  let gameContract;
  const owner = accounts[0];
  const user1 = accounts[1];
  const user2 = accounts[2];

  before(async () => {
    gameContract = await Cheese.deployed();
  });

  describe("Cheese", () => {
    it("Contract should be deployed", async () => {
      const address = await gameContract.address;
      assert.notEqual(address, 0x0);
      assert.notEqual(address, "");
    });

    it("Contract should initilization with correct parameters", async () => {
      const _name = await gameContract.name();
      const _symbol = await gameContract.symbol();
      assert.equal(_name, name);
      assert.equal(_symbol, symbol);
    });

    it("When game starts contract should initilize checkpoint mapping", async () => {
      const _checkpoint = await gameContract.getCurrentCheckpoint();

      assert.equal(_checkpoint.tokenId, 0);
      assert.equal(_checkpoint.owner, owner);
    });

    it("No one can create cheese until Cheese NFT does not transfer for deadline", async () => {
      await truffleAssert.reverts(
        gameContract.createCheese.sendTransaction({ from: user1 }),
        "Cannot create cheese while the game is in progress"
      );
    });

    it("When NFT transferred to another user checkpoint should updated", async () => {
      let duration = time.duration.hours(1);

      await time.increase(duration);

      await gameContract.transferFrom.sendTransaction(owner, user1, 0, {
        from: owner,
      });

      let ownerOfTokenZero = await gameContract.ownerOf(0);
      assert.equal(ownerOfTokenZero, user1);

      let _checkpoint = await gameContract.getCurrentCheckpoint();

      assert.equal(_checkpoint.owner, user1);
      assert.equal(_checkpoint.tokenId, 0);
    });

    it("Token cannot be transferred after 24 hours from last transfer", async () => {
      let duration = time.duration.hours(30);

      await time.increase(duration);

      await truffleAssert.reverts(
        gameContract.transferFrom.sendTransaction(user1, user2, 0, {
          from: user1,
        }),
        "Cheese token can be transferred only in 24 hours after it transferred"
      );
    });

    it("After 24 hours from last trasnfer getInfo function should return isDead true", async () => {
      const info = await gameContract.getInfo();
      assert.equal(info.isDead, true);
    });

    it("After 24 hours from last transfer token will be dead and anyone can create new cheese and games starts again", async () => {
      await gameContract.createCheese.sendTransaction({ from: user1 });

      const info = await gameContract.getInfo();
      assert.equal(info.isDead, false);

      const _checkpoint = await gameContract.getCurrentCheckpoint();
      assert.equal(_checkpoint.tokenId, 1);
      assert.equal(_checkpoint.owner, user1);
    });
  });
});
