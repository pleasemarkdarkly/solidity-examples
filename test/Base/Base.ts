import hre from "hardhat";
import { Artifact } from "hardhat/types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import { Base } from "../../typechain/Base";
import { Signers } from "../../types";
import { shouldBehaveLikeBase } from "./Base.behavior";

const { deployContract } = hre.waffle;

describe("Base Contract Description Example", function () {
    before(async function () {
        this.signers = {} as Signers;
        const signers: SignerWithAddress[] = await hre.ethers.getSigners();
        this.signers.admin = signers[0];
    });

    describe("Creating Base Contract", function () {
        beforeEach(async function () {
            const description: string = "Hello, world!";
            const baseArtifact: Artifact = await hre.artifacts.readArtifact("Base");
            this.base = <Base>await deployContract(this.signers.admin, baseArtifact, [description]);
        });

        shouldBehaveLikeBase();
    });
});
