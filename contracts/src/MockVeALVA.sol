// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MockVeALVA is ERC20, Ownable {
    constructor() ERC20("Mock veALVA", "mveALVA") Ownable(msg.sender) {
        // Mint some tokens to the deployer for testing
        _mint(msg.sender, 1000 * 10**decimals());
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external onlyOwner {
        _burn(from, amount);
    }
} 