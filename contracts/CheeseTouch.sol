//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

// ERC721 Enumarable Extension Contract
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract CheeseTouch is ERC721Enumerable {
    address private _owner; // Contract owner's address
    uint256 public counter; // Counter for the number of tokens minted
    uint256 public deadline; // Time for token

    string private _baseTokenURI; // Base token URI

    // Checkpoint struct for the checkpointing mechanism
    struct Checkpoint {
        uint256 tokenId;
        uint256 lastTransfer;
        address owner;
    }

    // Mapping for checkpoints
    mapping(uint256 => Checkpoint) internal checkpoints;

    // Mapping for users scores
    mapping(address => uint256) internal scores;

    // Constructor
    constructor(
        string memory _name,
        string memory _symbol,
        string memory baseTokenURI
    ) ERC721(_name, _symbol) {
        _owner = msg.sender; // Sets owner

        _baseTokenURI = baseTokenURI; // Set base token URI

        deadline = 1 days; // Set the deadline for the game

        // Set first checkpoint
        checkpoints[counter] = Checkpoint(counter, block.timestamp, msg.sender);

        // Game is starting with the owner
        _mint(msg.sender, counter); // Mints the token with tokenID '0'

        counter += 1; // Increment the counter to '1'
    }

    // Modifier
    modifier onlyOwner() {
        require(msg.sender == _owner, "Only the owner can do this");
        _;
    }

    // Only create cheese when there is no nft token 'live'
    modifier canCreateCheese() {
        // Current token id
        uint256 currentTokenId = counter - 1;

        // Current checkpint struct
        Checkpoint memory c = checkpoints[currentTokenId];

        require(
            c.lastTransfer + deadline < block.timestamp,
            "Cannot create cheese while the game is in progress"
        );
        _;
    }

    // Overrides _baseURI function from ERC721Enumerable
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    // Only owner can set the base token URI
    function setBaseTokenURI(string memory _uri) public onlyOwner {
        _baseTokenURI = _uri;
    }

    // Overrides _beforeTokenTransfer function for checking can user send token
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override {
        require(
            checkpoints[tokenId].lastTransfer + deadline > block.timestamp,
            "Cheese token can be transferred only in 24 hours after it transferred"
        );
        super._beforeTokenTransfer(from, to, tokenId);
    }

    // Overrides _aftertokenTransfer function for setting new checkpoint
    function _afterTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override {
        checkpoints[tokenId].lastTransfer = block.timestamp;
        checkpoints[tokenId].owner = to;
        super._afterTokenTransfer(from, to, tokenId);
    }

    // Anyone can mint a new token if there is only one token 'live'
    function createCheese() public canCreateCheese {
        // Add point to the user
        scores[ownerOf(counter - 1)] += 1;

        // Burns the token
        _burn(counter - 1);

        _mint(msg.sender, counter); // Mint current tokenID to msg.sender

        checkpoints[counter].lastTransfer = block.timestamp; // Set last transfer time
        checkpoints[counter].owner = msg.sender; // Set owner
        checkpoints[counter].tokenId = counter; // Set token id

        counter += 1; // Increment the counter
    }

    // Getter function for current checkpoint
    function getCurrentCheckpoint() public view returns (Checkpoint memory) {
        return checkpoints[counter - 1];
    }

    // Overrides totalSupply function for returning the total number of tokens
    // In cheese touch game there will be always only one token so totalSupply function always returning 1 as the result
    function totalSupply() public pure override returns (uint256) {
        return 1;
    }

    // @notice Override _mint function
    // @notice Remove _beforeTokenTransfer & _afterTokenTransfer from the overridden mint function
    //         to prevent the token from being transferred before the game starts
    function _mint(address to, uint256 tokenId) internal override {
        require(to != address(0), "ERC721: mint to the zero address");
        require(!_exists(tokenId), "ERC721: token already minted");

        _balances[to] += 1;
        _owners[tokenId] = to;

        emit Transfer(address(0), to, tokenId);
    }

    // @notice Override _burn function
    // @notice Remove _beforeTokenTransfer & _afterTokenTransfer from the overridden burn function
    //         to prevent the token from being transferred when burn
    function _burn(uint256 tokenId) internal virtual override {
        address owner = ERC721.ownerOf(tokenId);

        // Clear approvals
        _approve(address(0), tokenId);

        _balances[owner] -= 1;
        delete _owners[tokenId];

        emit Transfer(owner, address(0), tokenId);
    }

    // @notice Getter function for past result
    function getPastResult(uint256 start, uint256 end)
        public
        view
        returns (Checkpoint[] memory)
    {
        // Condifitons for valid pagination
        require(start >= 0, "Start index cannot be negative");
        require(start <= end, "Start index cannot be greater than end index");
        require(
            end <= counter,
            "End index cannot be greater than total number of tokens"
        );

        // Initialize the array
        Checkpoint[] memory result = new Checkpoint[](end - start);

        // Intialize the length of array for gas optimization
        uint256 length = end - start;
        for (uint256 index = 0; index < length; index++) {
            result[index] = checkpoints[start + index];
        }

        return result;
    }

    // @notice Getter function for current checkpoint information
    function getInfo()
        public
        view
        returns (Checkpoint memory checkpoint, bool isDead)
    {
        checkpoint = checkpoints[counter - 1];
        isDead = checkpoint.lastTransfer + deadline < block.timestamp;
    }

    // @notice Getter function for user's score
    function getScore(address user) public view returns (uint256) {
        return scores[user];
    }

    // @notice Getter function for msg.sender's score
    function getScore__sender() public view returns (uint256) {
        return getScore(msg.sender);
    }
}
