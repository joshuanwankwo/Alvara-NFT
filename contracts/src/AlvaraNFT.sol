// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { SafeERC20, IERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { ERC721URIStorage, ERC721 } from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import { Ownable2Step, Ownable } from "@openzeppelin/contracts/access/Ownable2Step.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

// external interfaces required
interface IVeALVA {
    function balanceOf(address account) external view returns (uint);
}

contract AlvaraNFT is ERC721URIStorage, Ownable2Step, ReentrancyGuard {
    uint256 public constant VEALVA_DISCOUNT_AMOUNT = 150e18;
    uint256 public standardPrice  = 0.0003 ether; // ~$1 for testing
    uint256 public nextTokenId    = 1;
    uint24  public maxMintPerUser = 3;
    bool    public mintingEnabled; // false by default
    uint32  public mintingEndTime;
    string  public baseURI;

    address public immutable veALVAToken;

    mapping(address user    => uint256 mintCount) public walletMints;
    mapping(uint256 tokenId => string designId)   public tokenDesign;

    event PriceUpdated(uint256 newPrice);
    event BaseURIUpdated(string newBaseUri);
    event MaxMintPerUserUpdated(uint24 newMaxMintPerUser);
    event OpenedMinting(uint256 openTime, uint256 expiryTime);

    constructor(
        address _veALVAToken
    ) ERC721("Alvara NFT", "ALVA") Ownable(msg.sender) {
        veALVAToken = _veALVAToken;
        baseURI = "https://yellow-imperial-wasp-317.mypinata.cloud/ipfs/bafybeibtxhw6zer4i4ehpckmfhoh7qyvr6ggshpqadx5urm7cajcyfxts4/";
    }

    // allows users to mint nfts
    function mint(string calldata designId) external payable nonReentrant {
        // note: user can input arbitrary `designId`. Front-ends must be
        // careful to sanitize and not trust this input

        // minting must be enabled first
        require(mintingEnabled, "Minting disabled");
        // minting time must not have expired
        require(block.timestamp < mintingEndTime, "Minting time expired");

        // each wallet can only mint max 3 nfts. The client understands that
        // users can easily create infinite wallet addresses and bypass this
        // requirement but still wants it in here anyway
        require(walletMints[msg.sender] < maxMintPerUser, "Max mint per user");

        // users with veALVA get a discount on the mint fee
        bool hasDiscount = hasVeALVA(msg.sender);
        uint256 price = hasDiscount ? standardPrice / 2 : standardPrice;
        require(msg.value == price, "Incorrect ETH sent");

        uint256 tokenId = nextTokenId++;

        // update storage
        tokenDesign[tokenId] = designId;
        walletMints[msg.sender] += 1;

        // ETH revenue stays in contract for manual team processing
        
        // mint NFT to user
        _safeMint(msg.sender, tokenId);
    }



    // generate dynamic URIs using baseURI plus user-input `designId`
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Nonexistent token");

        string memory designId = tokenDesign[tokenId];
        return string(
            abi.encodePacked(
                baseURI,
                designId,
                ".json"
            )
        );
    }

    // view functions to return useful data
    function hasVeALVA(address user) public view returns (bool) {
        return IVeALVA(veALVAToken).balanceOf(user) > VEALVA_DISCOUNT_AMOUNT;
    }
    function getDiscountPrice() public view returns (uint256) {
        return standardPrice / 2;
    }

    // owner functions to change important configuration options
    function setStandardPrice(uint256 newPrice) external onlyOwner {
        require(newPrice > 0, "Price must be greater than 0");

        // owner trusted to correctly set price, only restriction is non-zero
        standardPrice = newPrice;
        emit PriceUpdated(newPrice);
    }

    function setBaseURI(string memory newBaseURI) external onlyOwner {
        baseURI = newBaseURI;
        emit BaseURIUpdated(newBaseURI);
    }
    function setMaxMintPerUser(uint24 newMaxMintPerUser) external onlyOwner {
        maxMintPerUser = newMaxMintPerUser;
        emit MaxMintPerUserUpdated(newMaxMintPerUser);
    }
    function openMinting() external onlyOwner {
        require(!mintingEnabled, "Minting already opened");
        uint32 expiryTime = uint32(block.timestamp + 7 days);

        mintingEnabled = true;
        mintingEndTime = expiryTime;

        emit OpenedMinting(block.timestamp, expiryTime);
    }

    // fallback to receive ETH if needed
    receive() external payable {}

    // withdraw ETH revenue to owner (team wallet)
    function withdrawETH() external onlyOwner {
        uint256 ethBalance = address(this).balance;
        require(ethBalance > 0, "No ETH to withdraw");
        
        (bool success, ) = payable(msg.sender).call{value: ethBalance}("");
        require(success, "ETH transfer failed");
    }

    // rescue any tokens that are accidentally sent to this contract
    function rescueToken(IERC20 token) external onlyOwner {
        uint256 tokenBalance = token.balanceOf(address(this));
        if(tokenBalance > 0) SafeERC20.safeTransfer(token, msg.sender, tokenBalance);
    }
}