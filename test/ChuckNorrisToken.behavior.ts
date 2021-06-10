import { expect } from "chai";

export function shouldBehaveLikeChuckNorris(): void {
    it("should return a default description", async function () {
        const description = "Chuck Norris rested on the 1st day.";
        expect(await this.chuckNorrisToken.connect(this.signers.admin).description());
        await this.chuckNorrisToken.connect(this.signers.admin).updateDescription(description);
        expect(await this.chuckNorrisToken.connect(this.signers.admin).description()).to.equal(description);
    });
}
