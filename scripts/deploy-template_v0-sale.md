## Create the Sale and Token Contracts
Gather the wallet where the `Sale` proceeds are to be deposited. For the following example, `0x6FEFc3F6239F2A1aF8Fe093877BA2a1e81da4231` was used. This wallet will be the argument in the `Sale` constructor. The following commands demonstrate the deployment and publishing of the contracts on the `ropsten` testnet. When following 

```bash 
npx hardhat run --network alchemy ./scripts/deploy-template_v0-sale.ts 
echo Token Sale deployed to:  0xb92B3B34b5f5269407B7A24e1Cb98c553eFC41B4

npx hardhat verify --network ropsten 0xb92B3B34b5f5269407B7A24e1Cb98c553eFC41B4 '0x6FEFc3F6239F2A1aF8Fe093877BA2a1e81da4231'  
echo Compiling 1 file with 0.8.4
echo Successfully submitted source code for contract
echo contracts/TemplateSale_v0.sol:Sale at 0xb92B3B34b5f5269407B7A24e1Cb98c553eFC41B4 for verification on Etherscan. 
echo Waiting for verification result...
echo Successfully verified contract Sale on Etherscan.
echo https://ropsten.etherscan.io/address/0xb92B3B34b5f5269407B7A24e1Cb98c553eFC41B4#code

npx hardhat run --network alchemy ./scripts/deploy-template_v0-token.ts 
echo Sale Token deployed to:  0x0F3CA246a7A3043FF92Ff46B63F93752688b385D

npx hardhat verify --network ropsten 0x0F3CA246a7A3043FF92Ff46B63F93752688b385D "0xb92B3B34b5f5269407B7A24e1Cb98c553eFC41B4" 
echo Compiling 1 file with 0.8.4
echo Successfully submitted source code for contract
echo contracts/TemplateToken_v0.sol:Token at 0x0F3CA246a7A3043FF92Ff46B63F93752688b385D for verification on Etherscan. 
echo Waiting for verification result...
echo Successfully verified contract Token on Etherscan.
echo https://ropsten.etherscan.io/address/0x0F3CA246a7A3043FF92Ff46B63F93752688b385D#code
```
### Sale 
[0xb92B3B34b5f5269407B7A24e1Cb98c553eFC41B4](https://ropsten.etherscan.io/address/0xb92B3B34b5f5269407B7A24e1Cb98c553eFC41B4#code)

### Token
[0x0F3CA246a7A3043FF92Ff46B63F93752688b385D](https://ropsten.etherscan.io/address/0x0F3CA246a7A3043FF92Ff46B63F93752688b385D#code)

# Trigger the Setup function in the Sale Contract
Navigate to the [Sale Contract](https://ropsten.etherscan.io/address/0xb92B3B34b5f5269407B7A24e1Cb98c553eFC41B4#code) page, and select the tab `Contract` and `Write Contract`. Find the function `setup` and enter in the `token address above` and the `_endBlock`. __(Locating the current block height plus number of days you want your ICO to run multiplied by 5760 )__ 