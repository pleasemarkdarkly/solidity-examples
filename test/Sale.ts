import chai from "chai";
import { ethers } from "hardhat";
import { Signer } from "ethers";
import { solidity } from "ethereum-waffle";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { Signers } from "../types";
import { Sale, Sale__factory, Token, Token__factory } from "../typechain";
import { assert, profileEnd } from "console";

chai.use(solidity);
const { expect } = chai;

describe("Token", () => {
    let accounts: Signer[];

    beforeEach(async () => {
        accounts = await ethers.getSigners();
    });

    it("Should provide 10+ accounts", async () => {
        console.log(`${accounts.length} accounts available`);        
    });
});

let account_one, account_two, account_three;
const averageBlockTime = 13.1;  // seconds
const averageBlocksPerDay = 5760;
const saleDurationInDays = 200;

const TOKEN_ADDRESS = '0x7824773BFFA00f2b20b2db3B5fCC22C3713542E9';

describe("Sale Contract Example", () => {
    let accounts: Signer[];
    let SaleInstance: Sale;
    let TokenInstance: Token;
    let proceedsWallet;
    let saleAddress: string;
    let contractAddress: string, tokenAddress: string;
    let account_one: string,
        account_two: string,
        account_three: string;
    
    beforeEach(async () => {
        accounts = await ethers.getSigners();
        account_one = await accounts[1].getAddress();
        account_two = await accounts[2].getAddress();
        account_three = await accounts[3].getAddress();
    });

    it("should create new Sale contract", async () => {
        const [deployer, user] = await ethers.getSigners();
        const saleFactory: Sale__factory = new Sale__factory(deployer);
        proceedsWallet = await accounts[0].getAddress();
        const saleContract: Sale = await saleFactory.deploy(proceedsWallet);
        SaleInstance = saleContract;
        saleAddress = SaleInstance.address;
        console.log(`Sale contract created:${saleAddress}`);
        expect(saleAddress);
    });

    it("should create new Token", async () => {
        const [deployer, user] = await ethers.getSigners();
        const tokenFactory: Token__factory = new Token__factory(deployer);
        TokenInstance = await tokenFactory.deploy(saleAddress);
        tokenAddress = TokenInstance.address;
        console.log(`Token contract address:${tokenAddress}`);
    });
});
