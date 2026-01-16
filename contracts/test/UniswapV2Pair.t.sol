// SPDX-License-Identifier:MIT

pragma solidity ^0.8.20;

import { Test,console } from "forge-std/Test.sol";
import { UniswapV2Pair } from "../src/UniswapV2Pair.sol";
import { MockERC20 } from "../src/MockERC20.sol";

contract TestPair is UniswapV2Pair {
    function updatedForTest(uint256 b0, uint256 b1) external {
        _update(b0, b1);
    }
}

contract UniswapV2PairTest is Test {

    UniswapV2Pair pair;
    // TestPair  testPair;
    address _token0 = address(1);
    address _token1 = address(2);
    MockERC20 token0;
    MockERC20 token1;

    function setUp() public {
        pair = new UniswapV2Pair();
        // testPair = new TestPair();
        token0 = new MockERC20("token0", "t0");
        token1 = new MockERC20("token1", "t1");
        pair.initialize(address(token0), address(token1));
    }

    function testInitializeWorksCorrectly() external view{
        assertEq(pair.token0(), address(token0));
        assertEq(pair.token1(), address(token1));
        assertEq(pair.factory(), address(this));
    }

    function testCannotInitializeTwice() public {
        vm.expectRevert();
        pair.initialize(address(token0), address(token1));
    }

    function testCannotInitializeWithZeroAddress() public {
        vm.expectRevert();
        pair.initialize(address(0), address(token1));
    }

    // function testUpdateReserves() public {

    //     uint256 balance0 = 100 ether;
    //     uint256 balance1 = 200 ether;
    //     // pair._update(balance0, balance1);
    //     testPair.updatedForTest(balance0, balance1);
    //     (uint112 r0, uint112 r1, ) = pair.getReserves();
    //     assert(balance0 == r0);
    //     assert(balance1 == r1);
    // }   


    function testMintLiquidity() external {
        token0.mint(address(pair), 10);
        token1.mint(address(pair), 20);
        pair.mint();
        (uint112 r0, uint112 r1, ) = pair.getReserves();
        assert(r0 == 10);
        assert(r1 == 20);
    }


    function testMintLPFirstTime() public {
        (token0).mint(address(pair), 100);
        token1.mint(address(pair), 200);
        uint256 lp = pair.mint();
        uint256 bal = pair.balanceOf(address(this));
        console.log("lpppp", bal);
        assertGt(lp, 0);
        assert(bal == lp);
    }

    // function testBurnLiquidity() public {
    //     token0
    // }

}