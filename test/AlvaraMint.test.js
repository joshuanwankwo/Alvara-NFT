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

    // Deploy AlvaraMintIPFS (the current contract)
    const AlvaraMintIPFS = await ethers.getContractFactory("AlvaraMintIPFS");
    alvaraMint = await AlvaraMintIPFS.deploy(mockAlva.address);
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

    it("Should allow unlimited minting per wallet", async function () {
      const price = ethers.utils.parseEther("0.00055");

      // Mint multiple NFTs (no limit)
      await alvaraMint.connect(addr2).mint(1, { value: price });
      await alvaraMint.connect(addr2).mint(2, { value: price });
      await alvaraMint.connect(addr2).mint(3, { value: price });
      await alvaraMint.connect(addr2).mint(4, { value: price }); // 4th mint should succeed
      await alvaraMint.connect(addr2).mint(5, { value: price }); // 5th mint should succeed

      // Check that all NFTs were minted
      const balance = await alvaraMint.balanceOf(addr2.address);
      expect(balance.toNumber()).to.equal(5);

      const walletMints = await alvaraMint.walletMints(addr2.address);
      expect(walletMints.toNumber()).to.equal(5);
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
