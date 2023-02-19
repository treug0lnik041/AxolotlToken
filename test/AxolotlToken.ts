import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("AxolotlToken", function () {
	async function deployFixture() {
		const [owner, otherAccount] = await ethers.getSigners();

		const Token = await ethers.getContractFactory("AxolotlToken");
		const token = await Token.deploy("1000000000000");
	
		return { token, owner, otherAccount };
	}

	describe("Deployment", function () {
		it("Should mint to the owner address when deployed", async function () {
			const { token, owner, otherAccount } = await loadFixture(deployFixture);

			expect(await token.totalSupply()).to.equal("1000000000000");
			expect(await token.balanceOf(owner.address)).to.equal("1000000000000");
		});
	});

	describe("Transfer", function () {
		it("transfer from owner to otherAccount", async function () {
			const { token, owner, otherAccount } = await loadFixture(deployFixture);

			expect(await token.balanceOf(owner.address)).to.equal("1000000000000");

			await token.transfer(otherAccount.address, 10000);
			expect(await token.balanceOf(otherAccount.address)).to.equal(10000);
			expect(await token.balanceOf(owner.address)).to.not.equal("1000000000000");
		});

		it("transfer from otherAccount to owner", async function () {
			const { token, owner, otherAccount } = await loadFixture(deployFixture);
			await token.redeem(otherAccount.address, 10000);

			expect(await token.balanceOf(otherAccount.address)).to.equal(10000);

			await token.connect(otherAccount).transfer(owner.address, 10000);
			expect(await token.balanceOf(otherAccount.address)).to.equal(0);
			expect(await token.balanceOf(owner.address)).to.equal("1000000010000");
		});
	});

	describe("TransferFrom", function () {
		it("transferFrom from owner to otherAccount", async function () {
			const { token, owner, otherAccount } = await loadFixture(deployFixture);

			expect(await token.balanceOf(owner.address)).to.equal("1000000000000");

			await token.approve(otherAccount.address, 10000);
			expect(await token.allowance(owner.address, otherAccount.address)).to.equal(10000);

			await token.connect(otherAccount).transferFrom(owner.address, otherAccount.address, 10000);
			expect(await token.balanceOf(otherAccount.address)).to.equal(10000);
			expect(await token.allowance(owner.address, otherAccount.address)).to.equal(0);
			expect(await token.balanceOf(owner.address)).to.not.equal("1000000000000");
		});
	});

	describe("Metadata", function () {
		it("symbol", async function () {
			const { token, owner, otherAccount } = await loadFixture(deployFixture);

			expect(await token.symbol()).to.equal("AXLTL");
		});

		it("name", async function () {
			const { token, owner, otherAccount } = await loadFixture(deployFixture);

			expect(await token.name()).to.eql("Axolotl Token");
		});

		it("decimals", async function () {
			const { token, owner, otherAccount } = await loadFixture(deployFixture);

			expect(await token.decimals()).to.eql(6);
		});

		it("total supply", async function () {
			const { token, owner, otherAccount } = await loadFixture(deployFixture);

			expect(await token.totalSupply()).to.equal("1000000000000");
		})
	});
});
