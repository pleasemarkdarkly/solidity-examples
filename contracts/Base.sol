// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "hardhat/console.sol";

error BaseError();

contract Base {
    string public description;

    constructor(string memory _description) {
        console.log("Deploying a Base Contract with a description =>", _description);
        description = _description;
    }

    function getDescription() public view returns (string memory) {
        return description;
    }

    function setDescription(string memory _description) public {
        console.log("Changing description from '%s' to '%s'", description, _description);
        description = _description;
    }

    function throwError() external pure {
        revert BaseError();
    }
}
