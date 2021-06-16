import hre from "hardhat";
import { Artifact } from "hardhat/types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import { DelegateB, DelegateA } from "../../typechain";
import { Signers } from "../../types";
import { expect } from "chai";
import { TransactionReceipt } from "@ethersproject/providers";
import { isGeneratorFunction } from "util/types";

const { deployContract } = hre.waffle;

export const getRandomInt = (max: number): number => {
    return Math.floor(Math.random() * max);
}


// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const printPartyTxReceipt = async (receipt: TransactionReceipt) => {
    process.stdout.write(
        `${receipt.from} => ${receipt.to} (gasUsed:${receipt.gasUsed})(${receipt.status})` + `\n` +
        `\ttx:${receipt.transactionHash} (block.no:${receipt.blockNumber})` + `\n`
    );
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const printDelegateProperties = async (alpha: string, obj: DelegateB | DelegateA) => {    
    console.log(`delegate:${alpha} => sender:${await obj.sender()}, value:${await obj.value()}, num:${await obj.num()}`);
}

describe("Delegate Contract Interaction Example", function () {
    const unnamedAccountsPool = 19;
    before(async function () {
        this.signers = {} as Signers;
        const signers: SignerWithAddress[] = await hre.ethers.getSigners();
        this.signers.admin = signers[0];
        this.unnamedPool = [] as Signers[];
        console.log(`Storing ${unnamedAccountsPool} out of ${signers.length - 1}`);
        for (let i = 1; i <= unnamedAccountsPool; i++) {
            const unnamed: SignerWithAddress = signers[i];
            this.unnamedPool.push(unnamed);
        }

    });

    describe("Creating Delegate Contracts and verifying their addresses", function () {
        it("should return delegate contract addresses", async function () {
            const B_Artifact: Artifact = await hre.artifacts.readArtifact("DelegateB");
            this.delegate_b = <DelegateB>await deployContract(this.signers.admin, B_Artifact, []);
            const A_Artifact: Artifact = await hre.artifacts.readArtifact("DelegateA");
            this.delegate_a = <DelegateA>await deployContract(this.signers.admin, A_Artifact, []);

            console.log(`Delegate A => ${await this.delegate_a.address}`);
            console.log(`Delegate B => ${await this.delegate_b.address}`);                        
        });
        
        it("should delegates initialized to zero", async function () {
            expect(await this.delegate_a.num()).to.equal(0);
            expect(await this.delegate_a.value()).to.equal(0);
            expect(await this.delegate_b.num()).to.equal(0);
            expect(await this.delegate_b.value()).to.equal(0);
        });

        it("should set delegate_b with random and known properties", async function () {
            const payment = getRandomInt(1000);
            const random = hre.ethers.utils.parseUnits(Math.floor(Math.random() * 10000).toString(), 18);
            const tx = await this.delegate_b.setVars(random, { from: await this.signers.admin.address, value: payment });
            const receipt = await tx.wait();
            await printPartyTxReceipt(receipt);
            await printDelegateProperties("B", this.delegate_b);

            expect(await this.delegate_b.num()).to.equal(random);
            expect(await this.delegate_b.sender()).to.equal(await this.signers.admin.address);
            expect(await this.delegate_b.value()).to.equal(payment);
        });

        it("should set delegate_a's state variables, even though the function call was delegated", async function () {            
                const payment = getRandomInt(1000);
                const random = hre.ethers.utils.parseUnits(Math.floor(Math.random() * 10000).toString(), 18);
                const tx = await this.delegate_a.setVars(await this.delegate_b.address, random,
                    { from: await this.signers.admin.address, value: payment });
                const receipt = await tx.wait();
                await printPartyTxReceipt(receipt);
                await printDelegateProperties("A", this.delegate_a);
                await printDelegateProperties("B", this.delegate_b);
            
            /*
            expect(await this.delegate_a.num()).to.equal(random);
            expect(await this.delegate_a.sender()).to.equal(await this.signers.admin.address);
            expect(await this.delegate_a.value()).to.equal(payment);
            */
        });
        
    });
});
