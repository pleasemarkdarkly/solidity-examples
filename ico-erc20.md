# Ethereum ERC20 Crowd-sale Contract
This is a basic example of a crowd-sale with a brand new ERC20 token. First deploy the Sale contract, and then the ERC20 token contract. The ERC20 contract will require the Sale Contract's ethereum address. See attribution.<sup>[1](#footnote_001)</sup>

## Contract Features
- Creates/Mints 5+ million Tokens and holds them inside contract.
- ERC20 and Sale Contract both reference each other
- Converts payable ETH to TOKEN's directly to user
- ETH payed to contract is forwarded to a different wallet (holds ICO funds)
- Ability to turn on/off transfer of coins. (via sale contract)
- Token contributions will be removed from the Mint and transferred to the purchaser.
- Users that have tokens held can release them once time has passed without owner permission. 

## Contract Variables
- Crowd-sale ending on a specific block number
- Total token Supply
- ETH/TOKEN exchange rate
- Developers/Founders allocation, to be released at later date.

# Deployed Instructions
See [deploy-template_v0-sale](./scripts/deploy-template_v0-sale.ts) and [deploy-template_v0-token](./scripts/deploy-template_v0-token.ts) for specific deployment variables and [deploy-template](./scripts/deploy-template_v0-sale.md) for step by step example using this repository including verifying the contract with Etherscan.

1. Deploy the Sale contract first. **Be sure to change the token details (TOTAL_SUPPLY, EXCHANGE_RATE, FOUNDER_GROUP_ONE, FOUNDER_GROUP_TWO)** You will need a wallet address for ETH Sale proceeds (Example: 0x6FEFc3F6239F2A1aF8Fe093877BA2a1e81da4231) which will be funded after each contribution. `Sale("0x7824773BFFA00f2b20b2db3B5fCC22C3713542E9")`. The following will deploy the Sale's contract: 

```bash 
npx hardhat run --network alchemy ./scripts/deploy-template_v0-sale.ts
```

where ETH_PUBLIC_KEY is set to the owner's public key - creating contract [0xb92B3B34b5f5269407B7A24e1Cb98c553eFC41B4](https://ropsten.etherscan.io/address/0xb92B3B34b5f5269407B7A24e1Cb98c553eFC41B4#code)  Take note of the `Sale contract` and using the following to publish the contract on Etherscan. 

```bash
npx hardhat verify --network ropsten 0xb92B3B34b5f5269407B7A24e1Cb98c553eFC41B4 '0x6FEFc3F6239F2A1aF8Fe093877BA2a1e81da4231'
```

2. Once you have the Sale contract, deploy the Token contract. **Be sure to change the token details (TOTAL_SUPPLY, EXCHANGE_RATE, FOUNDER_GROUP_ONE, FOUNDER_GROUP_TWO)** and `createTokens` initial minted amount. When you deploy the Token contract, you must include the Sale contract address when you deploy the contract. Example: `Token("0xb92B3B34b5f5269407B7A24e1Cb98c553eFC41B4")`, and `npx hardhat run --network alchemy ./scripts/deploy-template_v0-token.ts` where `SALE_CONTRACT` is updated with the aforementioned contract - creating token contract [0x0F3CA246a7A3043FF92Ff46B63F93752688b385D](https://ropsten.etherscan.io/address/0x0F3CA246a7A3043FF92Ff46B63F93752688b385D#code)

3. Now you can finalize the process by running the `setup` function to the Sale contract. The setup function requires the aforementioned token contract address and an ending block number of when the ICO should end.  The owner of the contract can also end the sale at any time. __As of June 10, 2021 the average block time on Ethereum is 13.1 seconds or 5760 blocks per day.__ If ending block number is less than the current block the function fails, if ending block + current block is more than 10512000 blocks or the estimate for 5 years, then the function also fails. Edit the `Setup` function to change. Example: `setup("0x7824773BFFA00f2b20b2db3B5fCC22C3713542E9", 200000)` - [0x682392db4d184fc5e96c7dbf53b29c891d7158422ecd7935b484159ed633ca79](https://ropsten.etherscan.io/tx/0x682392db4d184fc5e96c7dbf53b29c891d7158422ecd7935b484159ed633ca79) 

4. **Your ICO has begun!** You can now send ETH to the Sale contract address to receive your new tokens! I sent 1 ETH with data: `0xd7bb99ba` to my Sale contract address. The user must send ETH or the transaction will fail! Example: 1 ETH - Data: `0xd7bb99ba` - Gas Limit: `80000` creating transaction [0xbf541f8b39d5b94670c909e85cec8035b7c30d178d2c6e5637e1ad395ca2d9b2](https://ropsten.etherscan.io/tx/0xbf541f8b39d5b94670c909e85cec8035b7c30d178d2c6e5637e1ad395ca2d9b2) This transaction sent 1 ETH to the ETH wallet address and also sent me 600 Tokens. 

5. Once you received your $100 million for the ICO you can close it at anytime with the `closeSale` function. Example: `closeSale()` creating transaction [](). The ICO Sale is over!

This ICO-sale contract will allow you to change owners, change token rate per ETH, hold tokens for a specific amount of time, and allow users that have tokens held. The Sale contract locks the tokens, once the set block height has been passed, the user can run `releaseHeldCoins()` (``) to the sale contract to receive their tokens if the time has passed! Example: []()

### Crowd-sale Contract
`function contribute() external payable` is the function for the purchaser to mint new tokens. (Data: `0xd7bb99ba`)

### ERC20 Additions
The ERC20 contract has a couple additions to be reviewed by you. When the token contract is deployed, it will require the Sale Contract address and will be set 1 and only 1 time. If you set an incorrect address when you deploy the ERC20 you'll have to re-deploy the sale and ERC20 again. This is done as a security precaution, 1 time set functions.

#### Minting Tokens
Minting Tokens call comes from the Sale contract, when the ERC20 is deployed it will force the Sale contract.
`function mintToken(address to, uint256 amount) external returns (bool success);`

Change "transfer" method from the Sale Contract. 
`function changeTransfer(bool allowed);`

### Hold Token Period

The Sale Contract will allow you to hold a specific amount of tokens for an amount of time before being released directly to address. The createHoldToken function requires an address and the amount of tokens given at end of period.
```
function createHeldCoins() internal {
  createHoldToken(FOUNDER_GROUP_ONE, 100000000000000000000000); // 100,000
  createHoldToken(FOUNDER_GROUP_TWO, 250000000000000000000000); // 250,000
}
```

You can change the amount of blocks in future to release. 
```
function createHoldToken(address _to, uint256 amount) internal {
...
  heldTimeline[_to] = block.number + 200000;
...
}
```

Once a time period as passed, the wallet owner can do a contract call to receive the tokens. (Data: `0x6ce5b3cf`)
```
function releaseHeldCoins()
```

### Attribution
<a name="footnote_001">1</a>The Sale contract was updated tp ^0.8.0 from [HunterLong](https://github.com/hunterlong/ethereum-ico-contract)'s ^0.4.21 Solidity contract. 

<a name="footnote_002">2</a>The project template was hacked from [PaulRBerg](https://github.com/paulrberg/solidity-template)'s template. 

<a name="footnote_003">3</a>Super awesome and helpful patterns from [PaulRBerg](https://github.com/paulrberg/contracts)'s repo and [Task's Solidity by Example Hack section](https://github.com/solidity-by-example/solidity-by-example.github.io). 


