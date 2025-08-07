// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MockUniswapV4Router {
    // Mock function that simulates swapping ETH for tokens
    function swapExactETHForTokensSupportingFeeOnTransferTokens(
        uint /* amountOutMin */,
        address tokenOut,
        address to,
        uint /* deadline */
    ) external payable {
        // In a real scenario, this would swap ETH for tokens
        // For testing, we'll just mint some tokens to the recipient
        // This simulates the swap behavior
        
        // Calculate a mock amount of tokens (1 ETH = 1000 tokens for testing)
        uint256 tokenAmount = msg.value * 1000;
        
        // Mint tokens to the recipient (assuming the token has a mint function)
        // Note: This is a simplified mock - in reality, the router would call the actual swap
        IERC20(tokenOut).transfer(to, tokenAmount);
        
        // Return any excess ETH
        if (address(this).balance > 0) {
            payable(msg.sender).transfer(address(this).balance);
        }
    }

    // Allow the contract to receive ETH
    receive() external payable {}
} 