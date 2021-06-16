// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

// https://ropsten.etherscan.io/address/0xe7b75279244a83f6945c0d012c44d03cdd9f5dd4
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract InterviewToken is ERC20 {
    event Log(string fn, uint256 amount);
    
    // constructor (string memory name, string memory symbol) ERC20(name, symbol) {
    constructor () public ERC20("InterviewToken", "INTERVIEW") {
        uint256 supply = 1000000000;
        _mint(msg.sender, supply * 10 ** uint(decimals()));
        emit Log("_mint", supply * 10 ** uint(decimals()));
        require(balanceOf(msg.sender) == supply * 10 ** uint(decimals()), 
            "Total supply balance is off");
    }
}