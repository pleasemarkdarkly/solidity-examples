import hre from "hardhat";
import { Artifact } from "hardhat/types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { MultiSigWallet } from "../../typechain/MultiSigWallet";
import { Signers } from "../../types";
// import { shouldBehaveLikeMultiSig } from "./MultiSig.behavior";

const { deployContract } = hre.waffle;

describe("Multi-Sig Contract Example", function () {
    before(async function () {
        this.signers = {} as Signers;
        const signers: SignerWithAddress[] = await hre.ethers.getSigners();
        this.signers.admin = signers[0];
    });

    describe("Creating Multi-Sig Contract", function () {
        beforeEach(async function () {            
            const multiSigArtifact: Artifact = await hre.artifacts.readArtifact("MultiSigWallet");
            this.multiSig = <MultiSigWallet>await deployContract(this.signers.admin, multiSigArtifact, []);
        });

        // shouldBehaveLikeMultiSig();
    });
});
