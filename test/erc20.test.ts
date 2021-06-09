import chai from "chai";
import { ethers } from "hardhat";
import { solidity } from "ethereum-waffle";
import { MeowToken__factory } from "../typechain";

chai.use(solidity);
const { expect } = chai;

describe("Token", () => {
  let tokenAddress: string;

  beforeEach(async () => {
    const [deployer, user] = await ethers.getSigners();
    const tokenFactory = new MeowToken__factory(deployer);
    const tokenContract = await tokenFactory.deploy();
    tokenAddress = tokenContract.address;
    expect(await tokenContract.totalSupply()).to.eq(0);
  });

  describe("Mint", async () => {
    it("Should mint some tokens", async () => {
      const [deployer, user] = await ethers.getSigners();
      const tokenInstance = new MeowToken__factory(deployer).attach(tokenAddress);
      const toMint = ethers.utils.parseEther("10000000000");
      await tokenInstance.mint(user.address, toMint);
      expect(await tokenInstance.totalSupply()).to.eq(toMint);
    });
  });

  describe("Transfer", async () => {
    it("Should transfer tokens between users", async () => {
      const [deployer, sender, receiver] = await ethers.getSigners();
      const deployerInstance = new MeowToken__factory(deployer).attach(tokenAddress);
      const toMint = ethers.utils.parseEther("10000000000");
      await deployerInstance.mint(sender.address, toMint);
      expect(await deployerInstance.balanceOf(sender.address)).to.eq(toMint);
      const senderInstance = new MeowToken__factory(sender).attach(tokenAddress);
      const toSend = ethers.utils.parseEther("0.4");
      await senderInstance.transfer(receiver.address, toSend);
      expect(await senderInstance.balanceOf(receiver.address)).to.eq(toSend);
    });
  });
});
