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

describe("Unit tests for Sale", function () {
    before(async function () {
        this.signers = {} as Signers;
        const signers: SignerWithAddress[] = await hre.ethers.getSigners();
        this.signers.admin = signers[0];
        expect(process.stdout.write(`Contract owner:${this.signers.admin.address}` + `\n`));
        this.contributor_one = signers[2];
        this.contributor_two = signers[3];
        this.contributor_three = signers[4];
        expect(process.stdout.write(`Mock contributor address (1):${this.contributor_one.address}` + `\n`));
        expect(process.stdout.write(`Mock contributor address (2):${this.contributor_two.address}` + `\n`));
        expect(process.stdout.write(`Mock contributor address (3):${this.contributor_three.address}` + `\n`));
        process.stdout.write(`\n`);
    });

    describe("Sale initialization", function () {
        before(async function () {
            const saleArtifact: Artifact = await hre.artifacts.readArtifact("Sale");
            this.sale = <Sale>await deployContract(this.signers.admin, saleArtifact, [ETH_PUBLIC_KEY]);
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            expect(process.stdout.write(`Sale contract deployed at:${this.sale.address}`));
            const tokenArtifact: Artifact = await hre.artifacts.readArtifact("Token");
            this.token = <Token>await deployContract(this.signers.admin, tokenArtifact,
                [this.sale.address, "ICO Token Name", "ICOTKN", "v0.1"]);
            expect(`Token Contract created at ${this.token.address}` + `\n`);

            it(`should compute ending ICO ending block`, async function () {
                const currentBlock = await hre.ethers.provider.getBlockNumber();
                const endingBlock = currentBlock + (5760 * 2); // 10422059            
                expect(`Duration of the Token ICO Sale will be for two days, ` +
                    `starting from block ${currentBlock} to ${endingBlock}.` + `\n`);
                void this.sale.connect(this.signers.admin).setup(this.token.address, endingBlock);
            });

            it("should be in funding mode", async function () {
                expect(await this.sale.connect(this.signers.admin).isFunding);
            });
        });

        shouldBehaveLikeSale();
    });

});
