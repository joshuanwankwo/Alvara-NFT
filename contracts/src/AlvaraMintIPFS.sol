// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface IVeALVA {
    function balanceOf(address account) external view returns (uint);
}

interface IUniswapV4Router {
    function swapExactETHForTokensSupportingFeeOnTransferTokens(
        uint amountOutMin,
        address tokenOut,
        address to,
        uint deadline
    ) external payable;
}

contract AlvaraMintIPFS is ERC721URIStorage, Ownable, ReentrancyGuard {
    uint256 public standardPrice = 0.001 ether; // Default price, can be changed by owner

    address public immutable alvaToken;
    address public immutable veALVAToken;
    IUniswapV4Router public immutable uniswapV4Router;
    uint256 public nextTokenId = 1;

    mapping(address => uint256) public walletMints;
    mapping(uint256 => string) public tokenDesign; // tokenId => designId

    constructor(
        address _alvaToken,
        address _veALVAToken,
        address _uniswapV4Router
    ) ERC721("Alvara NFT", "ALVA") Ownable(msg.sender) {
        alvaToken = _alvaToken;
        veALVAToken = _veALVAToken;
        uniswapV4Router = IUniswapV4Router(_uniswapV4Router);
    }

    function mint(string calldata designId) external payable nonReentrant {
        // Check veALVA balance for discount
        bool hasDiscount = hasVeALVA(msg.sender);
        uint256 price = hasDiscount ? standardPrice / 2 : standardPrice;
        require(msg.value == price, "Incorrect ETH sent");

        // Mint NFT
        uint256 tokenId = nextTokenId++;
        _safeMint(msg.sender, tokenId);
        
        // Assign design ID to token
        tokenDesign[tokenId] = designId;

        walletMints[msg.sender] += 1;

        // Swap ETH for ALVA and send to user
        _swapAndSendAlva(msg.value, msg.sender);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Nonexistent token");
        
        string memory designId = tokenDesign[tokenId];
        
        return string(abi.encodePacked(
            "https://yellow-imperial-wasp-317.mypinata.cloud/ipfs/bafybeib7gvz7x362k3fee6hx3pff2bf4bph7vmimpetby3tawt75oenvzi/",
            designId,
            ".json"
        ));
    }

    function hasVeALVA(address user) public view returns (bool) {
        return IVeALVA(veALVAToken).balanceOf(user) > 0;
    }

    function setStandardPrice(uint256 newPrice) external onlyOwner {
        require(newPrice > 0, "Price must be greater than 0");
        standardPrice = newPrice;
    }

    function getDiscountPrice() public view returns (uint256) {
        return standardPrice / 2;
    }

    function _swapAndSendAlva(uint ethAmount, address to) internal {
        uint deadline = block.timestamp + 300;

        uniswapV4Router.swapExactETHForTokensSupportingFeeOnTransferTokens{
            value: ethAmount
        }(
            0,       // amountOutMin (accept any)
            alvaToken,    // tokenOut
            to,      // tokens sent directly to user
            deadline
        );
    }

    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    receive() external payable {}
} 