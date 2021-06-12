import hre from "hardhat";
import { expect } from "chai";
import { Artifact } from "hardhat/types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { Signers } from "../types";
import { Sale, Token } from "../typechain";

import { config as dotenvConfig } from 'dotenv';
import { resolve } from 'path';
dotenvConfig({ path: resolve(__dirname, '../.env') });
const ETH_PUBLIC_KEY = process.env.ETH_PUBLIC_KEY || "0x6FEFc3F6239F2A1aF8Fe093877BA2a1e81da4231";

import { shouldBehaveLikeSale } from "./TokenSale.behavior";
const { deployContract } = hre.waffle;

describe("Unit test for the sale, token contracts", function () {
    before(async function () {
        this.signers = {} as Signers;
        const signers: SignerWithAddress[] = await hre.ethers.getSigners();
        this.signers.admin = signers[0];
        this.proceedsWallet = signers[19];
        
        let count = 1;
        signers.forEach(s => {
            if (count != 1) {
                expect(process.stdout.write(`(${count}) ${s.address}` + `\n`));
                count++;
            } 
        })        
        expect(process.stdout.write(`\n` + `Contract owner:${this.signers.admin.address}` + `\n`));
        expect(process.stdout.write(`Proceeds wallet:${this.proceedsWallet.address}` + `\n` + `\n`));
        process.stdout.write(`\n`);
    });

    describe("Sale initialization", function () {
        before(async function () {
            const saleArtifact: Artifact = await hre.artifacts.readArtifact("Sale");
            this.sale = <Sale>await deployContract(this.signers.admin, saleArtifact, [this.proceedsWallet.address]);
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            expect(process.stdout.write(`Sale contract deployed at:${this.sale.address}` + `\n`));
            expect(process.stdout.write(`Sales proceeds configured for:${this.proceedsWallet.address}` + `\n`));           
        });

        it("Token initialization", async function () {
            const tokenArtifact: Artifact = await hre.artifacts.readArtifact("Token");
            this.token = <Token>await deployContract(this.signers.admin, tokenArtifact,
                [this.sale.address, "Awesome Token", "AWE", "v0.1"]);
            expect(process.stdout.write(`Token contract deployed at:${this.token.address}` + `\n`));
        });

        it("Setting sales contract with mintable tokens and funding duration", async function () {
            const currentBlock = await hre.ethers.provider.getBlockNumber();
            const endingBlock = currentBlock + (5760 * 2);
            process.stdout.write(`Token-Sale contract starts ` +
                `at ${currentBlock} to ${endingBlock}.` + `\n` +
                `Total sale duration ${(endingBlock - currentBlock) / 5760} day(s)` + `\n`);
            void this.sale.connect(this.signers.admin).setup(this.token.address, endingBlock);
        });

        it("Sale and Token contracts deployed and funding", async function () {
            expect(this.sale.connect(this.signers.admin).isFunding);
        });

        shouldBehaveLikeSale();
    });

});
