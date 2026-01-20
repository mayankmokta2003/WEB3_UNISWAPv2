// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {UniswapV2Factory} from "../src/UniswapV2Factory.sol";
import {UniswapV2Router} from "../src/UniswapV2Router.sol";
import {ERC20Mock} from "../src/ERC20Mockk.sol";

contract Deploy is Script {
    function run() external {
        vm.startBroadcast();

        ERC20Mock token0 = new ERC20Mock("Token0", "TK0");
        ERC20Mock token1 = new ERC20Mock("Token1", "TK1");
        UniswapV2Factory factory = new UniswapV2Factory();
        UniswapV2Router router = new UniswapV2Router(
            address(factory),
            address(token0),
            address(token1)
        );

        console.log("Token0:", address(token0));
        console.log("Token1:", address(token1));
        console.log("Factory:", address(factory));
        console.log("Router:", address(router));
        vm.stopBroadcast();
    }
}
