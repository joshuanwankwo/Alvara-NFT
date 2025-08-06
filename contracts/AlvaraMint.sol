// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AlvaraMint is ERC721URIStorage, Ownable {
    // Mint limit removed - unlimited minting per wallet
    uint256 public constant STANDARD_PRICE = 0.00055 ether;
    uint256 public constant DISCOUNT_PRICE = 0.000275 ether;
    uint256 public constant DISCOUNT_THRESHOLD = 150 * 1e18;

    address public alvaToken;

    uint256 public nextTokenId = 1;

    mapping(address => uint256) public walletMints;
    mapping(uint256 => uint256) public tokenDesign; // tokenId => designId

    constructor(
        address _alvaToken
    ) ERC721("Alvara NFT", "ALVA") Ownable(msg.sender) {
        alvaToken = _alvaToken;
    }

    function mint(uint256 designId) external payable {
        require(designId >= 1 && designId <= 10, "Invalid design");

        // Check ALVA balance
        bool hasDiscount = IERC20(alvaToken).balanceOf(msg.sender) >=
            DISCOUNT_THRESHOLD;
        uint256 price = hasDiscount ? DISCOUNT_PRICE : STANDARD_PRICE;
        require(msg.value >= price, "Insufficient ETH sent");

        // Mint NFT
        uint256 tokenId = nextTokenId++;
        _safeMint(msg.sender, tokenId);

        // Assign metadata
        tokenDesign[tokenId] = designId;

        walletMints[msg.sender] += 1;
    }

    // Base URI for metadata (can be updated by owner)
    string private _baseTokenURI = "https://api.alvara-nft.com/metadata/";
    
    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Nonexistent token");
        uint256 designId = tokenDesign[tokenId];
        return
            string(
                abi.encodePacked(
                    _baseTokenURI,
                    uint2str(designId),
                    ".json"
                )
            );
    }
    
    // Allow owner to update base URI (useful for migrations)
    function setBaseURI(string calldata newBaseURI) external onlyOwner {
        _baseTokenURI = newBaseURI;
    }
    
    // Get current base URI
    function baseURI() external view returns (string memory) {
        return _baseTokenURI;
    }

    // Utility to convert uint to string (no Strings.toString in <0.8.0)
    function uint2str(
        uint _i
    ) internal pure returns (string memory _uintAsString) {
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
            k = k - 1;
            bstr[k] = bytes1(uint8(48 + (_i % 10)));
            _i /= 10;
        }
        return string(bstr);
    }

    // Admin helpers
    function setAlvaToken(address _alva) external onlyOwner {
        alvaToken = _alva;
    }

    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
} 