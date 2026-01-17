// SPDX-License-Identifier:MIT

pragma solidity ^0.8.20;

import { UniswapV2Pair } from "../src/UniswapV2Pair.sol";
import { Script } from "forge-std/Script.sol";
import { ERC20Mock } from "../lib/openzeppelin-contracts/contracts/mocks/token/ERC20Mock.sol";

contract DeployPair is Script {

    function run() external {

        vm.startBroadcast();
        ERC20Mock token0 = new ERC20Mock();
        ERC20Mock token1 = new ERC20Mock();
        UniswapV2Pair pair = new UniswapV2Pair();
        pair.initialize(address(token0), address(token1));
        vm.stopBroadcast();

    }

}