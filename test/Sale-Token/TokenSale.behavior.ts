import hre from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { BigNumber } from "ethers";
import { expect } from "chai";

export const getRandomBigNumber = (max: number): BigNumber => {
    return hre.ethers.utils.parseUnits(Math.floor(Math.random() * max).toString(), 18);
}

export function shouldBehaveLikeSale(): void {
    const MAX_CONTRIBUTION_AMOUNT = 1000000; // 10000000000000000000000;
    it("should return token brand, symbol, version, authorized supply", async function () {
        process.stdout.write(`\n`);        
        // await hre.ethers.provider.getBalance(this.proceedsPool.address);
        expect(process.stdout.write(`${await this.token.connect(this.signers.admin).name()}` +            
            ` (${await this.token.connect(this.signers.admin).symbol()})` +
            ` (${await this.token.connect(this.signers.admin).version()})` +
            `\n`));        
    });

    it("should return Token authorization for Sales contract to mint token supply", async function () {
        expect(process.stdout.write(`Authorized Supply:${await this.token.connect(this.signers.admin).authorizedSupply()}` + `\n` +
            `Sale Contract address:(${await this.token.connect(this.signers.admin).mintableAddress()})` + `\n` +
            `Author:(${await this.token.connect(this.signers.admin).generator()})` +
            `\n`));
    });
    
    it("should return Sales setting of external funding proceeds wallet, exchange rate, funding duration", async function () {
        expect(process.stdout.write(`Proceeds Wallet:${await this.sale.connect(this.signers.admin).ETHWallet()} ` + `\n` + 
            `Exchange rate(TOKEN to ETH):${await this.sale.connect(this.signers.admin).exchangeRate()} * ETH` + `\n` +
            `Start block:${await this.sale.connect(this.signers.admin).startBlock()}` + `\n` +
            `End block:${await this.sale.connect(this.signers.admin).endBlock()}` + `\n` +
            `Administrator wallet:${await this.sale.connect(this.signers.admin).creator()}` + `\n`
        ));

        expect(process.stdout.write(`Sale max mintable(total supply):${await this.sale.connect(this.signers.admin).maxMintable()}` + `\n` +
            `Sales token total minted:${await this.sale.connect(this.signers.admin).totalMinted()}` + `\n`));
    });
    
    it("should return empty or minimal wallet balances of the Sales and Token balances before contributions", async function () {                            
        expect(process.stdout.write(`Sale Eth wallet balance:${await this.sale.connect(this.signers.admin).ETHWallet()}` + `\n` +
                `Token contract balance/address:${await this.token.address}` + `\n` +
                `Sale proceeds wallet balance:${await this.sale.address}` + `\n`                        
        ));               
    });
        
    it("should return twenty wallets with ether to simulate funding campaign", async function () {
        const signers: SignerWithAddress[] = await hre.ethers.getSigners();        
        for (let i = 0; i < signers.length; i++) {
            const a = signers[i];
            process.stdout.write(`${await a.address}:${await a.getBalance()}` + `\n`);
            expect(await a.getBalance()).not.equal(0);
        };
        process.stdout.write(`\n`);
        /*
        const contribution = getRandomBigNumber(MAX_CONTIBUTION_AMOUNT);
        expect(process.stdout.write(`Simulation wallets will contribution random amounts:` +
            `${hre.ethers.utils.parseEther(contribution.toString())}` + `\n`));
            */
    });
        
    it("should generate random amounts of eth to transfer to Sale Contract", async function () {                                
        process.stdout.write(`\n`);
        const signers: SignerWithAddress[] = await hre.ethers.getSigners();
        const sampling = Math.floor(Math.random() * signers.length);
        for (let i = 1; i < sampling; i++) {
            const a = signers[i];
            const contribution = Math.floor(Math.random() * 10000); // getRandomBigNumber(MAX_CONTRIBUTION_AMOUNT).div(2);
            process.stdout.write(`${await a.address} => ${hre.ethers.utils.parseEther(contribution.toString())} (wei)` + `\n`);
            const tx = await this.sale.connect(a).contribute({ value: contribution });
            const receipt = await tx.wait();
            const { to, from, gasUsed, transactionHash, blockNumber } = receipt;
            process.stdout.write(`(${blockNumber}) ${from} ➡️ ${to}` + `\n` +
                `\t` + `🎰 ${contribution} (⛽ ${gasUsed})` + `\n` +
                `\t` + `(${blockNumber}) ${transactionHash}` + `\n`
            );
        };
    });
        
    it("should return wallets with fewer wei/ethers from transfering", async function () {
        process.stdout.write(`\n`);
        const signers: SignerWithAddress[] = await hre.ethers.getSigners();        
        for (let i = 0; i < signers.length; i++) {
            const a = signers[i];
            const wei = await a.getBalance();
            process.stdout.write(`${await a.address}:${wei} (wei)` + `\n`);
        }
        const proceedsBalance = await hre.ethers.provider.getBalance(this.proceedsPool.address);
        process.stdout.write(`Token Sale Proceeds balance:${proceedsBalance}`);
    });
};
