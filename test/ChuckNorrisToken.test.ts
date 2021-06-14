import chai from "chai";
import { ethers } from "hardhat";
import { solidity } from "ethereum-waffle";
import { ChuckNorrisToken__factory } from "../typechain";

chai.use(solidity);
const { expect } = chai;

describe("Open Zeppelin Chuck Norris Token Example", () => {
    let tokenAddress: string;

    beforeEach(async () => {
        const [deployer] = await ethers.getSigners();
        const tokenFactory = new ChuckNorrisToken__factory(deployer);
        const tokenContract = await tokenFactory.deploy();
        tokenAddress = tokenContract.address;
        expect(await tokenContract.totalSupply()).to.eq(0);
    });

    describe("Mint", async () => {
        it("should mint some tokens", async () => {
            const [deployer, user] = await ethers.getSigners();
            const tokenInstance = new ChuckNorrisToken__factory(deployer).attach(tokenAddress);
            const toMint = ethers.utils.parseEther("10000000000");
            await tokenInstance.mint(user.address, toMint);
            expect(await tokenInstance.totalSupply()).to.eq(toMint);
        });
    });

    describe("Transfer", async () => {
        it("should transfer tokens between users", async () => {
            const [deployer, sender, receiver] = await ethers.getSigners();
            const deployerInstance = new ChuckNorrisToken__factory(deployer).attach(tokenAddress);
            const toMint = ethers.utils.parseEther("10000000000");
            await deployerInstance.mint(sender.address, toMint);
            expect(await deployerInstance.balanceOf(sender.address)).to.eq(toMint);
            
            const senderInstance = new ChuckNorrisToken__factory(sender).attach(tokenAddress);
            const toSend = ethers.utils.parseEther("0.4");
            await senderInstance.transfer(receiver.address, toSend);
            expect(await senderInstance.balanceOf(receiver.address)).to.eq(toSend);
        });
    });
});
