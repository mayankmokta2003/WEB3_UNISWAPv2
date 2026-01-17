// SPDX-License-Identifier:MIT

pragma solidity ^0.8.20;

import { Test } from "forge-std/Test.sol";
import { UniswapV2Pair } from "../src/UniswapV2Pair.sol";
import { MockERC20 } from "../src/MockERC20.sol";

contract Handler is Test{

    UniswapV2Pair pair;
    MockERC20 token0;
    MockERC20 token1;

    constructor(UniswapV2Pair _pair, MockERC20 _token0, MockERC20 _token1) {
        pair = _pair;
        token0 = _token0;
        token1 = _token1;
    }


    function mint(uint256 amount0, uint256 amount1) external {
        amount0 = bound(amount0, 1, 100);
        amount1 = bound(amount1, 1, 100);
        token0.mint(address(pair), amount0);
        token1.mint(address(pair), amount1);
        pair.mint();
    }

    // ye fn samaj ni aye 
    function swap0For1(uint amountOut) public {
        ( , uint112 r1, ) = pair.getReserves();
        if (r1 == 0) return;

        amountOut = bound(amountOut, 1, r1 / 10);
        token0.mint(address(pair), amountOut * 2);

        pair.swap(0, amountOut, address(this));
    }

    function swap1For0(uint amountOut) public {
        (uint112 r0, , ) = pair.getReserves();
        if (r0 == 0) return;

        amountOut = bound(amountOut, 1, r0 / 10);
        token1.mint(address(pair), amountOut * 2);

        pair.swap(amountOut, 0, address(this));
    }

}


contract UniswapInvariantTest is Test {

    UniswapV2Pair pair;
    MockERC20 token0;
    MockERC20 token1;
    Handler handler;
    uint lastK;

    function setUp() public {

        pair = new UniswapV2Pair();
        token0 = new MockERC20("TokenA", "A");
        token1 = new MockERC20("TokenB", "B");

        pair.initialize(address(token0), address(token1));
        handler = new Handler(pair, token0, token1);
        targetContract(address(handler));
    }

    // function invariant_kNeverDecreases() public view{
    //     (uint112 r0, uint112 r1, ) = pair.getReserves();
    //     uint256 k = uint256(r0) * uint256(r1);
    //     assert(k >= 0);
    // }

    function invariant_kNeverDecreases() public {
    uint k = pair.kLast();
    assertGe(k, lastK);
    lastK = k;
}

}