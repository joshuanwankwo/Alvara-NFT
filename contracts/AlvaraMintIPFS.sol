// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AlvaraMintIPFS is ERC721URIStorage, Ownable {
    uint256 public constant STANDARD_PRICE = 0.01 ether;
    uint256 public constant DISCOUNT_PRICE = 0.005 ether;
    uint256 public constant DISCOUNT_THRESHOLD = 150 * 1e18;

    address public alvaToken;
    uint256 public nextTokenId = 1;

    mapping(address => uint256) public walletMints;
    mapping(uint256 => uint256) public tokenDesign; // tokenId => designId
    
    // IPFS metadata hash mapping for each design
    mapping(uint256 => string) public designMetadataHash;

    constructor(address _alvaToken) ERC721("Alvara NFT", "ALVA") Ownable(msg.sender) {
        alvaToken = _alvaToken;
        
        // Set IPFS hashes for each design's metadata (placeholder hashes - replace with real ones)
        designMetadataHash[1] = "QmExampleMetadata1";  // Basket Beth
        designMetadataHash[2] = "QmExampleMetadata2";  // Degen Derrick
        designMetadataHash[3] = "QmExampleMetadata3";  // Freddy FOMO
        designMetadataHash[4] = "QmExampleMetadata4";  // Gloria Gains
        designMetadataHash[5] = "QmExampleMetadata5";  // Henry Hodl
        designMetadataHash[6] = "QmExampleMetadata6";  // Kate Candle
        designMetadataHash[7] = "QmExampleMetadata7";  // Leroy Leverage
        designMetadataHash[8] = "QmExampleMetadata8";  // Max Effort
        designMetadataHash[9] = "QmExampleMetadata9";  // Sally Swaps
        designMetadataHash[10] = "QmExampleMetadata10"; // William Banker
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