// SPDX-License-Identifier:MIT

pragma solidity ^0.8.20;

import { Test,console } from "forge-std/Test.sol";
import { UniswapV2Pair } from "../src/UniswapV2Pair.sol";
// import { MockERC20 } from "../src/MockERC20.sol";
import { ERC20Mock } from "../lib/openzeppelin-contracts/contracts/mocks/token/ERC20Mock.sol";
import { UniswapV2Router } from "../src/UniswapV2Router.sol";

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
    ERC20Mock token0;
    ERC20Mock token1;

    function setUp() public {
        pair = new UniswapV2Pair();
        // testPair = new TestPair();
        token0 = new ERC20Mock();
        token1 = new ERC20Mock();
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
        token0.mint(address(pair), 100);
        token1.mint(address(pair), 200);
        uint256 lp = pair.mint();
        uint256 bal = pair.balanceOf(address(this)); //doubtttt pair kyuu
        console.log("lpppp", bal);
        assertGt(lp, 0);
        assert(bal == lp);
    }

    function testBurnLiquidity() public {
        token0.mint(address(pair), 100);
        token1.mint(address(pair), 200);
        pair.mint();
        uint256 lp = pair.balanceOf(address(this));
        pair.transfer(address(pair), lp);
        pair.burn(address(this));
        assertEq(token0.balanceOf(address(this)), 100);
    }


    function testSwapToken0Out() public {
        token0.mint(address(pair), 100);
        token1.mint(address(pair), 100);
        pair.mint();
        token1.mint(address(pair), 10);
        pair.swap(5, 0, address(this));
        assertEq(token0.balanceOf(address(this)), 5);
    }


    function testAddLiquidityViaRouter() public {
        UniswapV2Router router = new UniswapV2Router(address(pair), address(token0), address(token1));
        token0.mint(address(this), 100);
        token1.mint(address(this), 100);
        token0.approve(address(router), 100);
        token1.approve(address(router), 100);
        router.addLiquidity(100, 100);
        (uint112 reserve0, uint112 reserve1, ) = pair.getReserves();
        assertEq(reserve0, 100);
        assertEq(reserve1, 100);
    }

}