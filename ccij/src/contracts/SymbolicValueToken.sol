// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// I am first using current standards to see if they meet what we are looking for


// Interface for ERC165
interface IERC165 {
    function supportsInterface(bytes4 interfaceId) external view returns (bool);
}

// Interface for ERC20
interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

// Interface for ERC20 with metadata
interface IERC20Metadata is IERC20 {
    function name() external view returns (string memory);
    function symbol() external view returns (string memory);
    function decimals() external view returns (uint8);
    function tokenURI(uint256 tokenId) external view returns (string memory);
}

// Interface for the upgradeable contract
interface IUpgradeable {
    function upgradeTo(address newImplementation) external;
}

contract SymbolicERC20 is IERC20Metadata, IUpgradeable {
    string private _name;
    string private _symbol;
    uint8 private _decimals;
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;
    uint256 private _totalSupply;

    mapping(uint256 => string) private _tokenURIs;

    address public owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor(string memory name_, string memory symbol_, uint8 decimals_) {
        _name = name_;
        _symbol = symbol_;
        _decimals = decimals_;
        owner = msg.sender;
    }

    function name() public view override returns (string memory) {
        return _name;
    }

    function symbol() public view override returns (string memory) {
        return _symbol;
    }

    function decimals() public view override returns (uint8) {
        return _decimals;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(tokenId < _totalSupply, "URI query for nonexistent token");
        return _tokenURIs[tokenId];
    }

    function totalSupply() public view override returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) public view override returns (uint256) {
        return _balances[account];
    }

    function transfer(address recipient, uint256 amount) public override returns (bool) {
        _transfer(msg.sender, recipient, amount);
        return true;
    }

    function allowance(address owner, address spender) public view override returns (uint256) {
        return _allowances[owner][spender];
    }

    function approve(address spender, uint256 amount) public override returns (bool) {
        _approve(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address sender, address recipient, uint256 amount) public override returns (bool) {
        _transfer(sender, recipient, amount);
        _approve(sender, msg.sender, _allowances[sender][msg.sender] - amount);
        return true;
    }

    function _transfer(address sender, address recipient, uint256 amount) internal {
        require(sender != address(0), "Transfer from the zero address");
        require(recipient != address(0), "Transfer to the zero address");
        require(_balances[sender] >= amount, "Transfer amount exceeds balance");
        
        _balances[sender] -= amount;
        _balances[recipient] += amount;
        emit Transfer(sender, recipient, amount);
    }

    function _approve(address owner, address spender, uint256 amount) internal {
        require(owner != address(0), "Approve from the zero address");
        require(spender != address(0), "Approve to the zero address");

        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }

    function mint(address account, uint256 amount, string memory tokenURI_) internal {
        require(account != address(0), "Mint to the zero address");

        _totalSupply += amount;
        _balances[account] += amount;
        _tokenURIs[_totalSupply - 1] = tokenURI_;
        emit Transfer(address(0), account, amount);
    }

    function airdrop(address[] memory _recipients, uint256[] memory _amounts) external onlyOwner {
        require(_recipients.length == _amounts.length, "Invalid input lengths");
        for (uint256 i = 0; i < _recipients.length; i++) {
            require(_recipients[i] != address(0), "Invalid recipient address");
            require(_balances[msg.sender] >= _amounts[i], "Insufficient balance for airdrop");
            
            _transfer(msg.sender, _recipients[i], _amounts[i]);
        }
    }
/**
* @dev selfDestruct() and upgrade()
* These are considered "red flags" from the point of view of financial tokens
* but they will play in our favor for creating a token that does NOT want to be speculative

*/
    function selfDestruct() external onlyOwner {
        selfdestruct(payable(owner));
    }

    function upgradeTo(address newImplementation) external override onlyOwner {
        // Only owner can upgrade the contract
        IUpgradeable(newImplementation).upgradeTo(newImplementation);
    }
}


