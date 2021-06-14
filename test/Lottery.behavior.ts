import { expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

export const getRandomInt = (max: number):number => {
    return Math.floor(Math.random() * max);
}

export function shouldBehaveLikeLottery(): void {    
    it("should return generator url from lottery", async function () {

        this.lottery.connect(this.signers.admin).on("Log",
            (lottery: SignerWithAddress, gambler: SignerWithAddress, wager: number, msg: string) => {
            console.log(`${lottery} ${gambler}:${wager}-${msg}`);
        });

        expect(process.stdout.write(`deployed lottery contract to => ` +
            `${await this.lottery.address}` + `\n`));
        expect(process.stdout.write(`generator:` +
            `${await this.lottery.connect(this.signers.admin).generator()}` + `\n`));
    });

    it("should return number of players initialized", async function () {
        expect(process.stdout.write(`initialized numOfPlayers:` +
            `${await this.lottery.connect(this.signers.admin).numOfPlayers()}` + `\n`));
    });
    
    it("should display gamblers", async function () {
        this.gamblers.forEach(async (g: SignerWithAddress) => {
            process.stdout.write(`${await g.address}:${await g.getBalance()}` + `\n`);
        });        
    });

    it("should compute wager amount", async function () {                
        await this.gamblers.forEach(async (g: SignerWithAddress) => {
            const wagerAmount = getRandomInt(10000000);
            process.stdout.write(`${await g.address}:${await g.getBalance()}:${wagerAmount} (wei)` + `\n`);                        
        });
        process.stdout.write(`deployed lottery contract to => ${await this.lottery.address} balance:` +
            `${await this.lottery.connect(this.signers.admin).totalAmount()}` + `\n`);
        process.stdout.write(`\n`);
    });

    it("should show gamblers wagers", async function () {                
        await this.gamblers.forEach(async (g: SignerWithAddress) => {
            const wagerAmount = getRandomInt(10000000);
            const lotteryContract = await this.lottery.connect(this.signers.admin).address;            
            await g.sendTransaction({ to: lotteryContract, value: wagerAmount })
            const txReciept = await this.lottery.connect(g).wager();
            await txReciept.wait();
            process.stdout.write(`${await g.address}:${await g.getBalance()}` + `\n` + 
                `\t` + `${txReciept.hash}(${txReciept.blockNumber}):(${txReciept.gasPrice})(${txReciept.from})` + `\n`);
        });        
        process.stdout.write(`\n`);
        process.stdout.write(`deployed lottery contract to => ${await this.lottery.address} balance:` +
            `${await this.lottery.connect(this.signers.admin).totalAmount()}` + `\n`);
    });

    /*
    it("check lottery contract properties", async function () {                                        
        const lotteryProps = Object.keys(
            await this.lottery.connect(this.signers.admin)).toString().split(',');
        lotteryProps.forEach(p => {
            process.stdout.write(`${p}` + `\n`);
        });
    });
    */

    it("should select winner", async function () {
        this.gamblers.forEach(async (g: SignerWithAddress) => {           
            process.stdout.write(`${await g.address}:${await g.getBalance()}` + `\n`);            
        });
    });

    it("should return hardhat helpers", async function () {
        process.stdout.write(`\n`);
        process.stdout.write(`deployed lottery contract to => ${await this.lottery.connect(this.signers.admin).address}` +
            `(${await this.lottery.connect(this.signers.admin).numOfPlayers()}):` +
            `${await this.lottery.connect(this.signers.admin).totalAmount()}` +            
            `\n`);
        
        process.stdout.write(`\n`);        
        const lotteryProps = Object.keys(await this.lottery).toString().split(',');
        lotteryProps.forEach(p => {
            process.stdout.write(`${p}` + `\n`);
        })
    });
};
