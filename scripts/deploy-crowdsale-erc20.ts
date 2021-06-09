/* We require the Hardhat Runtime Environment explicitly here. This is optional
but useful for running the script in a standalone fashion through `node <script>`.
When running the script with `hardhat run <script>` you'll find the Hardhat
Runtime Environment's members available in the global scope. */

import { ethers } from 'hardhat';
import { Contract, ContractFactory } from 'ethers';

async function main(): Promise<void> {
    /* Hardhat always runs the compile task when running scripts through it.
    If this runs in a standalone fashion you may want to call compile manually
    to make sure everything is compiled
    await run("compile"); We get the contract to deploy */
    const TemplateSaleFactory: ContractFactory = await ethers.getContractFactory('Sale');
    const templateSale: Contract = await TemplateSaleFactory.deploy("0x6FEFc3F6239F2A1aF8Fe093877BA2a1e81da4231");
    await templateSale.deployed();
    console.log('Token Sale deployed to: ', templateSale.address);
    // Deployed at 0x7824773BFFA00f2b20b2db3B5fCC22C3713542E9
}

/* We recommend this pattern to be able to use async/await everywhere
  and properly handle errors. */
main()
    .then(() => process.exit(0))
    .catch((error: Error) => {
        console.error(error);
        process.exit(1);
    });
