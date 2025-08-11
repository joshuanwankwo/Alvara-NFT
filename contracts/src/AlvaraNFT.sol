// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { SafeERC20, IERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { ERC721URIStorage, ERC721 } from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import { Ownable2Step, Ownable } from "@openzeppelin/contracts/access/Ownable2Step.sol";
import { ReentrancyGuardTransient } from "@openzeppelin/contracts/utils/ReentrancyGuardTransient.sol";

// external interfaces required
interface IVeALVA {
    function balanceOf(address account) external view returns (uint);
}

interface ISwapRouter {
    struct ExactInputSingleParams {
        address tokenIn;
        address tokenOut;
        uint24  fee;
        address recipient;
        uint256 deadline;
        uint256 amountIn;
        uint256 amountOutMinimum;
        uint160 sqrtPriceLimitX96;
    }

    function exactInputSingle(ExactInputSingleParams calldata params)
        external
        payable
        returns (uint256 amountOut);

    function multicall(bytes[] calldata data) external payable returns (bytes[] memory results);

    function refundETH() external payable;
}

contract AlvaraNFT is ERC721URIStorage, Ownable2Step, ReentrancyGuardTransient {
    uint256 public constant VEALVA_DISCOUNT_AMOUNT = 150e18;
    uint256 public standardPrice  = 0.001 ether;
    uint256 public nextTokenId    = 1;
    uint24  public defaultPoolFee = 3000;
    uint24  public maxMintPerUser = 3;
    bool    public mintingEnabled; // false by default
    uint32  public mintingEndTime;
    string  public baseURI;

    address public immutable alvaToken;
    address public immutable veALVAToken;
    address public immutable wethToken;
    ISwapRouter public immutable swapRouter;

    mapping(address user    => uint256 mintCount) public walletMints;
    mapping(uint256 tokenId => string designId)   public tokenDesign;

    event SwapExecuted(address indexed user, uint256 ethIn, uint256 alvaOut);
    event PriceUpdated(uint256 newPrice);
    event PoolFeeUpdated(uint24 newPoolFee);
    event BaseURIUpdated(string newBaseUri);
    event MaxMintPerUserUpdated(uint24 newMaxMintPerUser);
    event OpenedMinting(uint256 openTime, uint256 expiryTime);

    constructor(
        address _alvaToken,
        address _veALVAToken,
        address _wethToken,
        address _swapRouter
    ) ERC721("Alvara NFT", "ALVA") Ownable(msg.sender) {
        alvaToken = _alvaToken;
        veALVAToken = _veALVAToken;
        wethToken = _wethToken;
        swapRouter = ISwapRouter(_swapRouter);
        baseURI = "https://yellow-imperial-wasp-317.mypinata.cloud/ipfs/bafybeibtxhw6zer4i4ehpckmfhoh7qyvr6ggshpqadx5urm7cajcyfxts4/";
    }

    // allows users to mint nfts
    function mint(string calldata designId,
                  uint256 swapDeadline,
                  uint256 swapMinOutput,
                  uint24  swapPoolFeeTier)
    external payable nonReentrant {
        // sanity check inputs
        require(swapMinOutput > 0, "Swap slippage > 0");

        // note: user can input arbitrary `designId`. Front-ends must be
        // careful to sanitize and not trust this input

        // if user passed 0 for swap pool fee tier, use the default
        if(swapPoolFeeTier == 0) swapPoolFeeTier = defaultPoolFee;
        // otherwise must be a valid UniswapV3 pool fee tier
        else require(_isValidPoolFeeTier(swapPoolFeeTier), "Invalid pool fee tier");

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

        // update storage before external call
        tokenDesign[tokenId] = designId;
        walletMints[msg.sender] += 1;

        // triggers external call to UniswapV3
        // swaps ETH minter fee for ALVA token and sends
        // ALVA back to user
        _swapETHForALVA(msg.value, swapDeadline, swapMinOutput, swapPoolFeeTier, msg.sender);

        // triggers external call to minter; doing this last to prevent
        // any potential cross-function re-entrancy since it transfers control
        // to `msg.sender` if they are a smart contract
        _safeMint(msg.sender, tokenId);
    }

    // helper function to perform swaps as part of nft mint
    function _swapETHForALVA(uint256 ethAmount,
                             uint256 swapDeadline,
                             uint256 swapMinOutput,
                             uint24  swapPoolFeeTier,
                             address recipient)
    internal {
        // sanity check, should never actually be triggered
        require(ethAmount > 0, "No ETH to swap");

        // UniswapV3 supports direct ETH->X swap without explicitly
        // wrapping ETH->WETH and approving, when `tokenIn == WETH`
        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter.ExactInputSingleParams({
            tokenIn: wethToken,
            tokenOut: alvaToken,
            fee: swapPoolFeeTier,
            recipient: recipient, // send output tokens directly to minter
            deadline: swapDeadline,
            amountIn: ethAmount,
            amountOutMinimum: swapMinOutput,
            sqrtPriceLimitX96: 0
        });

        // Use multicall for batched execution to atomically handle
        // low-liquidity partial fill ETH refunds
        bytes[] memory multicallData = new bytes[](2);
        multicallData[0] = abi.encodeWithSelector(ISwapRouter.exactInputSingle.selector, params);
        multicallData[1] = abi.encodeWithSelector(ISwapRouter.refundETH.selector);

        bytes[] memory results = swapRouter.multicall{value: ethAmount}(multicallData);
        uint256 amountOut = abi.decode(results[0], (uint256));

        emit SwapExecuted(recipient, ethAmount, amountOut);

        // refund excess ETH to recipient; safe to use this contract's balance since
        // this contract should never hold ETH (or ERC20 tokens) between transactions
        // if any ETH or ERC20 tokens are mistakenly sent to this contract by users,
        // the admin has `rescueToken` and `rescueETH` functions they can call
        uint256 refundAmount = address(this).balance;
        if (refundAmount > 0) {
            _safeTransferETH(recipient, refundAmount);
        }
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
    function setDefaultPoolFee(uint24 newPoolFee) external onlyOwner {
        require(_isValidPoolFeeTier(newPoolFee), "Invalid pool fee tier");

        defaultPoolFee = newPoolFee;
        emit PoolFeeUpdated(newPoolFee);
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

    // helper function to ensure valid UniswapV3 pool fee tier
    function _isValidPoolFeeTier(uint24 poolFeeTier) internal pure returns(bool) {
        if(poolFeeTier == 100  || poolFeeTier == 500 ||
           poolFeeTier == 3000 || poolFeeTier == 10000) return true;

        return false;
    }

    // fallback to receive ETH from Uniswap refunds if needed
    receive() external payable {}

    // used to refund partial unspent ETH back to user; copied unmodified from
    // https://github.com/Vectorized/solady/blob/main/src/utils/SafeTransferLib.sol#L90-L98
    function _safeTransferETH(address to, uint256 amount) internal {
        /// @solidity memory-safe-assembly
        assembly {
            if iszero(call(gas(), to, amount, codesize(), 0x00, codesize(), 0x00)) {
                mstore(0x00, 0xb12d13eb) // `ETHTransferFailed()`.
                revert(0x1c, 0x04)
            }
        }
    }

    // under normal use, this contract should never have a token or ETH balance > 0
    // in between transactions, so any tokens or eth that are in this contract
    // have been erroneously sent here and can be rescued by the owner
    function rescueToken(IERC20 token) external onlyOwner {
        uint256 tokenBalance = token.balanceOf(address(this));
        if(tokenBalance > 0) SafeERC20.safeTransfer(token, msg.sender, tokenBalance);
    }
    function rescueETH() external onlyOwner {
        uint256 ethBalance = address(this).balance;
        if(ethBalance > 0) _safeTransferETH(msg.sender, ethBalance);
    }
}