/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import hre from "hardhat";
import { expect } from "chai";
import { BigNumber } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const keys = async (obj: any) => {
    Object.keys(obj).toString().split(`,`).forEach(p => { process.stdout.write(`${p}` + `\n`); })
}

export const printPartyTxReciept = async (receipt: any) => {
    process.stdout.write(
        `${receipt.from} => ${receipt.to} (gasUsed:${receipt.gasUsed})(${receipt.status})` + `\n` +
        `\ttx:${receipt.transactionHash} (block.no:${receipt.blockNumber})` + `\n`
    );
}
export const printContractTxReciept = async (receipt: any) => {
    process.stdout.write(
        `${receipt.from} => ${receipt.to} (gasUsed:${receipt.gasUsed})(${receipt.status})` + `\n` +
        `\ttx:${receipt.transactionHash} (block.no:${receipt.blockNumber})` + `\n`
    );
}

export const getRandomBigNumber = (max: number):BigNumber => {    
    return hre.ethers.utils.parseUnits(Math.floor(Math.random() * max).toString(), 18);    
}

export function shouldBehaveLikeLottery(): void {
    const MAX_WAGER_AMOUNT = 1000;

    it("should return generator url from lottery", async function () {
        this.lottery.connect(this.signers.admin).on("Log",
            (lottery: SignerWithAddress, gambler: SignerWithAddress, wager: number, msg: string) => {
            console.log(`==>${lottery} ${gambler}:${wager}-${msg}`);
        });

        expect(process.stdout.write(`deployed lottery contract to => ` +
            `${await this.lottery.address}` + `\n`));
        expect(process.stdout.write(`generator:` +
            `${await this.lottery.connect(this.signers.admin).generator()}` + `\n`));
    });

    it("should transfer random amount between signer 0 and 1", async function () {
        const sender = await this.gamblers[0];
        const reciever = await this.gamblers[1];                
        const randNum = Math.random() * MAX_WAGER_AMOUNT;
        const amount = hre.ethers.utils.parseUnits(randNum.toString(), 18);
        const tx = await sender
            .sendTransaction({ to: await reciever.address, value: amount })
        const reciept = await tx.wait();        
        process.stdout.write(`(0) ${await sender.address}:${await sender.getBalance()}` + `\n` +
            `(1) ${await reciever.address}:${await reciever.getBalance()}` + `\n`             
        );
        await printPartyTxReciept(reciept);        
    });
    
    it("should return number of players initialized to zero", async function () {
        expect(process.stdout.write(`initialized numOfPlayers:` +
            `${await this.lottery.connect(this.signers.admin).numOfPlayers()}` + `\n`));
        expect(await this.lottery.connect(this.signers.admin).numOfPlayers()).to.equal(0);
    });
    
    it("should display players/gamblers addresses and balances", async function () {        
        await this.gamblers.forEach(async (g: SignerWithAddress) => {
            process.stdout.write(`${await g.address}:${await g.getBalance()}` + `\n`);            
        });
        process.stdout.write(`\n`);
    });
    
    it("should generate random amounts to wager", async function () {                        
        await await this.gamblers.forEach(async (g: SignerWithAddress) => {
            const wagerAmount = getRandomBigNumber(MAX_WAGER_AMOUNT);            
            process.stdout.write(`${await g.address}:${await g.getBalance()}:${wagerAmount} (wei)` + `\n`);            
        });                    
    });

    it("should return empty lottery pot/totalAmount", async function () {
        process.stdout.write(`deployed lottery contract to => ${await this.lottery.address} balance:` +
            `${await this.lottery.connect(this.signers.admin).totalAmount()}` + `\n`);
        process.stdout.write(`\n`);
    });

    it("should wager and select winner", async function () {
        for (let i = 0; i < this.gamblers.length; i++) {
            const amount = getRandomBigNumber(MAX_WAGER_AMOUNT);
            const g: SignerWithAddress = this.gamblers[i];
            const contract = await this.lottery.connect(g.address).address;
            const tx = await g.sendTransaction({ to: contract, value: amount });
            const wager = await this.lottery.connect(g).wager();            
            const reciept = await tx.wait();
            const wager_reciept = await wager.wait();
            const totalAmount = await this.lottery.connect(g).totalAmount();
            const w = wager_reciept;
            const [e] = w.events;
            
            // console.log(reciept, wager_reciept);

            const { to, from, gasUsed, blockHash, transactionHash, blockNumber, cumulativeGasUsed } = reciept;                        
            process.stdout.write(`(${blockNumber}) ${to} => ${from}` + `(${totalAmount})` + `\n` +
                `\t` + `(${transactionHash}/${blockHash}) (${gasUsed}/${cumulativeGasUsed})` + `\n`
            );
            process.stdout.write(`(${w.blockNumber}) ${e.topics}` + `\n` +
                `\t` + `${e.eventSignature}` + `\n`);
        }                                
    });
    
    it("should display final balances", async function () {
        await await this.gamblers.forEach(async (g: SignerWithAddress) => {            
            process.stdout.write(`${await g.address}:${await g.getBalance()}` + `\n`);
        });
    });
};
