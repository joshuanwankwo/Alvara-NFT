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
    uint256 public constant STANDARD_PRICE = 0.001 ether;
    uint256 public constant DISCOUNT_PRICE = 0.0005 ether;

    address public alvaToken;
    address public veALVAToken;
    IUniswapV4Router public uniswapV4Router;
    uint256 public nextTokenId = 1;

    mapping(address => uint256) public walletMints;
    mapping(uint256 => uint256) public tokenDesign; // tokenId => designId

    constructor(
        address _alvaToken,
        address _veALVAToken,
        address _uniswapV4Router
    ) ERC721("Alvara NFT", "ALVA") Ownable(msg.sender) {
        alvaToken = _alvaToken;
        veALVAToken = _veALVAToken;
        uniswapV4Router = IUniswapV4Router(_uniswapV4Router);
    }

    function mint(uint256 designId) external payable nonReentrant {
        require(designId >= 1 && designId <= 10, "Invalid design");

        // Check veALVA balance for discount
        bool hasDiscount = hasVeALVA(msg.sender);
        uint256 price = hasDiscount ? DISCOUNT_PRICE : STANDARD_PRICE;
        require(msg.value == price, "Incorrect ETH sent");

        // Mint NFT
        uint256 tokenId = nextTokenId++;
        _safeMint(msg.sender, tokenId);
        
        // Assign design to token
        tokenDesign[tokenId] = designId;

        walletMints[msg.sender] += 1;

        // Swap ETH for ALVA and send to user
        _swapAndSendAlva(msg.value, msg.sender);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Nonexistent token");
        
        uint256 designId = tokenDesign[tokenId];
        require(designId >= 1 && designId <= 10, "Invalid design ID");
        
        return string(abi.encodePacked(
            "https://yellow-imperial-wasp-317.mypinata.cloud/ipfs/bafybeib7gvz7x362k3fee6hx3pff2bf4bph7vmimpetby3tawt75oenvzi/",
            uint2str(designId),
            ".json"
        ));
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

    function hasVeALVA(address user) public view returns (bool) {
        return IVeALVA(veALVAToken).balanceOf(user) > 0;
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