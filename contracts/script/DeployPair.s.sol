// SPDX-License-Identifier:MIT

pragma solidity ^0.8.20;

import {UniswapV2Pair} from "../src/UniswapV2Pair.sol";
import {Script, console} from "forge-std/Script.sol";
// import {ERC20Mock} from "../lib/openzeppelin-contracts/contracts/mocks/token/ERC20Mock.sol";
import {ERC20Mock} from "../src/ERC20Mockk.sol";

contract DeployPair is Script {
    function run() external {
        vm.startBroadcast();

        ERC20Mock token0 = new ERC20Mock("Token0", "TK0");
        ERC20Mock token1 = new ERC20Mock("Token1", "TK1");

        UniswapV2Pair pair = new UniswapV2Pair();
        pair.initialize(address(token0), address(token1));

        console.log("token0", address(token0));
        console.log("Token1:", address(token1));
        console.log("Pair:", address(pair));

        vm.stopBroadcast();
    }
}
