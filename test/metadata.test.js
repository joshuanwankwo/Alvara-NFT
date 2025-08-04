const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AlvaraMint Metadata", function () {
  let alvaraMint;
  let mockAlva;
  let owner;
  let addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();

    // Deploy mock ALVA token
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    mockAlva = await MockERC20.deploy();
    await mockAlva.deployed();

    // Deploy AlvaraMint
    const AlvaraMint = await ethers.getContractFactory("AlvaraMint");
    alvaraMint = await AlvaraMint.deploy(mockAlva.address);
    await alvaraMint.deployed();
  });

  describe("Metadata Management", function () {
    it("Should have correct default base URI", async function () {
      const baseURI = await alvaraMint.baseURI();
      expect(baseURI).to.equal("https://api.alvara-nft.com/metadata/");
    });

    it("Should allow owner to update base URI", async function () {
      const newBaseURI = "https://new-api.alvara-nft.com/metadata/";

      await alvaraMint.setBaseURI(newBaseURI);

      const updatedBaseURI = await alvaraMint.baseURI();
      expect(updatedBaseURI).to.equal(newBaseURI);
    });

    it("Should not allow non-owner to update base URI", async function () {
      const newBaseURI = "https://malicious.com/";

      try {
        await alvaraMint.connect(addr1).setBaseURI(newBaseURI);
        expect.fail("Expected transaction to revert");
      } catch (error) {
        expect(error.message).to.include("OwnableUnauthorizedAccount");
      }
    });

    it("Should return correct token URI after minting", async function () {
      const price = ethers.utils.parseEther("0.00055");
      const designId = 5;

      // Mint NFT
      await alvaraMint.connect(addr1).mint(designId, { value: price });

      // Check token URI
      const tokenURI = await alvaraMint.tokenURI(1);
      expect(tokenURI).to.equal("https://api.alvara-nft.com/metadata/5.json");
    });

    it("Should update token URI when base URI is changed", async function () {
      const price = ethers.utils.parseEther("0.00055");
      const designId = 3;

      // Mint NFT
      await alvaraMint.connect(addr1).mint(designId, { value: price });

      // Check initial token URI
      let tokenURI = await alvaraMint.tokenURI(1);
      expect(tokenURI).to.equal("https://api.alvara-nft.com/metadata/3.json");

      // Update base URI
      const newBaseURI = "https://ipfs.io/ipfs/QmNewHash/";
      await alvaraMint.setBaseURI(newBaseURI);

      // Check updated token URI
      tokenURI = await alvaraMint.tokenURI(1);
      expect(tokenURI).to.equal("https://ipfs.io/ipfs/QmNewHash/3.json");
    });

    it("Should correctly map design IDs to token URIs", async function () {
      const price = ethers.utils.parseEther("0.00055");

      // Mint multiple NFTs with different designs
      await alvaraMint.connect(addr1).mint(1, { value: price });
      await alvaraMint.connect(addr1).mint(7, { value: price });
      await alvaraMint.connect(addr1).mint(10, { value: price });

      // Check each token URI
      expect(await alvaraMint.tokenURI(1)).to.equal(
        "https://api.alvara-nft.com/metadata/1.json"
      );
      expect(await alvaraMint.tokenURI(2)).to.equal(
        "https://api.alvara-nft.com/metadata/7.json"
      );
      expect(await alvaraMint.tokenURI(3)).to.equal(
        "https://api.alvara-nft.com/metadata/10.json"
      );
    });
  });
});
