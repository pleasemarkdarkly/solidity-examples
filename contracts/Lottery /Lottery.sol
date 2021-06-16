// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Lottery{
    
    uint public totalAmount;
    uint public numOfPlayers = 0;
    mapping (uint => address payable) public players;
    mapping (address => bool) public participated;
    enum State {Accepting, Distributing, Paid}
    State internal state;
    string public generator = "https://pleasemarkdarkly.github.io/";
    
    event Log(address me, address gambler, uint amount, string message);

    constructor(){
        state = State.Accepting;
    }

    receive () external payable { }
    fallback() external payable { }

    function wager() public payable joinable{
        emit Log(address(this), msg.sender, msg.value, "wager");
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

    // function getPlayers() public view returns (){}
    
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
        emit Log(address(this), msg.sender, msg.value, "selectWinner");
        uint winner = random() % 5;                        
        payable(players[winner]).transfer(totalAmount);               
        console.log(""); 
        console.log("Lottery (selectWinner): randomIndex:%s", winner);
        console.log("%s won %s", players[winner], totalAmount);
        console.log("");
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
    
    function random () private returns (uint) {        
        uint rnd = uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp))); 
        emit Log(address(this), msg.sender, rnd, "random");        
        return rnd;     
    }
}