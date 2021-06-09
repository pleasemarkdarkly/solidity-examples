// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

abstract contract ERC20 {
  uint public totalSupply;
  function balanceOf(address who) public virtual returns (uint);
  function allowance(address owner, address spender) public virtual returns (uint);
  function transfer(address to, uint value) public payable virtual returns (bool ok);
  function transferFrom(address from, address to, uint value) public virtual returns (bool ok);
  function approve(address spender, uint value) public virtual returns (bool ok);
  function mintToken(address to, uint256 value) public virtual returns (uint256);
  function changeTransfer(bool allowed) public virtual;
}

contract Sale {
    uint256 public maxMintable;
    uint256 public totalMinted;
    uint public endBlock;
    uint public startBlock;
    uint public exchangeRate;
    bool public isFunding;
    ERC20 public Token;
    address payable public ETHWallet;
    uint256 public heldTotal;

    bool private configSet;
    address public creator;

    mapping (address => uint256) public heldTokens;
    mapping (address => uint) public heldTimeline;

    event Contribution(address from, uint256 amount);
    event ReleaseTokens(address from, uint256 amount);

    uint public EXCHANGE_RATE = 600;
    uint public TOTAL_SUPPLY = 5000000000000000000000000;

    constructor(address payable _wallet) {
        startBlock = block.number;
        maxMintable = TOTAL_SUPPLY; 
        ETHWallet = _wallet;
        isFunding = true;
        creator = msg.sender;
        createHeldCoins();
        exchangeRate = 600;
    }

    function setup(address token_address, uint end_block) public{
        require(!configSet);
        Token = ERC20(token_address);
        endBlock = end_block;
        configSet = true;
    }

    function closeSale() external {
      require(msg.sender==creator);
      isFunding = false;
    }

    fallback() external payable {
        require(msg.value>0);
        require(isFunding);
        require(block.number <= endBlock);
        uint256 amount = msg.value * exchangeRate;
        uint256 total = totalMinted + amount;
        require(total<=maxMintable);
        totalMinted += total;
        ETHWallet.transfer(msg.value);
        Token.mintToken(msg.sender, amount);
        emit Contribution(msg.sender, amount);
    }

    receive() external payable {        
        emit Contribution(msg.sender, msg.value);
    }

    function contribute() external payable {
        require(msg.value>0);
        require(isFunding);
        require(block.number <= endBlock);
        uint256 amount = msg.value * exchangeRate;
        uint256 total = totalMinted + amount;
        require(total<=maxMintable);
        totalMinted += total;
        ETHWallet.transfer(msg.value);
        Token.mintToken(msg.sender, amount);
        emit Contribution(msg.sender, amount);
    }

    function updateRate(uint256 rate) external {
        require(msg.sender==creator);
        require(isFunding);
        exchangeRate = rate;
    }

    function changeCreator(address _creator) external {
        require(msg.sender==creator);
        creator = _creator;
    }

    function changeTransferStats(bool _allowed) external {
        require(msg.sender==creator);
        Token.changeTransfer(_allowed);
    }

    function createHeldCoins() internal {
        address FOUNDER_GROUP_ONE = 0x6FEFc3F6239F2A1aF8Fe093877BA2a1e81da4231; 
        address FOUNDER_GROUP_TWO = 0xB772C38aCa8fac0FB50Fd01899ef3Dfa8B7DF628; 
        createHoldToken(msg.sender, 1000);
        createHoldToken(FOUNDER_GROUP_TWO, 100000000000000000000000);
        createHoldToken(FOUNDER_GROUP_ONE, 100000000000000000000000);
    }

    function getHeldCoin(address _address) public payable returns (uint256) {
        return heldTokens[_address];
    }

    function createHoldToken(address _to, uint256 amount) internal {
        heldTokens[_to] = amount;
        heldTimeline[_to] = block.number + 0;
        heldTotal += amount;
        totalMinted += heldTotal;
    }

    function releaseHeldCoins() external {
        uint256 held = heldTokens[msg.sender];
        uint heldBlock = heldTimeline[msg.sender];
        require(!isFunding);
        require(held >= 0);
        require(block.number >= heldBlock);
        heldTokens[msg.sender] = 0;
        heldTimeline[msg.sender] = 0;
        Token.mintToken(msg.sender, held);
        emit ReleaseTokens(msg.sender, held);
    }
}