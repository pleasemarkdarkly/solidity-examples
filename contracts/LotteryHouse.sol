// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Mutex {
    
    bool locked;
    modifier noReentrancy(){
        require(!locked, "Reentrant call");
        locked = true;
        _;
        locked = false;
    }
}

abstract contract Owned {

    address payable public owner;
    constructor() payable { 
        owner = payable(msg.sender); 
    }
    modifier onlyOwner {
        require(msg.sender == owner, "Only owner can call this function.");
        _;
    }
}

contract Destructible is Owned {
 
    function destroy() public onlyOwner {
        selfdestruct(owner);
    }
}

contract Lottery is Owned, Mutex {    
    uint public totalAmount;
    uint public rake;
    uint public numOfPlayers = 0;    
    
    // solhint-disable-next-line
    uint HOUSE_PERCENTAGE = 5;
    // solhint-disable-next-line
    uint MAX_PARTICIPANTS = 12;// 4200 finney or 4 ETH
    
    mapping (uint => address payable) private players;
    mapping (address => bool) private participated;
    enum State { Accepting, Distributing, Paid }
    State state;
    
    event Round(address participant, uint players, uint wager, uint pot);
    event Bonus(address source, uint sweetner, string message);
    event ChickenDinner(address winner, uint pot);
    
    constructor () payable {
        state = State.Accepting;
    }

    fallback() external payable {
        emit Bonus(msg.sender, msg.value, "fallback fn received additional funds");
    }
    
    receive() external payable {}
    
    function getPlayerCount() private view onlyOwner returns(uint){
        return numOfPlayers;
    }
    
    function getRakeBalance() private view onlyOwner returns(uint){
        return rake;
    }
    
    function transferRakeBalance(address payable house) public payable onlyOwner noReentrancy returns(bool){
        require(rake <= 50, "Insufficient rake balance to justify a transfer");
        require(state == State.Paid, "Rake payments are disabled during active rounds");
        (bool sent, ) = house.call{value: rake}("");
        require(sent, "Failure to send rake balance");
        return sent;
    }
    
    function setHousePercent(uint percent) private onlyOwner noReentrancy {
        require(state == State.Paid, 
            "House percent can only be changed when no rounds are open");
        
        // solhint-disable-next-line
        uint MAX_HOUSE_PERCENT = 15;
        require(percent < MAX_HOUSE_PERCENT, 
            "Contract hardcoded with house rake percent ceiling");
        HOUSE_PERCENTAGE = percent;
    }
    
    function wager() external payable joinable noReentrancy {
        // solhint-disable-next-line
        uint MIN_BET = 300 * 10 ** 15; // finney $150 minimum 
        // solhint-disable-next-line
        uint MAX_BET = 350 * 10 ** 15; // finney $175 maximum 
        
        require(MAX_BET >= msg.value && msg.value >= MIN_BET, 
            "Individual wagers must be 300 to 350 finney");
        require(participated[msg.sender] == false, 
            "Individuals may not wager more than once");
        require(numOfPlayers < MAX_PARTICIPANTS, 
            "Only 12 players per round");
        
        players[numOfPlayers] = payable(msg.sender);
        participated[msg.sender] = true;
        numOfPlayers++;
        totalAmount += msg.value;
        
        emit Round(msg.sender, numOfPlayers, msg.value, totalAmount);
        
        if (numOfPlayers == MAX_PARTICIPANTS){
            state = State.Distributing;
            if (state == State.Distributing){
                selectWinner();
            }
        }
    }
    
    modifier joinable(){
        require (state == State.Accepting, "Wagers are welcome");
        _;
    }
    
    modifier isFinished(){
        require (state == State.Distributing, "Wagers are closed");
        _;
    }
    
    modifier restatable(){
        require (state == State.Paid, "Winner winner, chicken dinner");
        _;
    }
    
    function getBalance() public view returns(uint){
        return totalAmount;
    }
    
    function selectWinner() private isFinished noReentrancy (){
        uint winner = random() % MAX_PARTICIPANTS;
        rake = totalAmount * HOUSE_PERCENTAGE;
        uint winnings = totalAmount - rake;
        (bool sent,) = players[winner].call{value: winnings }("");
        require(sent, "Failed to payout winner, no Chicken Dinner, sorry");
        emit ChickenDinner(players[winner], totalAmount);
        state = State.Paid;
        restart();
    }
    
    function restart() private restatable {
        totalAmount = 0;
        numOfPlayers = 0;
        for (uint i = 0; i < MAX_PARTICIPANTS; i++){
            participated[players[i]] = false;
        }
        state = State.Accepting;
    }
    
    function random() private view returns(uint) {
        uint participants;
        for (uint i = 0; i <= MAX_PARTICIPANTS; i++){
            uint part = uint(keccak256(abi.encodePacked(
                block.difficulty,
                blockhash(block.number - 10),
                block.timestamp,
                totalAmount, 
                rake,
                players[i])));
                
            participants += uint(keccak256(abi.encodePacked(participants, part))); 
        }
        
        uint rnd = uint(keccak256(abi.encodePacked(block.difficulty,
                                blockhash(block.number - MAX_PARTICIPANTS), 
                                block.timestamp,
                                participants,
                                totalAmount,
                                rake)));
        return rnd;
    }
}
