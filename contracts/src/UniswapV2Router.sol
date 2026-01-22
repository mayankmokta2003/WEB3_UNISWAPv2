// SPDX-License-Identifier:MIT

pragma solidity ^0.8.20;

import {IERC20} from "../lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import { UniswapV2Factory } from "./UniswapV2Factory.sol";

interface IUniswapV2Pair {
    function mint() external returns (uint256);
    function swap(uint amount0Out, uint amount1Out, address to) external;
    function getReserves() external view returns (uint112, uint112, uint32);
    function burn(address to) external returns(uint256, uint256);
}

interface IUniswapV2Factory {
    function createPair(address tokenA, address tokenB) external returns (address pair);
    // function getPair(address tokenA, address tokenB) external view returns (address pair);
}

contract UniswapV2Router {
    address public immutable factory;
    address public immutable token0;
    address public immutable token1;

    constructor(address _factory, address _token0, address _token1) {
        factory = _factory;
        token0 = _token0;
        token1 = _token1;
    }

    modifier ensure(uint256 deadline) {
        require(deadline >= block.timestamp, "EXPIRED");
        _;
    }


    function _sortTokens(address tokenA, address tokenB)
    internal
    pure
    returns (address token0, address token1)
{
    require(tokenA != tokenB, "IDENTICAL_ADDRESSES");
    (token0, token1) = tokenA < tokenB
        ? (tokenA, tokenB)
        : (tokenB, tokenA);
}


    function getAmountOut(
        uint256 amountIn,
        uint256 reserveIn,
        uint256 reserveOut
    ) public pure returns (uint256 amountOut) {
        require(amountIn > 0, "INSUFFICIENT_INPUT");
        require(reserveIn > 0 && reserveOut > 0, "INSUFFICIENT_LIQUIDITY");
        uint256 amountInWithFees = amountIn * 997;
        amountOut =
            (amountInWithFees * reserveOut) /
            (reserveIn * 1000 + amountInWithFees);
    }


    function addLiquidity(
    address tokenA,
    address tokenB,
    uint256 amountA,
    uint256 amountB
) external {

    (address token0, address token1) = _sortTokens(tokenA, tokenB);

    address pair = UniswapV2Factory(factory).getPair(token0, token1);

    if (pair == address(0)) {
        pair = UniswapV2Factory(factory).createPair(token0, token1);
    }

    IERC20(tokenA).transferFrom(msg.sender, pair, amountA);
    IERC20(tokenB).transferFrom(msg.sender, pair, amountB);

    IUniswapV2Pair(pair).mint();
}




    function removeLiquidity(
        address tokenA,
        address tokenB,
        uint256 liquidity
    ) external returns (uint256 amount0, uint256 amount1) {
        // address pair = IUniswapV2Factory(factory).getPair(tokenA, tokenB);
        address pair = UniswapV2Factory(factory).getPair(tokenA, tokenB);
        IERC20(pair).transferFrom(msg.sender, pair, liquidity);
        (amount0, amount1) = IUniswapV2Pair(pair).burn(msg.sender);
    }




    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address tokenIn,
        address tokenOut,
        address to,
        uint256 deadline
    ) external ensure(deadline) {

        // address pair = _getPair(tokenIn, tokenOut);
        address pair = UniswapV2Factory(factory).getPair(tokenIn, tokenOut);
        (uint112 r0, uint112 r1, ) = IUniswapV2Pair(pair).getReserves();
        uint amountOut;
        bool zeroForOne = tokenIn < tokenOut;

        if (zeroForOne) {
            amountOut = getAmountOut(amountIn, r0, r1);
            require(amountOut >= amountOutMin, "SLIPPAGE_TOO_HIGH");
            IERC20(tokenIn).transferFrom(msg.sender, pair, amountIn);
            IUniswapV2Pair(pair).swap(0, amountOut, to);
        } else {
            amountOut = getAmountOut(amountIn, r1, r0);
            require(amountOut >= amountOutMin, "SLIPPAGE_TOO_HIGH");
            IERC20(tokenOut).transferFrom(msg.sender, pair, amountIn);
            IUniswapV2Pair(pair).swap(amountOut, 0, to);
        }
    }



    // function _getPair(address tokenA, address tokenB) internal view returns(address pair){
    //     pair = IUniswapV2Factory(factory).getPair(tokenA, tokenB);
    //     require(pair != address(0), "PAIR_DOES_NOT_EXIST");
    // }



}
