// SPDX-License-Identifier:MIT

pragma solidity ^0.8.20;

import { ERC20 } from "../lib/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

contract UniswapV2ERC20 is ERC20 {

    constructor() ERC20("LP tokens", "lp") {}

    function _mintLp(address to, uint256 amount) internal {
        _mint(to, amount);
    }

    function _burnLp(address from, uint256 amount) internal {
        _burn(from, amount);
    }

}