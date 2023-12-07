// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SyMantra is ERC20 {
    address public owner;

    // Mapping to store the mantras of each token
    mapping(uint256 => string) public tokenMantras;

    // Counter to keep track of the next available token ID
    uint256 private nextTokenId;

    event TokenMinted(address indexed to, uint256 indexed tokenId, string mantra, uint256 quantity);
    event TokenTransferred(address indexed from, address indexed to, uint256 indexed tokenId, uint256 amount);
    event TokenBurned(address indexed from, uint256 indexed tokenId, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    constructor() ERC20("SymbolicValueToken", "SVT") {
        owner = msg.sender;
        nextTokenId = 1; // Start with token ID 1
    }

    function totalSupply() public view override returns (uint256) {
        return super.totalSupply();
    }

    function getTokenId() external view returns (uint256) {
        return nextTokenId;
    }

    function mintTokens(address to, string memory mantra, uint256 quantity) external onlyOwner {
        require(to != address(0), "Invalid recipient address");
        require(bytes(mantra).length > 0, "Mantra cannot be empty");
        require(quantity > 0, "Quantity must be greater than 0");

        for (uint256 i = 0; i < quantity; i++) {
            _mint(to, 1);
            uint256 newTokenId = nextTokenId;
            tokenMantras[newTokenId] = mantra;

            emit TokenMinted(to, newTokenId, mantra, 1);

            // Increment the counter for the next token ID
            nextTokenId++;
        }
    }

    function transfer(address to, uint256 amount) public override returns (bool) {
        require(to != address(0), "Invalid recipient address");
        require(amount > 0, "Transfer amount must be greater than 0");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");

        _transfer(msg.sender, to, amount);

        emit TokenTransferred(msg.sender, to, 1, amount);

        return true;
    }

    function burn(uint256 amount) external {
        require(amount > 0, "Burn amount must be greater than 0");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");

        _burn(msg.sender, amount);

        emit TokenBurned(msg.sender, 1, amount);
    }

    // Function to retrieve the mantra associated with a token
    function getTokenMantra(uint256 tokenId) external view returns (string memory) {
        return tokenMantras[tokenId];
    }
}
