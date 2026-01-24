// SPDX-License-Identifier:MIT

pragma solidity ^0.8.20;
import { UniswapV2Pair } from "./UniswapV2Pair.sol";

contract UniswapV2Factory {

    event PairCreated(address token0, address token1, address pair);
    mapping(address => mapping(address => address)) public getPair;
    address[] public allPairs;



    function createPair(address tokenA, address tokenB) external returns (address pair) {
    require(tokenA != tokenB, "IDENTICAL_ADDRESSES");

    (address token0, address token1) =
        tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);

    require(getPair[token0][token1] == address(0), "PAIR_EXISTS");

    UniswapV2Pair _pair = new UniswapV2Pair();
    _pair.initialize(token0, token1);

    pair = address(_pair);
    getPair[token0][token1] = pair;
    getPair[token1][token0] = pair;

    allPairs.push(pair);
    emit PairCreated(token0, token1, pair);
}






    // function getPairs(address tokenA, address tokenB) external view returns(address){
    //     return getPair[tokenA][tokenB];
    // }
}