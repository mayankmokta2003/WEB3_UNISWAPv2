// SPDX-License-Identifier:MIT

pragma solidity ^0.8.20;

contract UniswapV2Pair {

    error AlreadyInitialized();
    error ZeroAddress();



    /*//////////////////////////////////////////////////////////////
                              EVENTS
    //////////////////////////////////////////////////////////////*/
    event Mint(address indexed sender, uint amount0, uint amount1);
    event Burn(address indexed sender, uint amount0, uint amount1, address indexed to);
    event Swap(
        address indexed sender,
        uint amount0In,
        uint amount1In,
        uint amount0Out,
        uint amount1Out,
        address indexed to
    );
    event Sync(uint112 reserve0, uint112 reserve1);




    /*//////////////////////////////////////////////////////////////
                           STATE VARIABLES
    //////////////////////////////////////////////////////////////*/

    address public factory;
    address public token0;
    address public token1;
    uint112 private reserve0;
    uint112 private reserve1;
    uint32 private blockTimestampLast;
    bool private initialized;


    function initialize(address _token0, address _token1) external{
        if(initialized) revert AlreadyInitialized();
        if(_token0 == address(0) || _token1 == address(0)) revert ZeroAddress();
        token0 = _token0;
        token1 = _token1;
        factory = msg.sender;
        initialized = true;
    }


    function _update(uint256 balance0, uint256 balance1) internal {
        require(balance0 <= type(uint112).max, "OVERFLOW");
        require(balance1 <= type(uint112).max, "OVERFLOW");
        reserve0 = uint112(balance0);
        reserve1 = uint112(balance1);
        blockTimestampLast = uint32(block.timestamp);
        emit Sync(reserve0, reserve1);
    }






    /*//////////////////////////////////////////////////////////////
                           VIEW FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    function getReserves() public view returns (uint112, uint112, uint32){
        return(reserve0, reserve1, blockTimestampLast);
    }

}