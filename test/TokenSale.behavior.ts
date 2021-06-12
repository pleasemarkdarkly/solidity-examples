import hre from "hardhat";
import { expect } from "chai";

export function shouldBehaveLikeSale(): void {    
    it("should validate token name", async function () {
        process.stdout.write(`\n`);
        expect(process.stdout.write(`${await this.token.connect(this.signers.admin).name()}` + `\n`));
    });
    
    it("should validate sale token", async function () {
        expect(process.stdout.write(`${await this.sale.connect(this.signers.admin).Token()}` + `\n`));
    });
    
    it("should create additional signers to transact with", async function () {        
        expect(process.stdout.write(`Token Sale offers to mint:${await this.sale.connect(this.signers.admin).totalMinted()}` + `\n`));
        expect(process.stdout.write(`Current Sale contract balance:${await this.token.balanceOf(this.sale.address)}` + `\n`));
       
        const toSend = hre.ethers.utils.parseEther(".02573");
        expect(process.stdout.write(`Ether to be sent by contributors:${toSend}` + `\n`));                                
    });

    it("should show accounts and balances PRIOR to contributing", async function () {
        const accounts = await hre.ethers.getSigners();
        accounts.map(async a => {
            process.stdout.write(`${a.address}: ${await a.getBalance()}` + `\n`);
        });
    });

    it("should set up senders to contribute to the ICO", async function () {                
        await (await hre.ethers.getSigners()).forEach(async a => {
            await a.sendTransaction({
                to: this.sale.address,
                value: hre.ethers.utils.parseEther(".34560")
            });
        });                               
    });

    it("should show accounts and balances AFTER contributing", async function () {
        const accounts = await hre.ethers.getSigners();
        accounts.map(async a => {
            process.stdout.write(`${a.address}: ${await a.getBalance()}` + `\n`);
        });
    });

    it("should show all contract balances", async function () {
        expect(process.stdout.write(`Contract owner balance:${await this.token.balanceOf('0xB772C38aCa8fac0FB50Fd01899ef3Dfa8B7DF628')}` + `\n`));
        expect(process.stdout.write(`Token contract balance:${await this.token.balanceOf(this.token.address)}` + `\n`));
        expect(process.stdout.write(`Sale contract balance:${await this.token.balanceOf(this.sale.address)}` + `\n`));
    })
}
