// SPDX-License-Identifier:MIT

pragma solidity ^0.8.20;

import { Test } from "forge-std/Test.sol";
import { UniswapV2Pair } from "../src/UniswapV2Pair.sol";

contract UniswapV2PairTest is Test {

    UniswapV2Pair pair;
    address _token0 = address(1);
    address _token1 = address(2);

    function setUp() public {
        pair = new UniswapV2Pair();
    }

    function testInitializeWorksCorrectly() external {
        pair.initialize(_token0, _token1);
        assertEq(pair.token0(), _token0);
        assertEq(pair.token1(), _token1);
        assertEq(pair.factory(), address(this));
    }

    function testCannotInitializeTwice() public {
        pair.initialize(_token0, _token1);
        vm.expectRevert();
        pair.initialize(_token0, _token1);
    }

    function testCannotInitializeWithZeroAddress() public {
        vm.expectRevert();
        pair.initialize(address(0), _token1);
    }

}