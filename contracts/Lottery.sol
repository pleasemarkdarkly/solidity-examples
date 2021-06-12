// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Lottery{
    
    uint public totalAmount;
    uint public numOfPlayers = 0;
    mapping (uint => address payable) public players;
    mapping (address => bool) public participated;
    enum State {Accepting, Distributing, Paid}
    State internal state;
    
    constructor(){
        state = State.Accepting;
    }

    receive () external payable { }
    fallback() external payable { }

    function wager() public payable joinable{
        if(msg.value > 0){
            if(participated[msg.sender] == false){                
                players[numOfPlayers] = payable(msg.sender);
                participated[msg.sender] = true;
                numOfPlayers++;
                if (numOfPlayers == 5){
                    state = State.Distributing;
                }
            }
            totalAmount += msg.value;
            if (state == State.Distributing){
                selectWinner();
            }
        }
    }
    
    modifier joinable(){
        require (state == State.Accepting, "Accepting");
        _;
    }
    modifier isFinished(){
        require (state == State.Distributing, "Distributing");
        _;
    }
    modifier restatable(){
        require (state == State.Paid, "Paid");
        _;
    }
    function selectWinner() private isFinished{
        uint winner = random()%5;                
        payable(players[winner]).transfer(totalAmount);        
        state = State.Paid;
        restart();
    }
    
    function restart() private restatable{
        totalAmount = 0;
        numOfPlayers = 0;
        for (uint i = 0; i < 5; i++){
            participated[players[i]] = false;
        }
        state = State.Accepting;
    }
    
    function random () private view returns (uint) {        
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp)));        
    }
}