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
        expect(process.stdout.write(`Simulation wallets will contribution random amounts:` +
            `${hre.ethers.utils.parseEther(contribution)}` + `\n`));
        signers.map(async a => {
            process.stdout.write(`${await a.address}:${await a.getBalance()}` + `\n`);
        });
        process.stdout.write(`\n`);
    });
        
    it("should generate random amounts of eth to transfer to Sale Contract", async function () {                                
        const signers: SignerWithAddress[] = await hre.ethers.getSigners();
        signers.map(async a => {
            const contribution = `.${Math.floor(Math.random() * 99999999999999999999)}`;
            process.stdout.write(`${await a.address}=> ${hre.ethers.utils.parseEther(contribution)} (wei)` + `\n`);
            await a.sendTransaction({
                to: await this.sale.address,
                value: hre.ethers.utils.parseEther(contribution)
            });
        });
        // process.stdout.write(`\n`);
    });

    it("should return wallets with fewer wei/ethers from transfering", async function () {
        const signers: SignerWithAddress[] = await hre.ethers.getSigners();
        signers.map(async a => {            
            const eth = await a.getBalance();            
            process.stdout.write(`${await a.address}:${eth} (eth)` + `\n`);            
        });
    });

    /*
    it("should return all wallets with token balances", async function () {        
        process.stdout.write(`\n`);
        const signers: SignerWithAddress[] = await hre.ethers.getSigners();
        const totalTokens = await this.sale.connect(this.signers.admin).totalMinted();
        process.stdout.write(`Total Tokens minted via Sale contract:${totalTokens}` + `\n` + 
            `Total ETH value of the payable wallet:${await this.proceedsPool.getBalance()}` + `\n`
        );        
        signers.map(async a => {
            if (await a.address.toString() !== await this.proceedsWallet.address.toString()) {
                const add = await a.address;
                const tok = await this.token.connect(this.signers.admin).balanceOf(add);
                const sym = await this.token.connect(this.signers.admin).symbol();
                const eth = await a.getBalance();
                if (parseInt(eth.toString()) > 0) {
                    process.stdout.write(`${add}:${tok} (${sym})` + `\n`);
                }
            }
        });
    })
    */
}
