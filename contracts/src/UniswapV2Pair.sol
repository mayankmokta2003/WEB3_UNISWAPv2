// SPDX-License-Identifier:MIT

pragma solidity ^0.8.20;

contract UniswapV2Pair {

    error AlreadyInitialized();
    error ZeroAddress();

    address public factory;
    address public token0;
    address public token1;

    uint112 private reserve0;
    uint112 private reserve1;
    uint32 private blockTimestampLast;





    function initialize(address _token0, address _token1) external {
        if(initialized) revert AlreadyInitialized();
        if(_token0 == address(0) || _token1 == address(0)) revert ZeroAddress();
    }




    /*//////////////////////////////////////////////////////////////
                           VIEW FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    function getReserves() public view returns (uint112, uint112, uint32){
        return(reserve0, reserve1, blockTimestampLast);
    }



}