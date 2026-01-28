// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import { Test,console } from "forge-std/Test.sol";
import { UniswapV2Pair } from "../src/UniswapV2Pair.sol";
import { ERC20Mock } from "../lib/openzeppelin-contracts/contracts/mocks/token/ERC20Mock.sol";
import { UniswapV2Router } from "../src/UniswapV2Router.sol";
import { UniswapV2Factory } from "../src/UniswapV2Factory.sol";

contract Uniswaptests is Test{

    ERC20Mock token0;
    ERC20Mock token1;
    UniswapV2Factory factory;
    // address pair;
    // UniswapV2Pair pair;
    UniswapV2Router router;
    address user = makeAddr("user");


    function setUp() external {

        token0 = new ERC20Mock("token0", "t0");
        token1 = new ERC20Mock("token1", "t1");
        factory = new UniswapV2Factory();
        // pair = factory.createPair(address(token0), address(token1));
        router =  new UniswapV2Router(address(factory), address(token0), address(token1));
        // pair = new UniswapV2Pair();
        // pair.initialize(address(token0), address(token1));

    }


    function testAddsLiquidity() external {
        token0.mint(address(user), 100);
        token1.mint(address(user), 100);
        vm.startPrank(user);
        token0.approve(address(router), 100);
        token1.approve(address(router), 100);
        address pair = factory.createPair(address(token0), address(token1));
        router.addLiquidity(address(token0), address(token1), 50, 40);
        uint256 balance0 = token0.balanceOf(address(pair));
        uint256 balance1 = token1.balanceOf(address(pair));
        (uint256 x, uint256 y, uint256 z) = UniswapV2Pair(pair).getReserves();
        console.log("xxxxxxxxxxxx", x, y);
        assertEq(balance0, y);
        assertEq(balance1, x);
        vm.stopPrank();
    }


    


    function testSwapWorksCorrectly() external{
        token0.mint(address(user), 100);
        token1.mint(address(user), 100);
        vm.startPrank(user);
        token0.approve(address(router), 100);
        token1.approve(address(router), 100);
        address pair = factory.createPair(address(token0), address(token1));
        router.addLiquidity(address(token0), address(token1), 50, 40);
        token0.approve(address(router), 20);
        router.swapExactTokensForTokens(10, 0, address(token0), address(token1), user, block.timestamp);
        assertEq(token0.balanceOf(user), 50);
        vm.stopPrank();
    }


    function testResertsIfSipageIsHigh() external {
        token0.mint(address(user), 100);
        token1.mint(address(user), 100);
        vm.startPrank(user);
        token0.approve(address(router), 100);
        token1.approve(address(router), 100);
        address pair = factory.createPair(address(token0), address(token1));
        router.addLiquidity(address(token0), address(token1), 50, 40);
        token0.approve(address(router), 20);
        vm.expectRevert("SLIPPAGE_TOO_HIGH");
        router.swapExactTokensForTokens(10, 20, address(token1), address(token0), user, block.timestamp);
        vm.stopPrank();
    }


    function removeLiquidityWorks() external{
        token0.mint(address(user), 100);
        token1.mint(address(user), 100);
        vm.startPrank(user);
        token0.approve(address(router), 100);
        token1.approve(address(router), 100);
        address pair = factory.createPair(address(token0), address(token1));
        router.addLiquidity(address(token0), address(token1), 50, 40);
        UniswapV2Pair(pair).approve(address(router), 100);
        router.removeLiquidity(address(token0), address(token1), 5);
        assertEq(token0.balanceOf(user), 50);
        vm.stopPrank();
    }

    function testGetAmountOutWorks() external {
        uint256 reserveIn = 120;
        uint256 reserveOut = 180;
        uint256 amountIn = 20;
        uint256 amountOut = router.getAmountOut(amountIn, reserveIn, reserveOut);
        assertEq(amountOut, 25);
    }


    function testPairFunctionsWorks() external{
        ERC20Mock tokenA = new ERC20Mock("taaa", "ta");
        ERC20Mock tokenB = new ERC20Mock("tbbb", "tb");
        UniswapV2Pair pair = new UniswapV2Pair();
        pair.initialize(address(tokenA), address(tokenB));
        uint256 amount = 100 ether;
        tokenA.mint(address(this), amount);
        tokenB.mint(address(this), amount);
        tokenA.transfer(address(pair), amount);
        tokenB.transfer(address(pair), amount);
        uint256 liq = pair.mint();
        uint256 lpBal = pair.balanceOf(address(this));
        assert(lpBal == liq);
        pair.transfer(address(pair), lpBal);
        pair.burn(address(this));
        assertEq(pair.balanceOf(address(this)), 0);
    }

    

}