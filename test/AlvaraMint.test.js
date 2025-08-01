const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AlvaraMint", function () {
  let alvaraMint;
  let mockAlva;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy mock ALVA token
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    mockAlva = await MockERC20.deploy();
    await mockAlva.deployed();

    // Deploy AlvaraMint
    const AlvaraMint = await ethers.getContractFactory("AlvaraMint");
    alvaraMint = await AlvaraMint.deploy(mockAlva.address);
    await alvaraMint.deployed();

    // Give addr1 enough ALVA tokens for discount
    await mockAlva.mint(addr1.address, ethers.utils.parseEther("200"));
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await alvaraMint.owner()).to.equal(owner.address);
    });

    it("Should set the correct ALVA token address", async function () {
      expect(await alvaraMint.alvaToken()).to.equal(mockAlva.address);
    });
  });

  describe("Minting", function () {
    it("Should mint NFT with standard price", async function () {
      const price = ethers.utils.parseEther("0.00055");

      const tx = await alvaraMint.connect(addr2).mint(1, { value: price });
      const receipt = await tx.wait();

      // Check transfer event was emitted
      expect(receipt.events.length).to.be.greaterThan(0);

      expect(await alvaraMint.ownerOf(1)).to.equal(addr2.address);
      expect((await alvaraMint.tokenDesign(1)).toNumber()).to.equal(1);
    });

    it("Should mint NFT with discount price for ALVA holders", async function () {
      const discountPrice = ethers.utils.parseEther("0.000275");

      const tx = await alvaraMint
        .connect(addr1)
        .mint(1, { value: discountPrice });
      const receipt = await tx.wait();

      // Check transfer event was emitted
      expect(receipt.events.length).to.be.greaterThan(0);

      expect(await alvaraMint.ownerOf(1)).to.equal(addr1.address);
    });

    it("Should fail if max mints per wallet exceeded", async function () {
      const price = ethers.utils.parseEther("0.00055");

      // Mint 3 NFTs (max limit)
      await alvaraMint.connect(addr2).mint(1, { value: price });
      await alvaraMint.connect(addr2).mint(2, { value: price });
      await alvaraMint.connect(addr2).mint(3, { value: price });

      // Try to mint 4th NFT
      try {
        await alvaraMint.connect(addr2).mint(4, { value: price });
        expect.fail("Expected transaction to revert");
      } catch (error) {
        expect(error.message).to.include("Mint limit reached");
      }
    });

    it("Should fail with insufficient payment", async function () {
      const insufficientPrice = ethers.utils.parseEther("0.0001");

      try {
        await alvaraMint.connect(addr2).mint(1, { value: insufficientPrice });
        expect.fail("Expected transaction to revert");
      } catch (error) {
        expect(error.message).to.include("Insufficient ETH sent");
      }
    });
  });

  describe("Admin functions", function () {
    it("Should allow owner to withdraw funds", async function () {
      const price = ethers.utils.parseEther("0.00055");
      await alvaraMint.connect(addr2).mint(1, { value: price });

      const initialBalance = await owner.getBalance();
      await alvaraMint.withdraw();
      const finalBalance = await owner.getBalance();

      expect(finalBalance.gt(initialBalance)).to.be.true;
    });

    it("Should allow owner to update ALVA token address", async function () {
      const newTokenAddress = addr1.address; // Use any address for testing

      await alvaraMint.setAlvaToken(newTokenAddress);

      expect(await alvaraMint.alvaToken()).to.equal(newTokenAddress);
    });
  });
});
