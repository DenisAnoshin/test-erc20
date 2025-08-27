import { expect } from "chai";
import { ethers } from "hardhat";
import "@nomicfoundation/hardhat-chai-matchers";
import type { Contract } from "ethers";

type TokenLike = {
  name(): Promise<string>;
  symbol(): Promise<string>;
  totalSupply(): Promise<bigint>;
  decimals(): Promise<number>;
  balanceOf(address: string): Promise<bigint>;
  allowance(owner: string, spender: string): Promise<bigint>;
  transfer(to: string, amount: bigint): Promise<unknown>;
  approve(spender: string, amount: bigint): Promise<unknown>;
  transferFrom(from: string, to: string, amount: bigint): Promise<unknown>;
  mint(to: string, amount: bigint): Promise<unknown>;
  connect(signer: unknown): TokenLike & Contract;
};

describe("MyToken", function () {
  async function deployFixture() {
    const [owner, user, spender] = await ethers.getSigners();
    const MyToken = await ethers.getContractFactory("MyToken");
    const initialSupply = ethers.parseUnits("1000000", 18);
    const token = (await MyToken.deploy("MyToken", "MTK", initialSupply)) as unknown as Contract & TokenLike;
    await token.waitForDeployment();
    return { token, owner, user, spender, initialSupply };
  }

  it("has correct name, symbol, supply", async () => {
    const { token, initialSupply } = await deployFixture();
    expect(await token.name()).to.equal("MyToken");
    expect(await token.symbol()).to.equal("MTK");
    const supply = await token.totalSupply();
    expect(supply).to.equal(initialSupply);
  });

  it("assigns initial supply to owner", async () => {
    const { token, owner, initialSupply } = await deployFixture();
    const bal = await token.balanceOf(await owner.getAddress());
    expect(bal).to.equal(initialSupply);
  });

  it("transfers tokens", async () => {
    const { token, owner, user } = await deployFixture();
    const amount = ethers.parseUnits("1000", 18);
    await expect(token.transfer(await user.getAddress(), amount))
      .to.emit(token, "Transfer")
      .withArgs(await owner.getAddress(), await user.getAddress(), amount);
    expect(await token.balanceOf(await user.getAddress())).to.equal(amount);
  });

  it("approves and transferFrom works", async () => {
    const { token, owner, user, spender } = await deployFixture();
    const amount = ethers.parseUnits("500", 18);
    await token.transfer(await user.getAddress(), amount);
    await expect(token.connect(user).approve(await spender.getAddress(), amount))
      .to.emit(token, "Approval").withArgs(await user.getAddress(), await spender.getAddress(), amount);
    await expect(token.connect(spender).transferFrom(await user.getAddress(), await owner.getAddress(), amount))
      .to.emit(token, "Transfer");
    expect(await token.allowance(await user.getAddress(), await spender.getAddress())).to.equal(0);
  });

  it("only owner can mint", async () => {
    const { token, owner, user } = await deployFixture();
    const amount = ethers.parseUnits("1", 18);
    await expect(token.connect(user).mint(await user.getAddress(), amount)).to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");
    await token.connect(owner).mint(await user.getAddress(), amount);
    expect(await token.balanceOf(await user.getAddress())).to.equal(amount);
  });
});


