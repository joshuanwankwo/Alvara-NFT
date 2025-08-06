// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AlvaraMintIPFS is ERC721URIStorage, Ownable {
    // Removed MAX_MINTS_PER_WALLET constant
    uint256 public constant STANDARD_PRICE = 0.00055 ether;
    uint256 public constant DISCOUNT_PRICE = 0.000275 ether;
    uint256 public constant DISCOUNT_THRESHOLD = 150 * 1e18;

    address public alvaToken;
    uint256 public nextTokenId = 1;

    mapping(address => uint256) public walletMints;
    mapping(uint256 => uint256) public tokenDesign; // tokenId => designId
    
    // IPFS metadata hash mapping for each design
    mapping(uint256 => string) public designMetadataHash;

    constructor(address _alvaToken) ERC721("Alvara NFT", "ALVA") Ownable(msg.sender) {
        alvaToken = _alvaToken;
        
        // Set IPFS hashes for each design's metadata
        designMetadataHash[1] = "QmXci1VZWjwJAmY28uuSPpCtfWg2BAt2PLjFZpC5Q5T8rr";
        designMetadataHash[2] = "QmZYgMkkvAoG24TZmkBHbEZsqEjfacUECPF6sginF3Yu3r";
        designMetadataHash[3] = "QmRkbPt9KgwqBYrcWpDd3w4CFXZrzmJSbMRHPaaUsmiM39";
        designMetadataHash[4] = "QmUu5k6jL34K2UutvrbdPFVFMjU9Jz2NocuTW15uP1Dj7x";
        designMetadataHash[5] = "QmVxkPDZEBd74XVimxPpNtWjPJ6NvFfnZrc5uvP3BTmL7C";
        designMetadataHash[6] = "QmV37ntf4A6oFoQtouR8rjjkBLbitMPveDqpV33p4sYqhQ";
        designMetadataHash[7] = "QmRGDXEwAW1yzktvQiMcc4ANu4vQ3wB6T4ZAF5B4TTZiYb";
        designMetadataHash[8] = "QmayaiJDu9r9Twf5g5vxdM6tBs6paUW1Kw5tfy1jG3kaF7";
        designMetadataHash[9] = "QmSeQoXAFLCi9APN1p65M8hpJkf2HAs14xufzsWatEss9r";
        designMetadataHash[10] = "QmVhB2DvE4voqpEb42ptdVJA9mpNjiWuoUDRcjR2CAJQTh";
    }

    function mint(uint256 designId) external payable {
        // Removed minting limit check
        require(designId >= 1 && designId <= 10, "Invalid design");

        // Check ALVA balance
        bool hasDiscount = IERC20(alvaToken).balanceOf(msg.sender) >=
            DISCOUNT_THRESHOLD;
        uint256 price = hasDiscount ? DISCOUNT_PRICE : STANDARD_PRICE;
        require(msg.value >= price, "Insufficient ETH sent");

        // Mint NFT
        uint256 tokenId = nextTokenId++;
        _safeMint(msg.sender, tokenId);
        
        // Assign design to token
        tokenDesign[tokenId] = designId;

        walletMints[msg.sender] += 1;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Nonexistent token");
        
        uint256 designId = tokenDesign[tokenId];
        string memory metadataHash = designMetadataHash[designId];
        
        return string(abi.encodePacked("https://gateway.pinata.cloud/ipfs/", metadataHash));
    }

    // Admin function to update metadata hash for a design
    function updateDesignMetadata(uint256 designId, string calldata newHash) external onlyOwner {
        require(designId >= 1 && designId <= 10, "Invalid design");
        designMetadataHash[designId] = newHash;
    }

    // Utility to convert uint to string
    function uint2str(uint _i) internal pure returns (string memory _uintAsString) {
        if (_i == 0) return "0";
        uint j = _i;
        uint len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint k = len;
        while (_i != 0) {
            k = k-1;
            bstr[k] = bytes1(uint8(48 + _i % 10));
            _i /= 10;
        }
        return string(bstr);
    }

    function setAlvaToken(address _alva) external onlyOwner {
        alvaToken = _alva;
    }

    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
} 