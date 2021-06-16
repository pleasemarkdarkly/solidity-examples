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

export const printPartyTxReceipt = async (receipt: any) => {
    process.stdout.write(
        `${receipt.from} => ${receipt.to} (gasUsed:${receipt.gasUsed})(${receipt.status})` + `\n` +
        `\ttx:${receipt.transactionHash} (block.no:${receipt.blockNumber})` + `\n`
    );
}
export const printContractTxReceipt = async (receipt: any) => {
    process.stdout.write(
        `${receipt.from} => ${receipt.to} (gasUsed:${receipt.gasUsed})(${receipt.status})` + `\n` +
        `\ttx:${receipt.transactionHash} (block.no:${receipt.blockNumber})` + `\n`
    );
}

export const getRandomBigNumber = (max: number):BigNumber => {    
    return hre.ethers.utils.parseUnits(Math.floor(Math.random() * max).toString(), 18);    
}

export function shouldBehaveLikeLottery(): void {
    const MAX_WAGER_AMOUNT = 100;
    let lotteryAddress = '';
    let lotteryBalance: BigNumber;

    it("should return generator url from lottery", async function () {
        this.lottery.connect(this.signers.admin).on("Log",
            (lottery: SignerWithAddress, gambler: SignerWithAddress, wager: number, msg: string) => {
            console.log(`==>${lottery} ${gambler}:${wager}-${msg}`);
        });

        lotteryAddress = await this.lottery.address;
        lotteryBalance = await hre.ethers.provider.getBalance(lotteryAddress);        
        expect(process.stdout.write(`deployed lottery contract to => ` +
            `${await this.lottery.address}:${lotteryBalance}` + `\n`));
        expect(await this.lottery.address).to.equal(lotteryAddress);
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
        await printPartyTxReceipt(reciept);        
    });
    
    it("should return number of players initialized to zero", async function () {
        expect(process.stdout.write(`initialized numOfPlayers:` +
            `${await this.lottery.connect(this.signers.admin).numOfPlayers()}` + `\n`));
        expect(await this.lottery.connect(this.signers.admin).numOfPlayers()).to.equal(0);
    });
    
    it("should display players/gamblers addresses and balances", async function () {                
        for (let i = 0; i < this.gamblers.length; i++) {
            const g: SignerWithAddress = this.gamblers[i];
            process.stdout.write(`${await g.address}:${await g.getBalance()}` + `\n`);
        }
        process.stdout.write(`\n`);
    });
    
    it("should generate random amounts to wager", async function () {                                
        for (let i = 0; i < this.gamblers.length; i++) {
            const g: SignerWithAddress = this.gamblers[i];
            const wagerAmount = getRandomBigNumber(MAX_WAGER_AMOUNT);            
            process.stdout.write(`${await g.address}:${await g.getBalance()}:${wagerAmount.div(2)} (wei)` + `\n`);
        }
        process.stdout.write(`\n`);
    });

    it("should return empty lottery pot/totalAmount", async function () {
        process.stdout.write(`deployed lottery contract to => ${await this.lottery.address} balance:` +
            `${await this.lottery.connect(this.signers.admin).totalAmount()}` + `\n`);
        lotteryBalance = await hre.ethers.provider.getBalance(lotteryAddress);        
        expect(await this.lottery.connect(this.signers.admin).totalAmount()).to.equal(lotteryBalance);
        process.stdout.write(`\n`);
    });

    it("should wager, select winner, and print contract state", async function () {                                                
            // 🏆 💰
        for (let i = 0; i < this.gamblers.length; i++) {
            
                const g: SignerWithAddress = this.gamblers[i];
                const wagerAmount = getRandomBigNumber(MAX_WAGER_AMOUNT).div(2);
                const tx = await this.lottery.connect(g).wager({ value: wagerAmount });
                const receipt = await tx.wait();
                // await keys(receipt);            
                const { to, from, gasUsed, transactionHash, blockNumber } = receipt;
                process.stdout.write(`(${blockNumber}) ${from} ➡️ ${to}` + `\n` +
                    `\t` + `🎰 ${wagerAmount} (⛽ ${gasUsed})` + `\n` +
                    `\t` + `(${blockNumber}) ${transactionHash}` + `\n`
                );
        
                /*
                let index = 0;
                if (receipt.events) receipt.events.forEach((e: any) => {
                    process.stdout.write(`\t\t(${index}) ${e.event}` + `\n`);
                    index++;
                    // process.stdout.write(`\n${e.decode}\n`);
                });                                    
                index = 0;
                */            
        };
        
        lotteryBalance = await hre.ethers.provider.getBalance(lotteryAddress);
        process.stdout.write(`Lottery contract balance:${lotteryBalance}, ` +
            `totalAmount:${await this.lottery.totalAmount()}` + `\n`);
        expect(lotteryBalance).to.equal(await this.lottery.totalAmount());    
    });
    
    it("should display participant's final balances", async function () {                
        for (let i = 0; i < this.gamblers.length; i++) {
            const g: SignerWithAddress = this.gamblers[i];            
            process.stdout.write(`${await g.address}:${await g.getBalance()}` + `\n`);
        }
        process.stdout.write(`\n`);

        lotteryBalance = await hre.ethers.provider.getBalance(lotteryAddress);
        process.stdout.write(`Lottery balance:${lotteryBalance}`);
        expect(lotteryBalance).to.equal(await this.lottery.totalAmount());
    });
};
