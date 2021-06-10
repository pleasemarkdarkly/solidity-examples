/* We require the Hardhat Runtime Environment explicitly here. This is optional
but useful for running the script in a standalone fashion through `node <script>`.
When running the script with `hardhat run <script>` you'll find the Hardhat
Runtime Environment's members available in the global scope. */

import { ethers } from 'hardhat';
import { Contract, ContractFactory } from 'ethers';
import { config as dotenvConfig } from 'dotenv';
import { resolve } from 'path';
dotenvConfig({ path: resolve(__dirname, '../.env') });

const ETH_PUBLIC_KEY = process.env.ETH_PUBLIC_KEY || '';

async function main(): Promise<void> {
    /* Hardhat always runs the compile task when running scripts through it.
    If this runs in a standalone fashion you may want to call compile manually
    to make sure everything is compiled
    await run("compile"); We get the contract to deploy */
    const SaleFactory: ContractFactory = await ethers.getContractFactory('Sale');
    const sale: Contract = await SaleFactory.deploy(ETH_PUBLIC_KEY);
    await sale.deployed();
    console.log('Token Sale deployed to: ', sale.address);    
}

/* We recommend this pattern to be able to use async/await everywhere
  and properly handle errors. */
main()
    .then(() => process.exit(0))
    .catch((error: Error) => {
        console.error(error);
        process.exit(1);
    });
