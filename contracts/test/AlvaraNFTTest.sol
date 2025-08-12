// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { AlvaraNFT } from "../src/AlvaraNFT.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { Test } from "forge-std/Test.sol";
import { console } from "forge-std/console.sol";

contract AlvaraNFTTest is Test {
    AlvaraNFT public alvaraNFT;
    
    // Mainnet addresses - only need veALVA now
    address constant VE_ALVA_TOKEN = 0x07157d55112A6bAdd62099B8ad0BBDfBC81075BD;
    
    // Test users
    address alice = makeAddr("alice");
    address bob = makeAddr("bob");
    address veAlvaHolder = makeAddr("veAlvaHolder");
    
    // Events
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    
    function setUp() public {
        // Deploy the contract
        alvaraNFT = new AlvaraNFT(
            VE_ALVA_TOKEN
        );

        // Ensure contract starts with 0 ETH (clean state)
        vm.deal(address(alvaraNFT), 0);
        assertEq(address(alvaraNFT).balance, 0, "AlvaraNFT should have 0 ETH");

        // Mock veALVA balance calls - alice and bob have 0, veAlvaHolder has enough for discount
        vm.mockCall(
            VE_ALVA_TOKEN,
            abi.encodeWithSelector(IERC20.balanceOf.selector, alice),
            abi.encode(0)
        );
        vm.mockCall(
            VE_ALVA_TOKEN,
            abi.encodeWithSelector(IERC20.balanceOf.selector, bob),
            abi.encode(0)
        );
        vm.mockCall(
            VE_ALVA_TOKEN,
            abi.encodeWithSelector(IERC20.balanceOf.selector, veAlvaHolder),
            abi.encode(1000e18) // Above the 150e18 threshold
        );

        // verify immediate minting fails
        assertEq(alvaraNFT.mintingEnabled(), false);
        uint256 price = alvaraNFT.standardPrice();
        vm.expectRevert("Minting disabled");
        alvaraNFT.mint{value: price}("TEST");

        // open minting
        alvaraNFT.openMinting();
        assertEq(alvaraNFT.mintingEnabled(), true);
        
        // Fund test accounts
        vm.deal(alice, 10 ether);
        vm.deal(bob, 10 ether);
        vm.deal(veAlvaHolder, 10 ether);
    }
    
    struct BalanceSnapshot {
        uint256 userETH;
        uint256 userNFTBalance;
        uint256 contractETH;
        uint256 nextTokenId;
        uint256 walletMints;
    }
    
    function takeSnapshot(address user) internal view returns (BalanceSnapshot memory) {
        return BalanceSnapshot({
            userETH: user.balance,
            userNFTBalance: alvaraNFT.balanceOf(user),
            contractETH: address(alvaraNFT).balance,
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
        console.log("Alice NFT balance:", pre.userNFTBalance);
        console.log("Contract ETH balance:", pre.contractETH);
        console.log("Next Token ID:", pre.nextTokenId);
        console.log("Alice mint count:", pre.walletMints);
        
        // Verify initial state
        assertEq(pre.userNFTBalance, 0, "Alice should start with 0 NFTs");
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
        
        alvaraNFT.mint{value: expectedPrice}(designId);
        
        // === POST-TRANSACTION VALIDATION ===
        BalanceSnapshot memory post = takeSnapshot(alice);
        
        console.log("\n=== AFTER MINT ===");
        console.log("Alice ETH balance:", post.userETH);
        console.log("Alice NFT balance:", post.userNFTBalance);
        console.log("Contract ETH balance:", post.contractETH);
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
        
        // 6. Contract should have received the ETH payment
        assertEq(
            post.contractETH,
            expectedPrice,
            "Contract should have received the ETH payment"
        );
        
        console.log("\n=== PAYMENT ANALYSIS ===");
        console.log("ETH spent:", expectedPrice);
        console.log("ETH in contract:", post.contractETH);
        
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
        alvaraNFT.mint{value: expectedPrice}(designId);
        
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
            post.contractETH,
            expectedPrice,
            "Contract should hold the ETH payment"
        );
        
        console.log("Discount mint successful!");
        console.log("Price paid:", expectedPrice);
        console.log("ETH in contract:", post.contractETH);
        
        vm.stopPrank();
    }
    
    function testMultipleMintsSameUser() public {
        vm.startPrank(alice);
        
        uint256 mintCount = 3;
        uint256 totalCost = alvaraNFT.standardPrice() * mintCount;
        
        BalanceSnapshot memory initial = takeSnapshot(alice);
        
        for (uint256 i = 0; i < mintCount; i++) {
            BalanceSnapshot memory pre = takeSnapshot(alice);
            
            string memory designId = string(abi.encodePacked("Design", vm.toString(i)));
            uint256 expectedTokenId = pre.nextTokenId;
            
            alvaraNFT.mint{value: alvaraNFT.standardPrice()}(designId);
            
            BalanceSnapshot memory post = takeSnapshot(alice);
            
            // Validate each mint
            assertEq(alvaraNFT.ownerOf(expectedTokenId), alice);
            assertEq(post.userNFTBalance, pre.userNFTBalance + 1);
            assertEq(post.nextTokenId, pre.nextTokenId + 1);
            assertEq(post.walletMints, pre.walletMints + 1);
            // Contract should accumulate ETH with each mint
            assertGt(post.contractETH, pre.contractETH);
        }
        
        BalanceSnapshot memory finalState = takeSnapshot(alice);
        
        // Final validations
        assertEq(finalState.userNFTBalance, mintCount, "Should have minted correct number of NFTs");
        assertEq(finalState.walletMints, mintCount, "Wallet mints should match");
        assertEq(initial.userETH - finalState.userETH, totalCost, "Total ETH spent should match");
        assertEq(finalState.contractETH, totalCost, "Contract should hold all ETH payments");
        
        console.log("Multiple mints successful!");
        console.log("NFTs minted:", mintCount);
        console.log("Total ETH spent:", totalCost);
        console.log("ETH in contract:", finalState.contractETH);
        
        vm.stopPrank();
    }
        
    function testIncorrectETHAmountReverts() public {
        vm.startPrank(alice);
        
        uint256 correctPrice = alvaraNFT.standardPrice();
        
        // Test underpayment
        vm.expectRevert("Incorrect ETH sent");
        alvaraNFT.mint{value: correctPrice - 1}("underpay");
        
        // Test overpayment
        vm.expectRevert("Incorrect ETH sent");
        alvaraNFT.mint{value: correctPrice + 1}("overpay");
        
        // Test zero payment
        vm.expectRevert("Incorrect ETH sent");
        alvaraNFT.mint{value: 0}("zero");
        
        // Verify balance unchanged
        assertEq(alvaraNFT.balanceOf(alice), 0, "No NFTs should be minted");
        
        vm.stopPrank();
    }

    function testMaxMintPerUser() public {
        assertEq(alvaraNFT.maxMintPerUser(), 3);

        vm.startPrank(alice);

        uint256 price = alvaraNFT.standardPrice();

        alvaraNFT.mint{value: price}("TEST");
        alvaraNFT.mint{value: price}("TEST");
        alvaraNFT.mint{value: price}("TEST");
        vm.expectRevert("Max mint per user");
        alvaraNFT.mint{value: price}("TEST");

        assertEq(alvaraNFT.balanceOf(alice), 3, "3 NFTs should be minted");

        vm.stopPrank();
    }

    function testMintingEndTime() public {
        vm.startPrank(alice);

        uint256 price = alvaraNFT.standardPrice();

        alvaraNFT.mint{value: price}("TEST");

        vm.warp(alvaraNFT.mintingEndTime());

        vm.expectRevert("Minting time expired");
        alvaraNFT.mint{value: price}("TEST");

        vm.stopPrank();
    }


}