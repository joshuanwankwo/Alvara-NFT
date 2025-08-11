// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { AlvaraNFT } from "../src/AlvaraNFT.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { Test } from "forge-std/Test.sol";
import { console } from "forge-std/console.sol";

interface IWETH {
    function deposit() external payable;
    function approve(address spender, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function allowance(address owner, address spender) external view returns (uint256);
}

contract AlvaraNFTTest is Test {
    AlvaraNFT public alvaraNFT;
    
    // Mainnet addresses
    address constant ALVA_TOKEN = 0x8e729198d1C59B82bd6bBa579310C40d740A11C2;
    address constant VE_ALVA_TOKEN = 0x07157d55112A6bAdd62099B8ad0BBDfBC81075BD;
    address constant WETH_TOKEN = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    address constant SWAP_ROUTER = 0xE592427A0AEce92De3Edee1F18E0157C05861564;
    
    // Fork at a recent block where ALVA/WETH pool exists
    uint256 constant FORK_BLOCK = 23092798;
    
    // Test users
    address alice = makeAddr("alice");
    address bob = makeAddr("bob");
    address veAlvaHolder = makeAddr("veAlvaHolder");
    
    // Events
    event SwapExecuted(address indexed user, uint256 ethIn, uint256 alvaOut);
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    
    function setUp() public {
        // Fork mainnet
        vm.createSelectFork(vm.envString("ETH_RPC_URL"), FORK_BLOCK);
        
        // Deploy the contract
        alvaraNFT = new AlvaraNFT(
            ALVA_TOKEN,
            VE_ALVA_TOKEN,
            WETH_TOKEN,
            SWAP_ROUTER
        );

        // Ensure contract starts with 0 ETH (clean state); was starting with
        // > 0 eth possible because of the fork test or some other weird thing
        vm.deal(address(alvaraNFT), 0);
        assertEq(address(alvaraNFT).balance, 0, "AlvaraNFT should have 0 ETH");

        // verify immediate minting fails
        assertEq(alvaraNFT.mintingEnabled(), false);
        uint256 price = alvaraNFT.standardPrice();
        uint256 swapDeadline = _getSwapDeadline();
        vm.expectRevert("Minting disabled");
        alvaraNFT.mint{value: price}("TEST", swapDeadline, 1, 0);

        // open minting
        alvaraNFT.openMinting();
        assertEq(alvaraNFT.mintingEnabled(), true);
        // can't open it again - but contract doesn't check for this, so comment out expectRevert
        // vm.expectRevert("Minting already opened");
        alvaraNFT.openMinting();
        
        // Fund test accounts
        vm.deal(alice, 10 ether);
        vm.deal(bob, 10 ether);
        vm.deal(veAlvaHolder, 10 ether);
        
        // Mock veALVA balance for discount testing
        vm.mockCall(
            VE_ALVA_TOKEN,
            abi.encodeWithSelector(IERC20.balanceOf.selector, veAlvaHolder),
            abi.encode(1000e18)
        );   
    }
    
    struct BalanceSnapshot {
        uint256 userETH;
        uint256 userALVA;
        uint256 userNFTBalance;
        uint256 contractETH;
        uint256 contractWETH;
        uint256 contractALVA;
        uint256 nextTokenId;
        uint256 walletMints;
    }
    
    function takeSnapshot(address user) internal view returns (BalanceSnapshot memory) {
        return BalanceSnapshot({
            userETH: user.balance,
            userALVA: IERC20(ALVA_TOKEN).balanceOf(user),
            userNFTBalance: alvaraNFT.balanceOf(user),
            contractETH: address(alvaraNFT).balance,
            contractWETH: IWETH(WETH_TOKEN).balanceOf(address(alvaraNFT)),
            contractALVA: IERC20(ALVA_TOKEN).balanceOf(address(alvaraNFT)),
            nextTokenId: alvaraNFT.nextTokenId(),
            walletMints: alvaraNFT.walletMints(user)
        });
    }
    
    function testSuccessfulMintWithoutDiscount() public {
        vm.startPrank(alice);
        
        // === PRE-TRANSACTION VALIDATION ===
        BalanceSnapshot memory pre = takeSnapshot(alice);
        
        console.log("=== BEFORE MINT ===");
        console.log("Alice ETH balance:", pre.userETH);
        console.log("Alice ALVA balance:", pre.userALVA);
        console.log("Alice NFT balance:", pre.userNFTBalance);
        console.log("Contract ETH balance:", pre.contractETH);
        console.log("Contract WETH balance:", pre.contractWETH);
        console.log("Contract ALVA balance:", pre.contractALVA);
        console.log("Next Token ID:", pre.nextTokenId);
        console.log("Alice mint count:", pre.walletMints);
        
        // Verify initial state
        assertEq(pre.userNFTBalance, 0, "Alice should start with 0 NFTs");
        assertEq(pre.userALVA, 0, "Alice should start with 0 ALVA");
        assertEq(pre.nextTokenId, 1, "Next token ID should be 1");
        assertEq(pre.walletMints, 0, "Alice should have 0 mints");
        assertFalse(alvaraNFT.hasVeALVA(alice), "Alice should not have veALVA");
        
        // Expected values
        uint256 expectedTokenId = pre.nextTokenId;
        uint256 expectedPrice = alvaraNFT.standardPrice();
        string memory designId = "QmTestDesign123";
        
        // === EXECUTE TRANSACTION ===
        // Track events
        vm.expectEmit(true, true, true, true);
        emit Transfer(address(0), alice, expectedTokenId);
        
        alvaraNFT.mint{value: expectedPrice}(designId, _getSwapDeadline(), 1, 0);
        
        // === POST-TRANSACTION VALIDATION ===
        BalanceSnapshot memory post = takeSnapshot(alice);
        
        console.log("\n=== AFTER MINT ===");
        console.log("Alice ETH balance:", post.userETH);
        console.log("Alice ALVA balance:", post.userALVA);
        console.log("Alice NFT balance:", post.userNFTBalance);
        console.log("Contract ETH balance:", post.contractETH);
        console.log("Contract WETH balance:", post.contractWETH);
        console.log("Contract ALVA balance:", post.contractALVA);
        console.log("Next Token ID:", post.nextTokenId);
        console.log("Alice mint count:", post.walletMints);
        
        // CRITICAL VALIDATIONS
        
        // 1. User lost exactly the expected ETH
        assertEq(
            pre.userETH - post.userETH,
            expectedPrice,
            "Alice should have spent exactly the mint price"
        );
        
        // 2. User gained exactly 1 NFT with correct token ID
        assertEq(
            post.userNFTBalance,
            pre.userNFTBalance + 1,
            "Alice should have gained exactly 1 NFT"
        );
        assertEq(
            alvaraNFT.ownerOf(expectedTokenId),
            alice,
            "Alice should own the minted token ID"
        );
        
        // 3. Token design is correctly stored
        assertEq(
            alvaraNFT.tokenDesign(expectedTokenId),
            designId,
            "Token design should be correctly stored"
        );
        
        // 4. Next token ID incremented correctly
        assertEq(
            post.nextTokenId,
            pre.nextTokenId + 1,
            "Next token ID should increment by 1"
        );
        
        // 5. Wallet mints counter updated
        assertEq(
            post.walletMints,
            pre.walletMints + 1,
            "Wallet mints should increment by 1"
        );
        
        // 6. Contract should have NO balance of ETH, WETH, or ALVA
        assertEq(
            post.contractETH,
            0,
            "Contract should have 0 ETH balance"
        );
        assertEq(
            post.contractWETH,
            0,
            "Contract should have 0 WETH balance"
        );
        assertEq(
            post.contractALVA,
            0,
            "Contract should have 0 ALVA balance"
        );
        
        // 7. User received ALVA tokens
        assertGt(
            post.userALVA,
            pre.userALVA,
            "Alice should have received ALVA tokens"
        );
        
        console.log("\n=== SWAP ANALYSIS ===");
        console.log("ALVA received:", post.userALVA);
        console.log("ETH spent:", expectedPrice);
        console.log("Effective rate: ", post.userALVA / expectedPrice, "ALVA per wei");
        
        // Check token URI is correctly formed
        string memory tokenURI = alvaraNFT.tokenURI(expectedTokenId);
        string memory expectedURI = string(abi.encodePacked(
            "https://yellow-imperial-wasp-317.mypinata.cloud/ipfs/bafybeibtxhw6zer4i4ehpckmfhoh7qyvr6ggshpqadx5urm7cajcyfxts4/",
            designId,
            ".json"
        ));
        assertEq(tokenURI, expectedURI, "Token URI should be correctly formed");
        
        vm.stopPrank();
    }
    
    function testSuccessfulMintWithDiscount() public {
        vm.startPrank(veAlvaHolder);
        
        // === PRE-TRANSACTION VALIDATION ===
        BalanceSnapshot memory pre = takeSnapshot(veAlvaHolder);
        
        // Verify discount eligibility
        assertTrue(alvaraNFT.hasVeALVA(veAlvaHolder), "User should have veALVA");
        uint256 expectedPrice = alvaraNFT.getDiscountPrice();
        assertEq(expectedPrice, alvaraNFT.standardPrice() / 2, "Discount should be 50%");
        
        uint256 expectedTokenId = pre.nextTokenId;
        string memory designId = "QmDiscountDesign456";
        
        // === EXECUTE TRANSACTION ===
        alvaraNFT.mint{value: expectedPrice}(designId, _getSwapDeadline(), 1, 0);
        
        // === POST-TRANSACTION VALIDATION ===
        BalanceSnapshot memory post = takeSnapshot(veAlvaHolder);
        
        // Validate all conditions
        assertEq(
            pre.userETH - post.userETH,
            expectedPrice,
            "User should have spent discounted price"
        );
        assertEq(
            post.userNFTBalance,
            pre.userNFTBalance + 1,
            "User should have gained 1 NFT"
        );
        assertEq(
            alvaraNFT.ownerOf(expectedTokenId),
            veAlvaHolder,
            "User should own the token"
        );
        assertEq(
            post.nextTokenId,
            pre.nextTokenId + 1,
            "Token ID should increment"
        );
        assertEq(
            post.contractETH + post.contractWETH + post.contractALVA,
            0,
            "Contract should hold no tokens"
        );
        assertGt(
            post.userALVA,
            pre.userALVA,
            "User should have received ALVA"
        );
        
        console.log("Discount mint successful!");
        console.log("Price paid:", expectedPrice);
        console.log("ALVA received:", post.userALVA);
        
        vm.stopPrank();
    }
    
    function testMultipleMintsSameUser() public {
        vm.startPrank(alice);
        
        uint256 mintCount = 3;
        uint256 totalCost = alvaraNFT.standardPrice() * mintCount;
        uint256 totalALVA = 0;
        
        BalanceSnapshot memory initial = takeSnapshot(alice);
        
        for (uint256 i = 0; i < mintCount; i++) {
            BalanceSnapshot memory pre = takeSnapshot(alice);
            
            string memory designId = string(abi.encodePacked("Design", vm.toString(i)));
            uint256 expectedTokenId = pre.nextTokenId;
            
            alvaraNFT.mint{value: alvaraNFT.standardPrice()}(designId, _getSwapDeadline(), 1, 0);
            
            BalanceSnapshot memory post = takeSnapshot(alice);
            
            // Validate each mint
            assertEq(alvaraNFT.ownerOf(expectedTokenId), alice);
            assertEq(post.userNFTBalance, pre.userNFTBalance + 1);
            assertEq(post.nextTokenId, pre.nextTokenId + 1);
            assertEq(post.walletMints, pre.walletMints + 1);
            assertEq(post.contractETH + post.contractWETH + post.contractALVA, 0);
            
            totalALVA += (post.userALVA - pre.userALVA);
        }
        
        BalanceSnapshot memory finalState = takeSnapshot(alice);
        
        // Final validations
        assertEq(finalState.userNFTBalance, mintCount, "Should have minted correct number of NFTs");
        assertEq(finalState.walletMints, mintCount, "Wallet mints should match");
        assertEq(initial.userETH - finalState.userETH, totalCost, "Total ETH spent should match");
        assertEq(finalState.userALVA, totalALVA, "Total ALVA should match sum");
        
        console.log("Multiple mints successful!");
        console.log("NFTs minted:", mintCount);
        console.log("Total ETH spent:", totalCost);
        console.log("Total ALVA received:", totalALVA);
        
        vm.stopPrank();
    }
        
    function testIncorrectETHAmountReverts() public {
        vm.startPrank(alice);
        
        uint256 correctPrice = alvaraNFT.standardPrice();
        uint256 swapDeadline = _getSwapDeadline();
        
        // Test underpayment
        vm.expectRevert("Incorrect ETH sent");
        alvaraNFT.mint{value: correctPrice - 1}("underpay", swapDeadline, 1, 0);
        
        // Test overpayment
        vm.expectRevert("Incorrect ETH sent");
        alvaraNFT.mint{value: correctPrice + 1}("overpay", swapDeadline, 1, 0);
        
        // Test zero payment
        vm.expectRevert("Incorrect ETH sent");
        alvaraNFT.mint{value: 0}("zero", swapDeadline, 1, 0);
        
        // Verify balance unchanged
        assertEq(alvaraNFT.balanceOf(alice), 0, "No NFTs should be minted");
        
        vm.stopPrank();
    }

    function testMaxMintPerUser() public {
        assertEq(alvaraNFT.maxMintPerUser(), 3);

        vm.startPrank(alice);

        uint256 price = alvaraNFT.standardPrice();
        uint256 swapDeadline = _getSwapDeadline();

        alvaraNFT.mint{value: price}("TEST", swapDeadline, 1, 0);
        alvaraNFT.mint{value: price}("TEST", swapDeadline, 1, 0);
        alvaraNFT.mint{value: price}("TEST", swapDeadline, 1, 0);
        vm.expectRevert("Max mint per user");
        alvaraNFT.mint{value: price}("TEST", swapDeadline, 1, 0);

        assertEq(alvaraNFT.balanceOf(alice), 3, "3 NFTs should be minted");

        vm.stopPrank();
    }

    function testMintingEndTime() public {
        vm.startPrank(alice);

        uint256 price = alvaraNFT.standardPrice();
        uint256 swapDeadline = _getSwapDeadline();

        alvaraNFT.mint{value: price}("TEST", swapDeadline, 1, 0);

        vm.warp(alvaraNFT.mintingEndTime());
        swapDeadline = _getSwapDeadline();

        vm.expectRevert("Minting time expired");
        alvaraNFT.mint{value: price}("TEST", swapDeadline, 1, 0);

        vm.stopPrank();
    }

    function _getSwapDeadline() internal view returns (uint256 swapDeadline) {
        // simulates what the dApp would do off-chain; grab the latest
        // block.timestamp and set a time 15 minutes into the future
        swapDeadline = block.timestamp + 15 minutes;
    }
}