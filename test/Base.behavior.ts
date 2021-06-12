import { expect } from "chai";

export function shouldBehaveLikeBase(): void {
    it("should return new description when its changed", async function () {
        expect(await this.base.connect(this.signers.admin)
            .getDescription()).to.equal("Hello, world!");

        await this.base.setDescription("Hola, mundo!");
        expect(await this.base.connect(this.signers.admin)
            .getDescription()).to.equal("Hola, mundo!");
    });
}
