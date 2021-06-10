# [Solidity](https://github.com/pleasemarkdarkly/solidity-ts-template/blob/main/solidity-cheatsheet.md) Template

![Solidity Hardhat Typescript Waffle Graphic](./.readme.png)

Includes:

- [Hardhat](https://github.com/nomiclabs/hardhat): compile and run the smart contracts on a local development network
- [TypeChain](https://github.com/ethereum-ts/TypeChain): generate TypeScript types for smart contracts
- [Ethers](https://github.com/ethers-io/ethers.js/): renowned Ethereum library and wallet implementation
- [Waffle](https://github.com/EthWorks/Waffle): tooling for writing comprehensive smart contract tests
- [Solhint](https://github.com/protofire/solhint): linter
- [Prettier Plugin Solidity](https://github.com/prettier-solidity/prettier-plugin-solidity): code formatter

__This is a GitHub template, which means you can reuse it as many times as you want. You can do that by clicking the "Use this template" button at the top of the page.__

## Usage

### Prerequisites

Set up your .env with the respective values:

```sh
cp -v .env.example .env
```

_Alchemy requires the API URL and ETH Private Key, Infura requires the API KEY and Mnemonic_

* [ALCHEMY_API_URL](https://dashboard.alchemyapi.io/)
* [ETH_PRIVATE_KEY](https://metamask.zendesk.com/hc/en-us/articles/360015289632-How-to-Export-an-Account-Private-Key)
* [MNEMONIC](https://metamask.zendesk.com/hc/en-us/articles/360015290032-How-to-Reveal-Your-Seed-Phrase-Secret-Recovery-Phrase)
* [INFURA_API_KEY](https://infura.io/)
* [ETHERSCAN_API_KEY](https://etherscan.io/)
* REPORT_GAS=true

Before running any command, make sure to install dependencies:

```sh
yarn
```

### Prettier

```sh
yarn lint:prettier
```

### Linting 

If you want to re-initialize Solhint's configuration file with all the default rules enabled:

```sh
yarn && solhint --init
```

Or replace the existing file with:

```json
{
  "extends": "solhint:default"
}
```

Lint all the files inside the `contracts` directory:

```sh
solhint 'contracts/**/*.sol'
```

Or use the included:

```sh
yarn lint:sol
```

Or both Prettier and Solhint:

```sh
yarn lint
```

### Compile

Compile the smart contracts with Hardhat:

```sh
yarn compile
```

### TypeChain

Compile the smart contracts and generate TypeChain artifacts:

```sh
yarn build
```

### Test

Run the Mocha tests:

```sh
yarn test
```

### Deploy contract to network 
_(requires Mnemonic and Infura API key)_

```sh
npx hardhat run --network rinkeby ./scripts/deploy.ts
```

### Or Deploy contract to Alchemy network
_(requires Alchemy API URL and Ethereum private key)_ The API URL is for the Ropsten network.

```sh
npx hardhat run scripts/deploy.ts --network alchemy
```

### 

### Validate a contract with Etherscan 
_(requires Etherscan API key)_

```sh
npx hardhat verify --network <network> <DEPLOYED_CONTRACT_ADDRESS> "Constructor argument 1"
```

For example:

```sh
npx hardhat verify --network ropsten 0x4ed4DDd7981e347b673f697DC821965A3EB64b9c
```

Returns:

```sh
Creating Typechain artifacts in directory typechain for target ethers-v5
Successfully generated Typechain artifacts!
Compiling 1 file with 0.6.12
Successfully submitted source code for contract
contracts/TestToken.sol:TestToken at 0x4ed4DDd7981e347b673f697DC821965A3EB64b9c
for verification on Etherscan. Waiting for verification result...

Successfully verified contract TestToken on Etherscan.
https://ropsten.etherscan.io/address/0x4ed4DDd7981e347b673f697DC821965A3EB64b9c#code
```

[0x4ed4DDd7981e347b673f697DC821965A3EB64b9c](https://ropsten.etherscan.io/address/0x4ed4DDd7981e347b673f697DC821965A3EB64b9c#code)

### Network
To verify your various test, hardhat, and Alchemy networks are configured properly, `npx hardhat networks` will return such details. 

```sh
Network settings =>
Hardhat Runtime Environment =>
[
  'config',
  'hardhatArguments',
  'tasks',
  'run',
  'artifacts',
  'network',
  '_extenders',
  'ethers',
  'waffle',
  'upgrades'
]
Alchemy =>
{
  accounts: [
    '0xREDACTED_PRIVATE_KEY'
  ],
  gas: 'auto',
  gasPrice: 'auto',
  gasMultiplier: 1,
  httpHeaders: {},
  timeout: 20000,
  url: 'https://eth-ropsten.alchemyapi.io/v2/REDACTED_ALCHEMY_API_KEY'
}
Ropsten =>
{
  accounts: {
    initialIndex: 0,
    count: 10,
    path: "m/44'/60'/0'/0",
    mnemonic: 'REDACTED_MNEMONIC_WORDS'
  },
  gas: 'auto',
  gasPrice: 'auto',
  gasMultiplier: 1,
  httpHeaders: {},
  timeout: 20000,
  chainId: 3,
  url: 'https://ropsten.infura.io/v3/REDACTED_INFURA_API_KEY'
}
```

### Added plugins

- Gas reporter [(hardhat-gas-reporter)](https://hardhat.org/plugins/hardhat-gas-reporter.html)
- Etherscan [(hardhat-etherscan)](https://hardhat.org/plugins/nomiclabs-hardhat-etherscan.html)
- Open Zeppelin [(@openzeppelin/hardhat-upgrades)](https://docs.openzeppelin.com/upgrades-plugins/1.x/hardhat-upgrades)

## Other 

#### Contracts
There are several token examples. The first includes an ICO contract, the Interview Token and ChuckNorris Token are both derived from OpenZeppelin. The ChuckNorris Token includes a deployment script where the Token description is updated with Chuck Norris jokes fetched from an API.

* [TemplateSale_v0.sol](./ico-erc-20.md)
* [TemplateToken_v0.sol](./ico-erc-20.md)

### Prettier

```sh
npx prettier --write 'contracts/**/*.sol'
```

### Solhint

* [Rules](https://tokenhouse.github.io/solhint/rules.html)
* [Style Guide](https://protofire.github.io/solhint/docs/rules.html#style-guide-rules)

To disable all validations in the line following a comment:

```sol
 // solhint-disable-next-line
 bytes32 public constant MINTER_PANTS = keccak256("MINTER_PANTS");
```

Current line:

```sol
bytes32 public constant MINTER_PANTS = keccak256("MINTER_PANTS"); // solhint-disable-line
```

Block of code:

```sol
 /* solhint-disable */
  contract Forwarder { 
    address public destinationAddress;

    function Forwarder() public {
      destinationAddress = msg.sender;
    }

    function() payable public {
          destinationAddress.transfer(msg.value);
    }

    function flush() public {
      destinationAddress.transfer(this.balance);
    }
  }
  /* solhint-enable */
```

#### Additional Solidity Resources
* [Blog](https://blog.soliditylang.org/)
* [Cheatsheet](https://github.com/pleasemarkdarkly/solidity-ts-template/blob/main/solidity-cheatsheet.md)
* [Voting Example](https://ethereum.org/en/developers/docs/smart-contracts/languages/)
* [Examples](https://solidity-by-example.org/)
* [Ethereum Docs](https://ethereum.org/en/developers/docs/)
* [App Stack Example](https://github.com/austintgriffith/scaffold-eth#-ui-library)
* [Awesome](https://github.com/bkrem/awesome-solidity/blob/master/README.md)
* [hardhat-docgen](https://github.com/ItsNickBarry/hardhat-docgen)

### Branding
<div style='text-align: center'>
<img src='https://raw.githubusercontent.com/ethereum/solidity/develop/docs/logo.svg' width='100px'>
</div>

### Attribution
<a name="footnote_001">1</a>The Sale contract was updated tp ^0.8.0 from [HunterLong](https://github.com/hunterlong/ethereum-ico-contract)'s ^0.4.21 Solidity contract. 

<a name="footnote_002">2</a>The project template was hacked from [PaulRBerg](https://github.com/paulrberg/solidity-template)'s template. 

