import hre from "hardhat";
import { Artifact } from "hardhat/types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import { ChuckNorrisToken } from "../../typechain/ChuckNorrisToken";
import { Signers } from "../../types";
import { shouldBehaveLikeChuckNorris } from './ChuckNorrisToken.behavior';

const { deployContract } = hre.waffle;

describe("Unit tests", function () {        
    before(async function () {
        this.signers = {} as Signers;
        const signers: SignerWithAddress[] = await hre.ethers.getSigners();
        this.signers.admin = signers[0];        
    });

    describe("Chuck Norris Token", function () {
        beforeEach(async function () {            
            const chuckNorrisTokenArtifact: Artifact =
                await hre
                    .artifacts
                    .readArtifact("ChuckNorrisToken");
            this.chuckNorrisToken =
                <ChuckNorrisToken>await deployContract(this.signers.admin,
                    chuckNorrisTokenArtifact, []);
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            describe(`Chuck Norris Token created at:${this.chuckNorrisToken.address}`, () => { });
        });
        
        shouldBehaveLikeChuckNorris();
    });

});
