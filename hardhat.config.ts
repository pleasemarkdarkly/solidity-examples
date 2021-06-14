import '@nomiclabs/hardhat-waffle';
import "@typechain/hardhat";
import '@nomiclabs/hardhat-etherscan';
import '@openzeppelin/hardhat-upgrades';
import 'hardhat-gas-reporter';
import "solidity-coverage";
import { extendEnvironment, task } from 'hardhat/config';
import { lazyObject } from "hardhat/plugins";
import { config as dotenvConfig } from 'dotenv';
import { resolve } from 'path';
import "./type-extensions";

dotenvConfig({ path: resolve(__dirname, './.env') });

import { HardhatUserConfig } from 'hardhat/types';
import { NetworkUserConfig } from 'hardhat/types';

const chainIds = {
  ganache: 1337,
  goerli: 5,
  hardhat: 31337,
  kovan: 42,
  mainnet: 1,
  rinkeby: 4,
  ropsten: 3,
  alchemy: 0,
};

export const VERBOSE = false;

const mnemonic = process.env.MNEMONIC || '';
if (!mnemonic) {
  throw new Error("Please set your MNEMONIC in a .env file");
}

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || '';
const INFURA_API_KEY = process.env.INFURA_API_KEY || '';
const ALCHEMY_API_URL = process.env.ALCHEMY_API_URL || '';
const ETH_PRIVATE_KEY = process.env.ETH_PRIVATE_KEY || '';

export class HardhatRuntimeEnvironmentField {
  constructor() { null }
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public doSomething() {
    console.log(`Example of some object loading.`)
  }
};

extendEnvironment((hre) => {
  hre.example = lazyObject(() => new HardhatRuntimeEnvironmentField())
});

task("example", 'Example of extending hardhat configuration', async (args, hre) => {
  const a = hre.example;
  a.doSomething();
  if (a) console.log(`Example task extending Hardhat configuration, successfully loaded this task.`);
});

const traverseKeys = (obj: any, results = []) => {
  const r: any = results;
  Object.keys(obj).forEach(key => {
    const value = obj[key];
    if (typeof value !== 'object' || typeof value !== 'function') {
      console.log(value);
      r.push(value);
    } else if (typeof value === 'object') {
      traverseKeys(value, r);
    }
  });
  return r;
};

task('accounts', 'Prints the list of available ETH accounts:', async (args, hre) => {
  const accounts = await hre.ethers.getSigners();
  for (const account of accounts) {
    console.log(await account.address);
  }
});

const HRE_DETAIL = false;
const PRINT_ALL_NETWORKS = true;

task('networks', 'Prints the configured ETH network settings:', async (args, hre) => {        
  if (HRE_DETAIL) {
    console.log(`Hardhat Runtime Environment (properties):`)
    console.log(Object.keys(hre));
    // console.log(traverseKeys(hre));
  }

  if (PRINT_ALL_NETWORKS) {
    console.log(`Available Networks:`);
    console.log(hre['config']['networks']);
  } else {  
    console.log(`Detail Alchemy:`);
    console.log(hre['config']['networks']['alchemy']);
    console.log(`Detail Ropsten:`);
    console.log(hre['config']['networks']['ropsten']);
  }
})

const createTestnetConfig = (
  network: keyof typeof chainIds,
): NetworkUserConfig => {
  const url: string = 'https://' + network + '.infura.io/v3/' + INFURA_API_KEY;
  return {
      accounts: {
        count: 10,
        initialIndex: 0,
        mnemonic,
        path: "m/44'/60'/0'/0",
      },
      chainId: chainIds[network],
      url,
    };    
};

const createAlchemyConfig = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  network: keyof typeof chainIds,
): NetworkUserConfig => {
  const url: string = ALCHEMY_API_URL;  
    return  {      
      url,
      accounts: [`0x${ETH_PRIVATE_KEY}`]
    };    
};

/* You need to export an object to set up your config
  Go to https://hardhat.org/config/ to learn more */
const config: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  gasReporter: {
    currency: 'USD',
    gasPrice: 100,
    enabled: process.env.REPORT_GAS ? true : false,
    excludeContracts: [],
    src: "./contracts",
  },
  networks: {
    hardhat: {
      accounts: {
        mnemonic: mnemonic,
      },
      chainId: chainIds.hardhat,
    },
    goerli: createTestnetConfig('goerli'),
    kovan: createTestnetConfig('kovan'),
    rinkeby: createTestnetConfig('rinkeby'),
    ropsten: createTestnetConfig('ropsten'),
    alchemy: createAlchemyConfig('alchemy'),
  },
  solidity: {
    compilers: [
      {
        version: '0.8.4',
        settings: {
          metadata: {
            // Not including the metadata hash
            // https://github.com/paulrberg/solidity-template/issues/31
            bytecodeHash: "none",
          },
          // You should disable the optimizer when debugging
          // https://hardhat.org/hardhat-network/#solidity-optimizer-support
          optimizer: {
            enabled: true,
            runs: 800,
          },
        },
      },
      { version: '0.6.12', },
      { version: '0.6.6', },
      { version: '0.4.21', },      
    ],
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },    
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test",
  }  
};

export default config;
