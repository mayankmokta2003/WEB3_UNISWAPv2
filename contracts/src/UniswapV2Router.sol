// SPDX-License-Identifier:MIT

pragma solidity ^0.8.20;

import { IERC20 } from "../lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";


interface IUniswapV2Pair {
    function mint() external returns (uint256);
    function swap(uint amount0Out, uint amount1Out, address to) external;
    function getReserves() external view returns (uint112, uint112, uint32);
}

contract UniswapV2Router {

    address public immutable pair;
    address public immutable token0;
    address public immutable token1;


    constructor(address _pair, address _token0, address _token1) {
        pair = _pair;
        token0 = _token0;
        token1 = _token1;
    }


    function addLiquidity(uint256 amount0, uint256 amount1) external {

        IERC20(token0).transferFrom(msg.sender, pair, amount0);
        IERC20(token1).transferFrom(msg.sender, pair, amount1);
        IUniswapV2Pair(pair).mint();
        
    }



    function swapExactTokensForTokens(uint256 amountIn, uint256 amountOut, bool zeroForOne) external {
        if(zeroForOne){
            IERC20(token0).transferFrom(msg.sender, pair, amountIn);
            IUniswapV2Pair(pair).swap(0, amountOut, msg.sender);
        }else{
            IERC20(token1).transferFrom(msg.sender, pair, amountIn);
            IUniswapV2Pair(pair).swap(amountOut, 0, msg.sender);
        }
    }



    function getAmountOut(uint256 amountIn, uint256 reserveIn, uint256 reserveOut) external pure returns (uint256 amountOut){
        require(amountIn > 0, "INSUFFICIENT_INPUT");
        require(reserveIn > 0 && reserveOut > 0, "INSUFFICIENT_LIQUIDITY");
        uint256 amountInWithFees = amountIn * 997;
        amountOut = (amountInWithFees * reserveOut) / (reserveIn * 1000 + amountInWithFees);
    }


    

}