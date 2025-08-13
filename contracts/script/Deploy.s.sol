// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {AlvaraNFT} from "../src/AlvaraNFT.sol";

contract DeployScript is Script {
    // Mainnet veALVA token address
    address constant VE_ALVA_TOKEN = 0x07157d55112A6bAdd62099B8ad0BBDfBC81075BD;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);

        // Deploy AlvaraNFT
        AlvaraNFT alvaraNFT = new AlvaraNFT(VE_ALVA_TOKEN);
        
        console.log("AlvaraNFT deployed to:", address(alvaraNFT));
        console.log("veALVA Token:", VE_ALVA_TOKEN);

        vm.stopBroadcast();
    }
}
