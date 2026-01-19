// SPDX-License-Identifier:MIT

pragma solidity ^0.8.20;

import {IERC20} from "../lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";

interface IUniswapV2Pair {
    function mint() external returns (uint256);

    function swap(uint amount0Out, uint amount1Out, address to) external;

    function getReserves() external view returns (uint112, uint112, uint32);

    function burn(address to) external returns(uint256, uint256);
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

    modifier ensure(uint256 deadline) {
        require(deadline >= block.timestamp, "EXPIRED");
        _;
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

    function addLiquidity(uint256 amount0, uint256 amount1) external {
        IERC20(token0).transferFrom(msg.sender, pair, amount0);
        IERC20(token1).transferFrom(msg.sender, pair, amount1);
        IUniswapV2Pair(pair).mint();
    }

    function removeLiquidity(
        uint256 liquidity,
        address to,
        uint256 deadline
    ) external ensure(deadline) returns (uint256 amount0, uint256 amount1) {
        IERC20(pair).transferFrom(msg.sender, pair, liquidity);
        (amount0, amount1) = IUniswapV2Pair(pair).burn(to);
    }




    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external ensure(deadline) {
        require(path.length == 2, "ONLY_SINGLE_PAIR_SUPPORTED");
        address tokenIn = path[0];
        address tokenOut = path[1];

        require(
            (tokenIn == token0 && tokenOut == token1) ||
                (tokenIn == token1 && tokenOut == token0),
            "INVALID_PATH"
        );

        (uint112 r0, uint112 r1, ) = IUniswapV2Pair(pair).getReserves();
        uint amountOut;
        bool zeroForOne = tokenIn == token0;

        if (zeroForOne) {
            amountOut = getAmountOut(amountIn, r0, r1);
            require(amountOut >= amountOutMin, "SLIPPAGE_TOO_HIGH");
            IERC20(token0).transferFrom(msg.sender, pair, amountIn);
            IUniswapV2Pair(pair).swap(0, amountOut, to);
        } else {
            amountOut = getAmountOut(amountIn, r1, r0);
            require(amountOut >= amountOutMin, "SLIPPAGE_TOO_HIGH");
            IERC20(token1).transferFrom(msg.sender, pair, amountIn);
            IUniswapV2Pair(pair).swap(amountOut, 0, to);
        }
    }
}
