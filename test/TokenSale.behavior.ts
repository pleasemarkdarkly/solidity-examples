import hre from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { expect } from "chai";

export function shouldBehaveLikeSale(): void {    
    it("should return token brand, symbol, version, authorized supply", async function () {
        process.stdout.write(`\n`);
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
        const contribution = `.${Math.floor(Math.random() * 99999999999999999999)}`;
        for (let i = 0; i < signers.length; i++) {
            const a = signers[i];
            process.stdout.write(`${await a.address}:${await a.getBalance()}` + `\n`);
        };
        process.stdout.write(`\n`);
        expect(process.stdout.write(`Simulation wallets will contribution random amounts:` +
            `${hre.ethers.utils.parseEther(contribution)}` + `\n`));
    });
        
    it("should generate random amounts of eth to transfer to Sale Contract", async function () {                                
        process.stdout.write(`\n`);
        const signers: SignerWithAddress[] = await hre.ethers.getSigners();
        for (let i = 0; i < signers.length; i++) {
            const a = signers[i];
            const contribution = `.${Math.floor(Math.random() * 1000000000000)}`;
            process.stdout.write(`${await a.address} => ${hre.ethers.utils.parseEther(contribution)} (wei)` + `\n`);                                        
        };
    });
        
    it("should return wallets with fewer wei/ethers from transfering", async function () {
        process.stdout.write(`\n`);
        const signers: SignerWithAddress[] = await hre.ethers.getSigners();        
        for (let i = 0; i < signers.length; i++) {
            const a = signers[i];
            const eth = await a.getBalance();
            process.stdout.write(`${await a.address}:${eth} (eth)` + `\n`);
        }
    });
};
